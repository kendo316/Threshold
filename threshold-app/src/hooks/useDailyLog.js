import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';
import { useTodayKey } from './useTodayKey';

const EMPTY_DAY = { items: [], totalLoad: 0, notes: '' };

export function useDailyLog(uid) {
  const [logData, setLogData] = useState(EMPTY_DAY);
  const [loading, setLoading] = useState(true);
  const logDataRef = useRef(logData);
  const date = useTodayKey();
  // The day the in-memory data actually belongs to — compared against the
  // calendar at write time, so a save can never land on the wrong day.
  const loadedDateRef = useRef(date);

  useEffect(() => {
    // Reset first: on a day rollover this clears yesterday's items, and on
    // a uid change it guarantees a new sign-in never sees the previous
    // account's log, even for a moment.
    logDataRef.current = EMPTY_DAY;
    loadedDateRef.current = date;
    setLogData(EMPTY_DAY);
    setLoading(true);
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
    // Stamp the date at write time. If midnight passed while the app was
    // open (or a resume event hasn't landed yet), the in-memory data is
    // yesterday's — start the new day clean rather than dragging it over.
    const writeDate = localDateKey();
    if (writeDate !== loadedDateRef.current) {
      logDataRef.current = EMPTY_DAY;
      loadedDateRef.current = writeDate;
    }

    const previous = logDataRef.current;
    const updated = updater(previous);
    logDataRef.current = updated;
    setLogData(updated);
    try {
      const ref = doc(db, 'users', uid, 'logs', writeDate);
      await setDoc(ref, { ...updated, userId: uid, date: writeDate });
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
    if (trigger.isAntihistamine) updated.antihistamineToday = true;
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

  const setAntihistamineToday = (value, opts) =>
    applyChange(current => ({ ...current, antihistamineToday: value }), opts);

  return { logData, loading, addItem, removeItem, setMammalFree, setAcidBlockerToday, setAntihistamineToday };
}
