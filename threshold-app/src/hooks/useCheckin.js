import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';
import { useTodayKey } from './useTodayKey';

export function useCheckin(uid) {
  const [checkin, setCheckin] = useState(null);
  const [loading, setLoading] = useState(true);
  const date = useTodayKey();

  useEffect(() => {
    // Reset first so a uid change or day rollover never shows stale data.
    setCheckin(null);
    setLoading(true);
    if (!uid) return;
    const ref = doc(db, 'users', uid, 'checkins', date);
    getDoc(ref).then(snap => {
      if (snap.exists()) setCheckin(snap.data());
      setLoading(false);
    });
  }, [uid, date]);

  const saveCheckin = async function save(symptoms, reactionSeverity) {
    // Stamp the date at write time — this is the write that anchors the
    // eat→feel pairing, so it must key to the morning it actually happens,
    // even if the app was left open since yesterday.
    const writeDate = localDateKey();
    const previous = checkin;
    const data = {
      userId: uid,
      date: writeDate,
      symptoms,
      reactionSeverity,
      loggedAt: new Date().toISOString(),
    };
    setCheckin(data);
    try {
      const ref = doc(db, 'users', uid, 'checkins', writeDate);
      await setDoc(ref, data);
      return true;
    } catch {
      setCheckin(previous);
      reportSaveError(() => save(symptoms, reactionSeverity));
      return false;
    }
  };

  return { checkin, loading, saveCheckin };
}
