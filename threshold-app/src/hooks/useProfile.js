import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { reportSaveError } from '../utils/saveStatus';

export function useProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(profile);

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, 'users', uid, 'data', 'profile');
    getDoc(ref).then(snap => {
      const data = snap.exists() ? snap.data() : null;
      profileRef.current = data;
      setProfile(data);
      setLoading(false);
    });
  }, [uid]);

  const saveProfile = async function save(data) {
    // Merge against the ref so a retry after other successful saves
    // layers onto the current profile instead of a stale snapshot.
    const merged = { ...profileRef.current, ...data };
    try {
      const ref = doc(db, 'users', uid, 'data', 'profile');
      await setDoc(ref, merged);
      profileRef.current = merged;
      setProfile(merged);
      return true;
    } catch {
      reportSaveError(() => save(data));
      return false;
    }
  };

  return { profile, loading, saveProfile };
}
