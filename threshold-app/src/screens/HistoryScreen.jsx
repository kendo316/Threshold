import { useState } from 'react';
import { P } from '../data/palette';
import { SYMPTOMS } from '../data/triggers';
import { bucketColor } from '../data/bucketUtils';
import PastDayModal from '../components/PastDayModal';

function formatDateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function LoadBar({ pct, thresholds }) {
  const color = pct >= 80 ? P.red : pct >= 55 ? P.orange : pct >= 30 ? P.amber : P.green;
  return (
    <div style={{ height: 5, background: P.borderLight, borderRadius: 4, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 4, transition: 'width 0.3s' }} />
    </div>
  );
}

export default function HistoryScreen({ history, checkinHistory, dateKeys, onAppendItem, profile }) {
  const [openDay, setOpenDay] = useState(null);

  const activeDays = dateKeys.filter(k => history[k] || checkinHistory[k]);

  return (
    <div style={{ padding: '20px 20px 100px', fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ margin: '0 0 4px', fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
        History
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: P.textLight }}>
        Past 30 days — tap any day to see details
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
            const log = history[dateKey];
            const checkin = checkinHistory[dateKey];
            const load = log?.totalLoad ?? 0;
            const itemCount = log?.items?.length ?? 0;
            const symptoms = checkin?.symptoms ?? [];
            const hadReaction = symptoms.length > 0 && !symptoms.includes('fine');
            const feltFine = symptoms.includes('fine');
            const color = load === 0 ? P.textLight : bucketColor(load);

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: P.textDark, display: 'block' }}>
                      {formatDateLabel(dateKey)}
                    </span>
                    {itemCount > 0 && (
                      <span style={{ fontSize: 12, color: P.textLight }}>
                        {itemCount} item{itemCount !== 1 ? 's' : ''} logged
                      </span>
                    )}
                    {!log && (
                      <span style={{ fontSize: 12, color: P.textLight, fontStyle: 'italic' }}>
                        No intake logged
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "'Lora', serif", display: 'block' }}>
                      {load}%
                    </span>
                    {hadReaction && (
                      <span style={{ fontSize: 11, color: P.orange }}>⚠ symptoms</span>
                    )}
                    {feltFine && (
                      <span style={{ fontSize: 11, color: P.green }}>✓ felt fine</span>
                    )}
                  </div>
                </div>

                {log && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LoadBar pct={load} />
                  </div>
                )}

                {symptoms.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                    {symptoms.slice(0, 3).map(id => {
                      const s = SYMPTOMS.find(x => x.id === id);
                      return s ? (
                        <span key={id} style={{
                          fontSize: 11, padding: '3px 8px',
                          background: id === 'fine' ? P.greenLight : P.orangeLight,
                          color: id === 'fine' ? P.green : P.orange,
                          borderRadius: 20,
                        }}>
                          {s.emoji} {s.label}
                        </span>
                      ) : null;
                    })}
                    {symptoms.length > 3 && (
                      <span style={{ fontSize: 11, color: P.textLight }}>+{symptoms.length - 3} more</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {openDay && (
        <PastDayModal
          dateKey={openDay}
          logData={history[openDay]}
          checkinData={checkinHistory[openDay]}
          onAppendItem={onAppendItem}
          onClose={() => setOpenDay(null)}
        />
      )}
    </div>
  );
}
