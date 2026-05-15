import { useState } from 'react';
import { P } from '../data/palette';
import { bucketBg, bucketColor } from '../data/bucketUtils';

export default function TileModal({ trigger, onConfirm, onClose }) {
  const [amount, setAmount] = useState('moderate');
  const multipliers = { small: 0.5, moderate: 1, large: 1.5 };
  const effectiveLoad = Math.round(trigger.load * multipliers[amount]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,14,6,0.55)',
        zIndex: 200,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: P.card,
          borderRadius: '24px 24px 0 0',
          padding: '28px 24px 40px',
          width: '100%', maxWidth: 560,
        }}
        onClick={e => e.stopPropagation()}
      >
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
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {['small', 'moderate', 'large'].map(a => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              style={{
                flex: 1, padding: '13px 6px',
                border: `2px solid ${amount === a ? P.amber : P.border}`,
                borderRadius: 13,
                background: amount === a ? P.amberLight : 'white',
                color: amount === a ? P.brown : P.textMid,
                fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                fontWeight: amount === a ? 600 : 400,
                textTransform: 'capitalize', cursor: 'pointer',
              }}
            >
              {a}
            </button>
          ))}
        </div>

        <div style={{
          background: bucketBg(effectiveLoad * 2),
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 18,
        }}>
          <span style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif" }}>
            Bucket impact
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: bucketColor(effectiveLoad * 2), fontFamily: "'Lora', serif" }}>
            +{effectiveLoad}%
          </span>
        </div>

        <button
          onClick={() => onConfirm(trigger, amount)}
          style={{
            width: '100%', padding: '16px',
            background: P.brown, color: 'white',
            border: 'none', borderRadius: 14,
            fontSize: 16, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Add to Today
        </button>
      </div>
    </div>
  );
}
