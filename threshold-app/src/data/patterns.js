import { localDateKey, nextDayKey } from '../utils/dates.js';

// A day only counts as a "pair" when it has both a log AND a next-morning
// check-in. Patterns stay silent until each comparison group has at least
// MIN_GROUP pairs — a pattern shown too early is worse than none.
const MIN_GROUP = 3;

function rate(pairs) {
  return { sym: pairs.filter(p => p.symptomatic).length, total: pairs.length };
}

export function computePatterns({ history, checkinHistory, todayCheckin, thresholds }) {
  const today = localDateKey();
  const pairs = [];

  for (const [dateKey, log] of Object.entries(history ?? {})) {
    const next = nextDayKey(dateKey);
    const checkin = next === today ? todayCheckin : checkinHistory?.[next];
    const symptoms = checkin?.symptoms ?? [];
    if (symptoms.length === 0) continue;
    pairs.push({
      load: log?.totalLoad ?? 0,
      items: log?.items ?? [],
      symptomatic: !symptoms.includes('fine'),
    });
  }

  const insights = [];

  // Does your personal GI line hold up against your own data?
  const gi = thresholds?.gi;
  if (gi) {
    const above = pairs.filter(p => p.load >= gi);
    const below = pairs.filter(p => p.load < gi);
    if (above.length >= MIN_GROUP && below.length >= MIN_GROUP) {
      const a = rate(above);
      const b = rate(below);
      insights.push({
        emoji: '🎯',
        text: `Past your GI line (${gi}%+), you reported symptoms the next morning ${a.sym} of ${a.total} times. Under it: ${b.sym} of ${b.total}.`,
      });
    }
  }

  // Do co-factor days hit harder than clean days?
  const withCofactor = pairs.filter(p => p.items.some(i => i.category === 'cofactor'));
  const withoutCofactor = pairs.filter(p => !p.items.some(i => i.category === 'cofactor'));
  if (withCofactor.length >= MIN_GROUP && withoutCofactor.length >= MIN_GROUP) {
    const w = rate(withCofactor);
    const wo = rate(withoutCofactor);
    insights.push({
      emoji: '⚡',
      text: `On days with a co-factor logged (alcohol, heat, stress…), symptoms followed ${w.sym} of ${w.total} mornings. Without one: ${wo.sym} of ${wo.total}.`,
    });
  }

  return { pairCount: pairs.length, insights };
}
