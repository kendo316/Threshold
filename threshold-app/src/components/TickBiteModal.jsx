import { useState } from 'react';
import { P } from '../data/palette';
import { localDateKey } from '../hooks/useDailyLog';

const REGIONS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West', 'Other'];
const DURATIONS = [
  { id: 'crawling', label: 'Crawling', desc: 'under 4 hrs' },
  { id: 'embedded', label: 'Embedded', desc: 'about a day' },
  { id: 'engorged', label: 'Engorged', desc: 'over 24 hrs' },
];
const SIZES = [
  { id: 'seed', label: 'Speck', desc: 'seed tick' },
  { id: 'nymph', label: 'Small', desc: 'nymph' },
  { id: 'adult', label: 'Large', desc: 'adult' },
];

function ChipRow({ options, value, onChange, render }) {
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
      {options.map(opt => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const on = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(on ? null : id)}
            style={{
              padding: '9px 13px',
              background: on ? P.amberLight : P.card,
              border: `1.5px solid ${on ? P.amber : P.border}`,
              borderRadius: 20, cursor: 'pointer',
              fontSize: 13, color: on ? P.brown : P.textMid,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: on ? 600 : 400,
            }}
          >
            {render ? render(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

export default function TickBiteModal({ variant = 'today', onConfirm, onClose }) {
  const [date, setDate] = useState(localDateKey());
  const [region, setRegion] = useState(null);
  const [duration, setDuration] = useState(null);
  const [size, setSize] = useState(null);

  const handleSubmit = async () => {
    await onConfirm({
      date: variant === 'manual' ? date : localDateKey(),
      region,
      attachmentDuration: duration,
      tickSize: size,
    });
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,14,6,0.55)',
        zIndex: 300,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: P.bg,
          borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 560,
          maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 36, height: 4, background: P.border, borderRadius: 2, margin: '10px auto 2px', flexShrink: 0 }} />

        <div style={{ overflowY: 'auto', padding: '16px 22px 4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ fontSize: 40, lineHeight: 1 }}>🕷️</div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: P.textLight, cursor: 'pointer', padding: 0 }}>✕</button>
          </div>
          <h3 style={{ margin: '0 0 4px', fontFamily: "'Lora', serif", color: P.textDark, fontSize: 20 }}>
            {variant === 'manual' ? 'Add a bite you remember' : 'Log a tick bite'}
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: P.textLight, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
            {variant === 'manual'
              ? 'For a bite from before you started tracking. Just the date is enough — anything else helps.'
              : "Every detail is optional — tap Log it whenever you're ready."}
          </p>

          {variant === 'manual' && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, color: P.textMid, fontWeight: 500, display: 'block', marginBottom: 6 }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: `1.5px solid ${P.border}`, borderRadius: 12,
                  fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                  color: P.textDark, background: P.card, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <p style={{ fontSize: 12, color: P.textLight, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
            Region (optional)
          </p>
          <ChipRow options={REGIONS} value={region} onChange={setRegion} />

          {variant === 'today' && (
            <>
              <p style={{ fontSize: 12, color: P.textLight, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
                Attachment (optional)
              </p>
              <ChipRow
                options={DURATIONS}
                value={duration}
                onChange={setDuration}
                render={o => <>{o.label} <span style={{ opacity: 0.65 }}>· {o.desc}</span></>}
              />

              <p style={{ fontSize: 12, color: P.textLight, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
                Size (optional)
              </p>
              <ChipRow
                options={SIZES}
                value={size}
                onChange={setSize}
                render={o => <>{o.label} <span style={{ opacity: 0.65 }}>· {o.desc}</span></>}
              />
            </>
          )}
        </div>

        <div style={{ padding: '14px 22px calc(20px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
          <button
            onClick={handleSubmit}
            style={{
              width: '100%', padding: '16px',
              background: P.brown, color: 'white',
              border: 'none', borderRadius: 14,
              fontSize: 16, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            {variant === 'manual' ? 'Add to History' : 'Log It'}
          </button>
        </div>
      </div>
    </div>
  );
}
