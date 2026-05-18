import { useState } from 'react';
import { P } from '../data/palette';
import { DAY_CONTEXTS, SYMPTOMS } from '../data/triggers';
import { bucketColor, bucketBg, bucketAdvice } from '../data/bucketUtils';
import BucketGauge from '../components/BucketGauge';
import PastDayModal from '../components/PastDayModal';
import { localDateKey } from '../hooks/useDailyLog';

function pastKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return localDateKey(d);
}

function shortDayLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HomeScreen({ logData, checkin, profile, history, checkinHistory, onSetDayContext, onRemoveItem, onAppendItem, setTab }) {
  const { items = [], totalLoad = 0, dayContext } = logData;
  const thresholds = profile?.thresholds;
  const advice = bucketAdvice(totalLoad, dayContext);
  const [removingId, setRemovingId] = useState(null);
  const [pastDayModal, setPastDayModal] = useState(null);

  const handleChipTap = (triggerId) => {
    if (removingId === triggerId) {
      onRemoveItem(triggerId);
      setRemovingId(null);
    } else {
      setRemovingId(triggerId);
    }
  };

  return (
    <div>
      {/* Gauge */}
      <div style={{ padding: '28px 20px 20px', textAlign: 'center' }}>
        <BucketGauge pct={totalLoad} thresholds={thresholds} />
      </div>

      {/* Day context */}
      <div style={{ padding: '0 20px 16px' }}>
        <p style={{ fontSize: 12, color: P.textLight, marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>
          What kind of day is this?
        </p>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center' }}>
          {DAY_CONTEXTS.map(ctx => (
            <button
              key={ctx.id}
              onClick={() => onSetDayContext(dayContext === ctx.id ? null : ctx.id)}
              style={{
                padding: '7px 13px',
                background: dayContext === ctx.id ? P.amberLight : P.card,
                border: `1.5px solid ${dayContext === ctx.id ? P.amber : P.border}`,
                borderRadius: 20, cursor: 'pointer',
                fontSize: 13, color: dayContext === ctx.id ? P.brown : P.textMid,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: dayContext === ctx.id ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {ctx.emoji} {ctx.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advice banner */}
      {advice && (
        <div style={{
          margin: '0 20px 16px',
          padding: '13px 16px',
          background: totalLoad > 70 ? P.orangeLight : P.greenLight,
          border: `1.5px solid ${totalLoad > 70 ? '#E0A090' : '#A8CCB0'}`,
          borderRadius: 13,
        }}>
          <p style={{ margin: 0, fontSize: 14, color: P.textDark, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
            {advice}
          </p>
          {dayContext && totalLoad < 55 && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: P.textLight, fontStyle: 'italic' }}>
              {DAY_CONTEXTS.find(c => c.id === dayContext)?.tip}
            </p>
          )}
        </div>
      )}

      {/* Today's log */}
      {items.length > 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
              Today's Log
            </p>
            {removingId ? (
              <button
                onClick={() => setRemovingId(null)}
                style={{ background: 'none', border: 'none', fontSize: 11, color: P.textLight, cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif" }}
              >
                cancel
              </button>
            ) : (
              <span style={{ fontSize: 11, color: P.textLight, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
                tap to remove
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {items.map(item => {
              const isRemoving = removingId === item.triggerId;
              return (
                <button
                  key={item.triggerId}
                  onClick={() => handleChipTap(item.triggerId)}
                  style={{
                    padding: '7px 12px',
                    background: isRemoving ? P.orangeLight : P.card,
                    border: `1.5px solid ${isRemoving ? P.orange : P.border}`,
                    borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 13, color: isRemoving ? P.orange : P.textMid,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  {isRemoving ? '✕' : item.label}
                  {!isRemoving && (
                    <span style={{ fontSize: 10, color: bucketColor(item.effectiveLoad * 3), fontWeight: 700 }}>
                      +{item.effectiveLoad}%
                    </span>
                  )}
                  {isRemoving && (
                    <span style={{ fontSize: 11, fontWeight: 600 }}> Remove {item.label}?</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Morning check-in symptoms */}
      {checkin && checkin.symptoms?.length > 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
            How You Felt This Morning
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {checkin.symptoms.map(id => {
              const s = SYMPTOMS.find(x => x.id === id);
              return s ? (
                <div key={id} style={{
                  padding: '7px 12px',
                  background: id === 'fine' ? P.greenLight : P.orangeLight,
                  border: `1.5px solid ${id === 'fine' ? '#A8CCB0' : '#E0A090'}`,
                  borderRadius: 20, fontSize: 13,
                  color: id === 'fine' ? P.green : P.orange,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {s.emoji} {s.label}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '8px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          onClick={() => setTab('log')}
          style={{
            padding: '18px', background: P.brown, color: 'white',
            border: 'none', borderRadius: 16, fontSize: 15,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
          }}
        >
          + Log Intake
        </button>
        <button
          onClick={() => setTab('checkin')}
          style={{
            padding: '18px',
            background: checkin ? P.greenLight : P.card,
            color: checkin ? P.green : P.textMid,
            border: `2px solid ${checkin ? '#A8CCB0' : P.border}`,
            borderRadius: 16, fontSize: 15,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
          }}
        >
          {checkin ? '✓ Checked In' : '☀️ Check In'}
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && !checkin && (
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: P.textLight, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            Start by logging what you've eaten today,<br />or check in with how you're feeling.
          </p>
        </div>
      )}

      {/* 3-day strip */}
      {([1, 2].some(n => history[pastKey(n)] || checkinHistory?.[pastKey(n)])) && (
        <div style={{ padding: '4px 20px 20px' }}>
          <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
            Recent Days
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[1, 2].map(daysAgo => {
              const key = pastKey(daysAgo);
              const dayLog = history[key];
              const dayCheckin = checkinHistory?.[key];
              const load = dayLog?.totalLoad ?? 0;
              const itemCount = dayLog?.items?.length ?? 0;
              const hasSymptoms = dayCheckin?.symptoms?.length > 0;
              const hadReaction = hasSymptoms && !dayCheckin.symptoms.includes('fine');
              const color = load === 0 ? P.textLight : bucketColor(load);

              return (
                <button
                  key={key}
                  onClick={() => setPastDayModal(key)}
                  style={{
                    flex: 1, padding: '12px 14px',
                    background: P.card,
                    border: `1.5px solid ${hadReaction ? '#E0A090' : P.border}`,
                    borderRadius: 14, cursor: 'pointer',
                    textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 5,
                  }}
                >
                  <span style={{ fontSize: 12, color: P.textLight, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    {shortDayLabel(key)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Lora', serif" }}>
                      {load}%
                    </span>
                    {itemCount > 0 && (
                      <span style={{ fontSize: 11, color: P.textLight, fontFamily: "'DM Sans', sans-serif" }}>
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {hasSymptoms && (
                    <span style={{ fontSize: 11, color: hadReaction ? P.orange : P.green, fontFamily: "'DM Sans', sans-serif" }}>
                      {hadReaction ? '⚠ Symptoms' : '✓ Felt fine'}
                    </span>
                  )}
                  {!dayLog && (
                    <span style={{ fontSize: 11, color: P.textLight, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
                      Nothing logged
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pastDayModal && (
        <PastDayModal
          dateKey={pastDayModal}
          logData={history[pastDayModal]}
          checkinData={checkinHistory?.[pastDayModal]}
          onAppendItem={onAppendItem}
          onClose={() => setPastDayModal(null)}
        />
      )}
    </div>
  );
}
