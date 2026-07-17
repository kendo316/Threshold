import { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export function useTickBites(uid) {
  const [tickBites, setTickBites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      const q = query(collection(db, 'users', uid, 'tickBites'), orderBy('loggedAt', 'desc'));
      const snap = await getDocs(q);
      setTickBites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load();
  }, [uid]);

  const addTickBite = useCallback(async (data) => {
    const id = String(Date.now());
    const record = { ...data, loggedAt: new Date().toISOString() };
    await setDoc(doc(db, 'users', uid, 'tickBites', id), record);
    setTickBites(prev => [{ id, ...record }, ...prev]);
  }, [uid]);

  const byDate = tickBites.reduce((acc, tb) => {
    (acc[tb.date] ??= []).push(tb);
    return acc;
  }, {});

  return { tickBites, byDate, loading, addTickBite };
}
