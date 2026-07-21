import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';
import { useTodayKey } from './useTodayKey';

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
  const historyRef = useRef(history);
  const todayKey = useTodayKey();

  const dateKeys = pastDateKeys(days);

  // Refetches when the day rolls over (app left open / resumed), so the
  // 30-day window slides forward and "yesterday" is actually yesterday.
  // Resets first so a uid change never shows another account's history.
  useEffect(() => {
    historyRef.current = {};
    setHistory({});
    setCheckinHistory({});
    setLoading(true);
    if (!uid) return;

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

      const logs = Object.fromEntries(logEntries.filter(([, v]) => v !== null));
      historyRef.current = logs;
      setHistory(logs);
      setCheckinHistory(Object.fromEntries(checkinEntries.filter(([, v]) => v !== null)));
      setLoading(false);
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, todayKey]);

  const appendItemToDate = useCallback(async function appendItem(dateKey, trigger, amount) {
    const multipliers = { small: 0.5, moderate: 1, large: 1.5 };
    const effectiveLoad = Math.round(trigger.load * multipliers[amount]);
    const newItem = {
      triggerId: trigger.id,
      label: trigger.label,
      category: trigger.cat,
      baseLoad: trigger.load,
      amount,
      effectiveLoad,
      loggedAt: new Date().toISOString(),
    };

    // Read from the ref, not closure state, so a retry after other
    // successful appends builds on the current day, not a stale snapshot.
    const existing = historyRef.current[dateKey] ?? { items: [], totalLoad: 0, notes: '' };
    const items = [...existing.items, newItem];
    const totalLoad = Math.min(100, items.reduce((s, i) => s + i.effectiveLoad, 0));
    const updated = { ...existing, items, totalLoad, userId: uid, date: dateKey };

    try {
      await setDoc(doc(db, 'users', uid, 'logs', dateKey), updated);
      historyRef.current = { ...historyRef.current, [dateKey]: updated };
      setHistory(historyRef.current);
      return true;
    } catch {
      reportSaveError(() => appendItem(dateKey, trigger, amount));
      return false;
    }
  }, [uid]);

  // Same storage shape as today's mammal-free flag — lets users backfill
  // days they forgot to mark. Reads from the ref so retries see current state.
  const setMammalFreeForDate = useCallback(async function setFlag(dateKey, value) {
    const existing = historyRef.current[dateKey] ?? { items: [], totalLoad: 0, notes: '' };
    const updated = { ...existing, mammalFree: value, userId: uid, date: dateKey };
    try {
      await setDoc(doc(db, 'users', uid, 'logs', dateKey), updated);
      historyRef.current = { ...historyRef.current, [dateKey]: updated };
      setHistory(historyRef.current);
      return true;
    } catch {
      reportSaveError(() => setFlag(dateKey, value));
      return false;
    }
  }, [uid]);

  return { history, checkinHistory, loading, dateKeys, appendItemToDate, setMammalFreeForDate };
}
