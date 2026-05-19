import { useState } from 'react';
import { P } from '../data/palette';
import { SYMPTOMS } from '../data/triggers';
import { bucketColor } from '../data/bucketUtils';
import PastDayModal from '../components/PastDayModal';
import ScrollFade from '../components/ScrollFade';
import { nextDayKey, localDateKey } from '../hooks/useDailyLog';

function formatDateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function LoadBar({ pct }) {
  const color = pct >= 80 ? P.red : pct >= 55 ? P.orange : pct >= 30 ? P.amber : P.green;
  return (
    <div style={{ height: 5, background: P.borderLight, borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 4 }} />
    </div>
  );
}

export default function HistoryScreen({ history, checkinHistory, dateKeys, onAppendItem, todayCheckin }) {
  const [openDay, setOpenDay] = useState(null);
  const today = localDateKey();

  // Eating on day D → reactions appear morning of D+1.
  // If D+1 is today, use the live todayCheckin prop (not yet in checkinHistory).
  const getFeelCheckin = (dateKey) => {
    const next = nextDayKey(dateKey);
    return next === today ? todayCheckin : checkinHistory?.[next];
  };

  const activeDays = dateKeys.filter(k => history[k]);

  return (
    <div style={{ padding: '20px 20px 100px', fontFamily: "'DM Sans', sans-serif" }}>
      <ScrollFade />
      <h2 style={{ margin: '0 0 4px', fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
        History
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: P.textLight }}>
        What you ate, and how you felt the next day
      </p>

      {activeDays.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>📋</p>
          <p style={{ fontSize: 14, color: P.textLight, lineHeight: 1.6 }}>
            No history yet. Start logging<br />and it'll show up here.
          </p>
        </div>
      )}

      {activeDays.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeDays.map(dateKey => {
            const log      = history[dateKey];
            const feel     = getFeelCheckin(dateKey);
            const load     = log?.totalLoad ?? 0;
            const itemCount = log?.items?.length ?? 0;
            const symptoms = feel?.symptoms ?? [];
            const hasCheckin  = symptoms.length > 0;
            const hadReaction = hasCheckin && !symptoms.includes('fine');
            const feltFine    = symptoms.includes('fine');
            const connectorColor = hadReaction ? P.orange : feltFine ? P.green : P.borderLight;

            return (
              <button
                key={dateKey}
                onClick={() => setOpenDay(dateKey)}
                style={{
                  padding: '14px 16px',
                  background: P.card,
                  border: `1.5px solid ${hadReaction ? '#E0A090' : P.border}`,
                  borderRadius: 14, cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* Eat row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: P.textDark, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
                      {formatDateLabel(dateKey)}
                    </span>
                    <span style={{ fontSize: 12, color: P.textLight, fontFamily: "'DM Sans', sans-serif" }}>
                      {itemCount} item{itemCount !== 1 ? 's' : ''} logged
                    </span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: bucketColor(load), fontFamily: "'Lora', serif" }}>
                    {load}%
                  </span>
                </div>
                <LoadBar pct={load} />

                {/* Feel connector */}
                <div style={{
                  borderLeft: `3px solid ${connectorColor}`,
                  marginLeft: 6, marginTop: 10, paddingLeft: 12,
                }}>
                  <span style={{
                    fontSize: 11, color: P.textLight,
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'block', marginBottom: hasCheckin ? 6 : 0,
                  }}>
                    ↓ Next morning
                  </span>
                  {hasCheckin ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {symptoms.map(id => {
                        const s = SYMPTOMS.find(x => x.id === id);
                        return s ? (
                          <span key={id} style={{
                            fontSize: 11, padding: '3px 9px',
                            background: id === 'fine' ? P.greenLight : P.orangeLight,
                            color: id === 'fine' ? P.green : P.orange,
                            borderRadius: 20,
                            fontFamily: "'DM Sans', sans-serif",
                          }}>
                            {s.emoji} {s.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 11, color: P.textLight, fontStyle: 'italic',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      No morning check-in logged
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {openDay && (
        <PastDayModal
          dateKey={openDay}
          logData={history[openDay]}
          checkinData={getFeelCheckin(openDay)}
          onAppendItem={onAppendItem}
          onClose={() => setOpenDay(null)}
        />
      )}
    </div>
  );
}
