import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function nextDayKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + 1);
  return localDateKey(date);
}

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

  const saveLog = async (updated) => {
    const ref = doc(db, 'users', uid, 'logs', date);
    await setDoc(ref, { ...updated, userId: uid, date });
    setLogData(updated);
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
    await saveLog(updated);
  };

  const removeItem = async (triggerId) => {
    const items = logData.items.filter(i => i.triggerId !== triggerId);
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    const updated = { ...logData, items, totalLoad };
    await saveLog(updated);
  };

  const setMammalFree = async (value) => {
    const updated = { ...logData, mammalFree: value };
    await saveLog(updated);
  };

  const setAcidBlockerToday = async (value) => {
    const updated = { ...logData, acidBlockerToday: value };
    await saveLog(updated);
  };

  return { logData, loading, addItem, removeItem, setMammalFree, setAcidBlockerToday, saveLog };
}
