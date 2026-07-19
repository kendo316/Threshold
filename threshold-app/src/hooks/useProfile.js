import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { reportSaveError } from '../utils/saveStatus';

export function useProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, 'users', uid, 'data', 'profile');
    getDoc(ref).then(snap => {
      setProfile(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
  }, [uid]);

  const saveProfile = async (data) => {
    const merged = { ...profile, ...data };
    try {
      const ref = doc(db, 'users', uid, 'data', 'profile');
      await setDoc(ref, merged);
      setProfile(merged);
      return true;
    } catch {
      reportSaveError(() => saveProfile(data));
      return false;
    }
  };

  return { profile, loading, saveProfile };
}
