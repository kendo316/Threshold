import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';

export function useCheckin(uid) {
  const [checkin, setCheckin] = useState(null);
  const [loading, setLoading] = useState(true);
  const date = localDateKey();

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, 'users', uid, 'checkins', date);
    getDoc(ref).then(snap => {
      if (snap.exists()) setCheckin(snap.data());
      setLoading(false);
    });
  }, [uid, date]);

  const saveCheckin = async (symptoms, reactionSeverity) => {
    const previous = checkin;
    const data = {
      userId: uid,
      date,
      symptoms,
      reactionSeverity,
      loggedAt: new Date().toISOString(),
    };
    setCheckin(data);
    try {
      const ref = doc(db, 'users', uid, 'checkins', date);
      await setDoc(ref, data);
      return true;
    } catch {
      setCheckin(previous);
      reportSaveError(() => saveCheckin(symptoms, reactionSeverity));
      return false;
    }
  };

  return { checkin, loading, saveCheckin };
}
