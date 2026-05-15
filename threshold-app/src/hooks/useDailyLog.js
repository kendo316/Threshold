import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyLog(uid) {
  const [logData, setLogData] = useState({ items: [], totalLoad: 0, dayContext: null, notes: '' });
  const [loading, setLoading] = useState(true);
  const date = todayKey();

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
    await saveLog(updated);
  };

  const setDayContext = async (ctx) => {
    const updated = { ...logData, dayContext: ctx };
    await saveLog(updated);
  };

  return { logData, loading, addItem, setDayContext, saveLog };
}
