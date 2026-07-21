import { useState } from 'react';
import { P } from '../data/palette';
import { SYMPTOMS } from '../data/triggers';
import { bucketColor, bucketAdvice } from '../data/bucketUtils';
import BucketGauge from '../components/BucketGauge';
import MammalFreeCelebration from '../components/MammalFreeCelebration';

export default function HomeScreen({ logData, checkin, profile, onRemoveItem, onMarkMammalFree, setTab }) {
  const { items = [], totalLoad = 0, mammalFree = false } = logData;
  const thresholds = profile?.thresholds;
  const advice = bucketAdvice(totalLoad);
  const [removingId, setRemovingId] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  const handleChipTap = (triggerId) => {
    if (removingId === triggerId) {
      onRemoveItem(triggerId);
      setRemovingId(null);
    } else {
      setRemovingId(triggerId);
    }
  };

  const handleMammalFreeToggle = async () => {
    const next = !mammalFree;
    const ok = await onMarkMammalFree(next);
    if (next && ok !== false) setCelebrate(true);
  };

  return (
    <div style={{ animation: 'screenFadeIn 0.28s ease' }}>
      {/* Gauge */}
      <div style={{ padding: '28px 20px 20px', textAlign: 'center' }}>
        <BucketGauge pct={totalLoad} thresholds={thresholds} />
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

      {/* Mammal-free day — quiet, secondary, no pressure */}
      <div style={{ padding: '2px 20px 12px' }}>
        <button
          onClick={handleMammalFreeToggle}
          style={{
            width: '100%', padding: '13px',
            background: mammalFree ? P.greenLight : 'transparent',
            color: mammalFree ? P.green : P.textLight,
            border: `1.5px solid ${mammalFree ? '#A8CCB0' : P.border}`,
            borderRadius: 14, fontSize: 14,
            fontFamily: "'DM Sans', sans-serif", fontWeight: mammalFree ? 600 : 500,
            cursor: 'pointer', transition: 'background 0.25s, border-color 0.25s, color 0.25s',
          }}
        >
          {mammalFree ? '✓ Mammal-free day ✨' : 'Mark today mammal-free'}
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

      {celebrate && <MammalFreeCelebration onDismiss={() => setCelebrate(false)} />}
    </div>
  );
}
