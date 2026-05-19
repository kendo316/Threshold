import { useState } from 'react';
import { P } from '../data/palette';
import { bucketColor } from '../data/bucketUtils';
import PastDayModal from './PastDayModal';
import { localDateKey, nextDayKey } from '../hooks/useDailyLog';

function pastKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return localDateKey(d);
}

function chipLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export default function DateStrip({ history, checkinHistory, todayCheckin, appendItemToDate }) {
  const [modalDate, setModalDate] = useState(null);
  const todayKey = localDateKey();

  const chips = [
    { dateKey: pastKey(2), daysAgo: 2 },
    { dateKey: pastKey(1), daysAgo: 1 },
    { dateKey: todayKey,   daysAgo: 0 },
  ];

  // Eating on day D → reactions show up morning of D+1.
  // Today's check-in (live hook) covers yesterday's eating (daysAgo=1).
  // For older days, look up nextDayKey in checkinHistory.
  const getNextMorningCheckin = (dateKey, daysAgo) => {
    if (daysAgo === 1) return todayCheckin;
    return checkinHistory?.[nextDayKey(dateKey)];
  };

  const modalCheckin = modalDate
    ? getNextMorningCheckin(modalDate, chips.find(c => c.dateKey === modalDate)?.daysAgo)
    : null;

  return (
    <>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {chips.map(({ dateKey, daysAgo }) => {
          const isToday = daysAgo === 0;
          const load = history?.[dateKey]?.totalLoad ?? 0;
          const nextMorning = getNextMorningCheckin(dateKey, daysAgo);
          const symptoms = nextMorning?.symptoms ?? [];
          const hadReaction = symptoms.length > 0 && !symptoms.includes('fine');
          const feltFine   = symptoms.includes('fine');

          if (isToday) {
            return (
              <span key={dateKey} style={{
                padding: '5px 12px',
                background: P.brown, color: 'white',
                borderRadius: 20, fontSize: 11,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                {chipLabel(dateKey)} — Today
              </span>
            );
          }

          return (
            <button key={dateKey} onClick={() => setModalDate(dateKey)} style={{
              padding: '5px 10px',
              background: hadReaction ? P.orangeLight : P.bg,
              border: `1px solid ${hadReaction ? '#E0A090' : P.border}`,
              borderRadius: 20, cursor: 'pointer',
              fontSize: 11, fontFamily: "'DM Sans', sans-serif",
              color: P.textMid,
              display: 'flex', alignItems: 'center', gap: 5,
              whiteSpace: 'nowrap',
            }}>
              <span>{chipLabel(dateKey)}</span>
              {load > 0 && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: bucketColor(load),
                  display: 'inline-block', flexShrink: 0,
                }} />
              )}
              {hadReaction && <span style={{ fontSize: 9 }}>⚠</span>}
              {feltFine && <span style={{ fontSize: 9, color: P.green }}>✓</span>}
            </button>
          );
        })}
      </div>

      {modalDate && (
        <PastDayModal
          dateKey={modalDate}
          logData={history?.[modalDate]}
          checkinData={modalCheckin}
          onAppendItem={appendItemToDate}
          onClose={() => setModalDate(null)}
        />
      )}
    </>
  );
}
