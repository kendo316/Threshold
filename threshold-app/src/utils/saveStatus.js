// A failed Firestore write must never be silent — the whole app rests on
// trusting that what you logged was actually saved. Hooks report failures
// here; the app shell listens and shows a retryable error toast.

const listeners = new Set();

export function reportSaveError(retry) {
  listeners.forEach(listener => listener(retry));
}

export function onSaveError(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
