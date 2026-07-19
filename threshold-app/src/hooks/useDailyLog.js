import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';

export function useDailyLog(uid) {
  const [logData, setLogData] = useState({ items: [], totalLoad: 0, notes: '' });
  const [loading, setLoading] = useState(true);
  const date = localDateKey();

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, 'users', uid, 'logs', date);
    getDoc(ref).then(snap => {
      if (snap.exists()) setLogData(snap.data());
      setLoading(false);
    });
  }, [uid, date]);

  // Optimistic: the UI updates instantly, and honestly rolls back if the
  // write fails. A silently dropped log entry is the one failure mode this
  // app can't afford.
  const saveLog = async (updated) => {
    const previous = logData;
    setLogData(updated);
    try {
      const ref = doc(db, 'users', uid, 'logs', date);
      await setDoc(ref, { ...updated, userId: uid, date });
      return true;
    } catch {
      setLogData(previous);
      reportSaveError(() => saveLog(updated));
      return false;
    }
  };

  const addItem = async (trigger, amount) => {
    const multipliers = { small: 0.5, moderate: 1, large: 1.5 };
    const effectiveLoad = Math.round(trigger.load * multipliers[amount]);

    const newItem = {
      triggerId:     trigger.id,
      label:         trigger.label,
      category:      trigger.cat,
      baseLoad:      trigger.load,
      amount,
      effectiveLoad,
      loggedAt:      new Date().toISOString(),
    };

    const filteredItems = logData.items.filter(i => i.triggerId !== trigger.id);
    const items = [...filteredItems, newItem];
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    const updated = { ...logData, items, totalLoad };
    if (trigger.isAcidBlocker) updated.acidBlockerToday = true;
    return saveLog(updated);
  };

  const removeItem = async (triggerId) => {
    const items = logData.items.filter(i => i.triggerId !== triggerId);
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    const updated = { ...logData, items, totalLoad };
    return saveLog(updated);
  };

  const setMammalFree = async (value) => {
    const updated = { ...logData, mammalFree: value };
    return saveLog(updated);
  };

  const setAcidBlockerToday = async (value) => {
    const updated = { ...logData, acidBlockerToday: value };
    return saveLog(updated);
  };

  return { logData, loading, addItem, removeItem, setMammalFree, setAcidBlockerToday, saveLog };
}
