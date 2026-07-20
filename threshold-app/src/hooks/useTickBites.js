import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { localDateKey } from '../utils/dates';
import { reportSaveError } from '../utils/saveStatus';

function fetchBites(uid) {
  const q = query(collection(db, 'users', uid, 'tickBites'), orderBy('date', 'desc'));
  return getDocs(q).then(snap => snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

export function useTickBites(uid) {
  const [bites, setBites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset first so a uid change never shows another account's bites.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional privacy reset, same pattern as the other data hooks
    setBites([]);
    setLoading(true);
    if (!uid) return;
    fetchBites(uid).then(list => {
      setBites(list);
      setLoading(false);
    });
  }, [uid]);

  const addBite = async (data) => {
    try {
      await addDoc(collection(db, 'users', uid, 'tickBites'), {
        date: data.date ?? localDateKey(),
        region: data.region ?? null,
        bodyLocation: data.bodyLocation ?? null,
        attachmentDuration: data.attachmentDuration ?? null,
        tickSize: data.tickSize ?? null,
        loggedAt: new Date().toISOString(),
      });
      const list = await fetchBites(uid);
      setBites(list);
      return true;
    } catch {
      reportSaveError(() => addBite(data));
      return false;
    }
  };

  return { bites, loading, addBite };
}
