import { useState, useEffect } from 'react';
import { localDateKey } from '../utils/dates';

// iPhone users leave PWAs suspended overnight. On resume, iOS hands back
// the page exactly as it was frozen — still rendered with yesterday's date.
// This hook re-checks the calendar whenever the app wakes up (visibility,
// focus, bfcache restore) so everything keyed to "today" re-renders fresh
// before the user's first tap can write to the wrong day.
export function useTodayKey() {
  const [todayKey, setTodayKey] = useState(localDateKey);

  useEffect(() => {
    const check = () => setTodayKey(prev => {
      const now = localDateKey();
      return now === prev ? prev : now;
    });
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    window.addEventListener('pageshow', check);
    return () => {
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
      window.removeEventListener('pageshow', check);
    };
  }, []);

  return todayKey;
}
