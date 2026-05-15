import { useState } from 'react';
import { P } from '../data/palette';
import { SYMPTOMS } from '../data/triggers';

export default function CheckInScreen({ onComplete, onBack, existingCheckin }) {
  const [selected, setSelected] = useState(existingCheckin?.symptoms ?? []);
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const severity = selected.includes('fine') ? 0
    : selected.some(s => ['hives'].includes(s)) ? 2
    : selected.length > 0 ? 1 : 0;

  return (
    <div style={{ padding: '16px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.textMid, lineHeight: 1, padding: 0 }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
          Good morning.
        </h2>
      </div>

      <p style={{ fontSize: 15, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 22, lineHeight: 1.5 }}>
        How are you feeling? Tap everything that applies — this gets logged against yesterday.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {SYMPTOMS.map(s => {
          const on = selected.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                padding: '20px 8px',
                background: on ? P.amberLight : P.card,
                border: `2px solid ${on ? P.amber : P.border}`,
                borderRadius: 18, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              }}
            >
              <span style={{ fontSize: 36 }}>{s.emoji}</span>
              <span style={{
                fontSize: 12, color: on ? P.brown : P.textMid,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: 'center', fontWeight: on ? 600 : 400, lineHeight: 1.2,
              }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onComplete(selected, severity)}
        disabled={selected.length === 0}
        style={{
          width: '100%', padding: '16px',
          background: selected.length > 0 ? P.brown : P.border,
          color: 'white', border: 'none', borderRadius: 14,
          fontSize: 16, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, cursor: selected.length > 0 ? 'pointer' : 'default',
          transition: 'background 0.2s',
        }}
      >
        Log How I Feel
      </button>
    </div>
  );
}
