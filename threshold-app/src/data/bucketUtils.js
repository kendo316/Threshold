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

export function bucketAdvice(pct) {
  if (pct === 0) return null;
  if (pct > 75) return '⚠️ Your load is high. Worth being cautious about anything more today.';
  if (pct > 45) return "Moderate load. You're okay, but co-factors like heat or alcohol will add up fast.";
  return "✓ Load is low. You're in good shape for the day.";
}
