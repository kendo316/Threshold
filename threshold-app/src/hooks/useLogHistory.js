import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from './useDailyLog';
import { computeEffectiveLoad } from '../data/triggers';

function pastDateKeys(count) {
  const keys = [];
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(localDateKey(d));
  }
  return keys;
}

export function useLogHistory(uid, days = 30) {
  const [history, setHistory] = useState({});
  const [checkinHistory, setCheckinHistory] = useState({});
  const [loading, setLoading] = useState(true);

  const dateKeys = pastDateKeys(days);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);

    const fetchAll = async () => {
      const logPromises = dateKeys.map(key =>
        getDoc(doc(db, 'users', uid, 'logs', key)).then(snap => [key, snap.exists() ? snap.data() : null])
      );
      const checkinPromises = dateKeys.map(key =>
        getDoc(doc(db, 'users', uid, 'checkins', key)).then(snap => [key, snap.exists() ? snap.data() : null])
      );

      const [logEntries, checkinEntries] = await Promise.all([
        Promise.all(logPromises),
        Promise.all(checkinPromises),
      ]);

      setHistory(Object.fromEntries(logEntries.filter(([, v]) => v !== null)));
      setCheckinHistory(Object.fromEntries(checkinEntries.filter(([, v]) => v !== null)));
      setLoading(false);
    };

    fetchAll();
  }, [uid]);

  const appendItemToDate = useCallback(async (dateKey, trigger, amount, extra = {}) => {
    const { effectiveLoad: overrideLoad, ...itemFields } = extra;
    const effectiveLoad = overrideLoad ?? computeEffectiveLoad(trigger, amount);
    const newItem = {
      triggerId: trigger.id,
      label: trigger.label,
      category: trigger.cat,
      baseLoad: trigger.load,
      amount,
      effectiveLoad,
      ...itemFields,
      loggedAt: new Date().toISOString(),
    };

    const existing = history[dateKey] ?? { items: [], totalLoad: 0, dayContext: null, notes: '' };
    const items = [...existing.items, newItem];
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    const updated = { ...existing, items, totalLoad, userId: uid, date: dateKey };

    await setDoc(doc(db, 'users', uid, 'logs', dateKey), updated);
    setHistory(prev => ({ ...prev, [dateKey]: updated }));
  }, [uid, history]);

  return { history, checkinHistory, loading, dateKeys, appendItemToDate };
}
