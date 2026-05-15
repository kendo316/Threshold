import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
    const ref = doc(db, 'users', uid, 'data', 'profile');
    const merged = { ...profile, ...data };
    await setDoc(ref, merged);
    setProfile(merged);
  };

  return { profile, loading, saveProfile };
}
