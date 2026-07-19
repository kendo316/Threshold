import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';

export function useDailyLog(uid) {
  const [logData, setLogData] = useState({ items: [], totalLoad: 0, notes: '' });
  const [loading, setLoading] = useState(true);
  const logDataRef = useRef(logData);
  const date = localDateKey();

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, 'users', uid, 'logs', date);
    getDoc(ref).then(snap => {
      if (snap.exists()) {
        logDataRef.current = snap.data();
        setLogData(snap.data());
      }
      setLoading(false);
    });
  }, [uid, date]);

  // Optimistic writes, expressed as updaters against the CURRENT data (via
  // ref) rather than snapshots. This means a retry after other successful
  // saves re-applies the change on top of them instead of clobbering them.
  // Rollback only happens if nothing newer has been applied since.
  const applyChange = async function apply(updater, { reportFailure = true } = {}) {
    const previous = logDataRef.current;
    const updated = updater(previous);
    logDataRef.current = updated;
    setLogData(updated);
    try {
      const ref = doc(db, 'users', uid, 'logs', date);
      await setDoc(ref, { ...updated, userId: uid, date });
      return true;
    } catch {
      if (logDataRef.current === updated) {
        logDataRef.current = previous;
        setLogData(previous);
      }
      if (reportFailure) reportSaveError(() => apply(updater));
      return false;
    }
  };

  const addItem = (trigger, amount) => applyChange(current => {
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

    const items = [...current.items.filter(i => i.triggerId !== trigger.id), newItem];
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    const updated = { ...current, items, totalLoad };
    if (trigger.isAcidBlocker) updated.acidBlockerToday = true;
    return updated;
  });

  const removeItem = (triggerId) => applyChange(current => {
    const items = current.items.filter(i => i.triggerId !== triggerId);
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    return { ...current, items, totalLoad };
  });

  const setMammalFree = (value) =>
    applyChange(current => ({ ...current, mammalFree: value }));

  const setAcidBlockerToday = (value, opts) =>
    applyChange(current => ({ ...current, acidBlockerToday: value }), opts);

  return { logData, loading, addItem, removeItem, setMammalFree, setAcidBlockerToday };
}
