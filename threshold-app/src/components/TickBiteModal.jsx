import { useState } from 'react';
import { P } from '../data/palette';
import { TICK_REGIONS, TICK_ATTACHMENT_DURATIONS, TICK_SIZES } from '../data/triggers';
import { localDateKey } from '../hooks/useDailyLog';

function PillRow({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          style={{
            padding: '9px 14px',
            background: selected === o.key ? P.amberLight : P.card,
            border: `1.5px solid ${selected === o.key ? P.amber : P.border}`,
            borderRadius: 20, cursor: 'pointer',
            fontSize: 13, color: selected === o.key ? P.brown : P.textMid,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: selected === o.key ? 600 : 400,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function TickBiteModal({ onConfirm, onClose }) {
  const [date, setDate] = useState(localDateKey());
  const [bodyLocation, setBodyLocation] = useState('');
  const [region, setRegion] = useState(null);
  const [attachmentDuration, setAttachmentDuration] = useState(null);
  const [tickSize, setTickSize] = useState(null);

  const canSubmit = region && attachmentDuration && tickSize;

  const handleSubmit = () => {
    onConfirm({ date, bodyLocation: bodyLocation.trim(), region, attachmentDuration, tickSize });
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: `1.5px solid ${P.border}`, borderRadius: 13,
    fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    color: P.textDark, background: P.card,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,14,6,0.55)',
        zIndex: 250,
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
          maxHeight: '85vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}>🕷️</div>
          <h3 style={{ margin: 0, fontSize: 22, color: P.textDark, fontFamily: "'Lora', serif" }}>
            Log a Tick Bite
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: P.textLight, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
            Tick bites are a known trigger for developing or worsening alpha-gal reactions.
          </p>
        </div>

        <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Date</p>
        <input
          type="date"
          value={date}
          max={localDateKey()}
          onChange={e => setDate(e.target.value)}
          style={{ ...inputStyle, marginBottom: 18 }}
        />

        <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Body location (optional)</p>
        <input
          type="text"
          placeholder="e.g. left calf, behind knee"
          value={bodyLocation}
          onChange={e => setBodyLocation(e.target.value)}
          style={{ ...inputStyle, marginBottom: 18 }}
        />

        <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Region</p>
        <PillRow options={TICK_REGIONS} selected={region} onSelect={setRegion} />

        <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Attachment duration</p>
        <PillRow options={TICK_ATTACHMENT_DURATIONS} selected={attachmentDuration} onSelect={setAttachmentDuration} />

        <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Tick size</p>
        <PillRow options={TICK_SIZES} selected={tickSize} onSelect={setTickSize} />

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%', padding: '16px',
            background: canSubmit ? P.brown : P.border,
            color: 'white',
            border: 'none', borderRadius: 14,
            fontSize: 16, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default',
          }}
        >
          Log Tick Bite
        </button>
      </div>
    </div>
  );
}
