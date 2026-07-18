import { useState } from 'react';
import { P } from '../data/palette';
import { bucketBg, bucketColor } from '../data/bucketUtils';
import { AMOUNT_LABELS } from '../data/triggers';

export default function TileModal({ trigger, isLogged, existingItem, onConfirm, onRemove, onClose, zIndex = 200, isToday = true, dayLabel }) {
  const [amount, setAmount] = useState(existingItem?.amount ?? 'moderate');
  const multipliers = { small: 0.5, moderate: 1, large: 1.5 };
  const effectiveLoad = Math.round(trigger.load * multipliers[amount]);
  const labels = AMOUNT_LABELS[trigger.amountType ?? 'food'];
  const removeCopy = isToday ? "Remove from today's log" : `Remove from ${dayLabel ?? 'this day'}`;
  const addCopy = isToday ? 'Add to Today' : (dayLabel ? `Add to ${dayLabel}` : 'Add to This Day');

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,14,6,0.55)',
        zIndex,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: P.card,
          borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 560,
          maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 36, height: 4, background: P.border, borderRadius: 2, margin: '10px auto 2px', flexShrink: 0 }} />

        <div style={{ overflowY: 'auto', padding: '18px 24px 4px' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 8 }}>{trigger.emoji}</div>
            <h3 style={{ margin: 0, fontSize: 24, color: P.textDark, fontFamily: "'Lora', serif" }}>
              {trigger.label}
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: P.textLight, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              {trigger.note}
            </p>
          </div>

          <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
            How much?
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {['small', 'moderate', 'large'].map(a => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                style={{
                  flex: 1, padding: '13px 6px 11px',
                  border: `2px solid ${amount === a ? P.amber : P.border}`,
                  borderRadius: 13,
                  background: amount === a ? P.amberLight : 'white',
                  color: amount === a ? P.brown : P.textMid,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: amount === a ? 600 : 400 }}>{labels[a].label}</span>
                {labels[a].desc && (
                  <span style={{ fontSize: 10, color: amount === a ? P.brownLight : P.textLight, lineHeight: 1.3, textAlign: 'center' }}>
                    {labels[a].desc}
                  </span>
                )}
              </button>
            ))}
          </div>

          {trigger.load > 0 && (
            <div style={{
              background: bucketBg(effectiveLoad * 2),
              borderRadius: 12, padding: '10px 14px',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 4,
            }}>
              <span style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif" }}>
                Bucket impact
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: bucketColor(effectiveLoad * 2), fontFamily: "'Lora', serif" }}>
                +{effectiveLoad}%
              </span>
            </div>
          )}
        </div>

        <div style={{
          padding: `14px 24px calc(20px + env(safe-area-inset-bottom))`,
          flexShrink: 0,
        }}>
          <button
            onClick={() => onConfirm(trigger, amount)}
            style={{
              width: '100%', padding: '16px',
              background: P.brown, color: 'white',
              border: 'none', borderRadius: 14,
              fontSize: 16, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, cursor: 'pointer',
              marginBottom: isLogged ? 10 : 0,
            }}
          >
            {isLogged ? 'Update Amount' : addCopy}
          </button>

          {isLogged && (
            <button
              onClick={() => onRemove(trigger)}
              style={{
                width: '100%', padding: '13px',
                background: 'transparent', color: P.textLight,
                border: `1.5px solid ${P.border}`, borderRadius: 14,
                fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              {removeCopy}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
