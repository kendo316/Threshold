import { P } from './palette';

export function bucketColor(pct) {
  if (pct < 30) return P.green;
  if (pct < 55) return P.amber;
  if (pct < 80) return P.orange;
  return P.red;
}

export function bucketBg(pct) {
  if (pct < 30) return P.greenLight;
  if (pct < 55) return P.amberLight;
  if (pct < 80) return P.orangeLight;
  return P.redLight;
}

export function bucketLabel(pct) {
  if (pct < 30) return 'Low Load';
  if (pct < 55) return 'Moderate';
  if (pct < 80) return 'High Load';
  return 'Near Limit';
}

export function bucketAdvice(pct, ctxId) {
  if (pct === 0) return null;
  if (pct > 75) {
    if (ctxId === 'travel' || ctxId === 'social')
      return '⚠️ Your load is high and you have plans. Be selective about what you add from here.';
    return '⚠️ Your load is high. Worth being cautious about anything more today.';
  }
  if (pct > 45) {
    if (ctxId === 'home') return 'Moderate load — you have headroom, but keep track.';
    return "Moderate load. You're okay, but co-factors like heat or alcohol will add up fast.";
  }
  if (ctxId === 'home') return "✓ Load is low. Good day to relax your guard if you want to.";
  return "✓ Load is low. You're in good shape for the day.";
}
