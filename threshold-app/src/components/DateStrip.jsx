import { useState, useRef, useEffect } from 'react';
import { P } from '../data/palette';
import { bucketColor } from '../data/bucketUtils';
import PastDayModal from './PastDayModal';
import { localDateKey, nextDayKey } from '../utils/dates';

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

export default function DateStrip({ history, checkinHistory, todayCheckin, appendItemToDate, setMammalFreeForDate }) {
  const [modalDate, setModalDate] = useState(null);
  const scrollRef = useRef(null);
  const todayKey = localDateKey();

  // Oldest → newest, today at the right end.
  const chips = [];
  for (let daysAgo = 6; daysAgo >= 1; daysAgo--) {
    chips.push({ dateKey: pastKey(daysAgo), daysAgo });
  }
  chips.push({ dateKey: todayKey, daysAgo: 0 });

  // Start scrolled to the right so today and the most recent days are
  // visible first; the older half of the week is a natural swipe away.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

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
      <div
        ref={scrollRef}
        className="datestrip"
        style={{
          display: 'flex', gap: 6, alignItems: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x proximity',
          margin: '0 -20px', padding: '0 20px',
        }}
      >
        {chips.map(({ dateKey, daysAgo }) => {
          const isToday = daysAgo === 0;
          const load = history?.[dateKey]?.totalLoad ?? 0;
          const mammalFree = history?.[dateKey]?.mammalFree ?? false;
          const nextMorning = getNextMorningCheckin(dateKey, daysAgo);
          const symptoms = nextMorning?.symptoms ?? [];
          const hadReaction = symptoms.length > 0 && !symptoms.includes('fine');
          const feltFine   = symptoms.includes('fine');

          if (isToday) {
            return (
              <span key={dateKey} style={{
                padding: '9px 14px',
                background: P.brown, color: 'white',
                borderRadius: 20, fontSize: 11,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {chipLabel(dateKey)} — Today
              </span>
            );
          }

          return (
            <button key={dateKey} onClick={() => setModalDate(dateKey)} style={{
              padding: '9px 12px',
              background: hadReaction ? P.orangeLight : P.bg,
              border: `1px solid ${hadReaction ? '#E0A090' : P.border}`,
              borderRadius: 20, cursor: 'pointer',
              fontSize: 11, fontFamily: "'DM Sans', sans-serif",
              color: P.textMid,
              display: 'flex', alignItems: 'center', gap: 5,
              whiteSpace: 'nowrap', flexShrink: 0,
              scrollSnapAlign: 'start',
            }}>
              <span>{chipLabel(dateKey)}</span>
              {load > 0 && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: bucketColor(load),
                  display: 'inline-block', flexShrink: 0,
                }} />
              )}
              {mammalFree && (
                <span style={{
                  fontSize: 9, display: 'inline-block',
                  animation: 'sprout 0.35s cubic-bezier(.3,1.4,.4,1)',
                }}>
                  🌱
                </span>
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
          onSetMammalFree={setMammalFreeForDate}
          onClose={() => setModalDate(null)}
        />
      )}
    </>
  );
}
