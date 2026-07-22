import { useState } from 'react';
import { P } from '../data/palette';

const IGE_FIELDS = [
  { id: 'alphaGalIge',   label: 'Alpha-Gal Specific IgE',  unit: 'kU/L', note: 'The key number — your body\'s specific reaction to alpha-gal sugar' },
  { id: 'totalIge',      label: 'Total IgE',                unit: 'kU/L', note: 'Your overall allergic load; context for the specific number' },
  { id: 'catIge',        label: 'Cat Dander IgE',           unit: 'kU/L', note: 'Cat sensitization is common in AG patients' },
  { id: 'dogIge',        label: 'Dog Dander IgE',           unit: 'kU/L', note: 'Cross-reactivity with pet dander is frequently seen' },
  { id: 'beefIge',       label: 'Beef Specific IgE',        unit: 'kU/L', note: 'Sometimes ordered alongside alpha-gal' },
  { id: 'porkIge',       label: 'Pork Specific IgE',        unit: 'kU/L', note: 'Sometimes ordered alongside alpha-gal' },
  { id: 'milkIge',       label: 'Milk Specific IgE',        unit: 'kU/L', note: 'Dairy-specific reaction, separate from meat' },
];

export default function LabResultsScreen({ labResults, onSave, onBack }) {
  const [noResults, setNoResults] = useState(labResults?.noResults ?? false);
  const [testDate, setTestDate] = useState(labResults?.testDate ?? '');
  const [values, setValues] = useState(labResults?.values ?? {});
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // Entered values and "I don't have these yet" can't both be true —
    // real numbers win, so the Profile summary can never contradict them.
    const anyValues = Object.values(values).some(v => String(v ?? '').trim() !== '');
    const ok = await onSave({ noResults: noResults && !anyValues, testDate, values });
    if (ok === false) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: `1.5px solid ${P.border}`, borderRadius: 12,
    fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    color: P.textDark, background: noResults ? P.borderLight : P.card,
    outline: 'none',
  };

  return (
    <div style={{ padding: '16px 20px calc(100px + env(safe-area-inset-bottom))', fontFamily: "'DM Sans', sans-serif", animation: 'screenFadeIn 0.28s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.textMid, lineHeight: 1, padding: 0 }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
          Lab Results
        </h2>
      </div>

      <div style={{
        padding: '14px 16px',
        background: P.amberLight,
        border: `1.5px solid ${P.amber}`,
        borderRadius: 13, marginBottom: 24,
      }}>
        <p style={{ margin: 0, fontSize: 13, color: P.brown, lineHeight: 1.55 }}>
          These values are stored for your reference only. They don't change how Threshold calculates your bucket — the science linking specific IgE levels to reaction thresholds isn't there yet. Log honestly; patterns will emerge over time.
        </p>
      </div>

      <button
        onClick={() => setNoResults(v => !v)}
        style={{
          width: '100%', padding: '14px',
          background: noResults ? P.amberLight : P.card,
          border: `2px solid ${noResults ? P.amber : P.border}`,
          borderRadius: 13, cursor: 'pointer',
          fontSize: 14, color: noResults ? P.brown : P.textMid,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: noResults ? 600 : 400,
          marginBottom: 20, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>{noResults ? '✓' : '○'}</span>
        I don't have these results yet
      </button>

      {!noResults && (
        <>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: P.textMid, fontWeight: 500, display: 'block', marginBottom: 5 }}>
              Test Date
            </label>
            <input
              type="date"
              value={testDate}
              onChange={e => setTestDate(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>

          <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
            Allergen-Specific IgE Values
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {IGE_FIELDS.map(field => (
              <div key={field.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <label style={{ fontSize: 13, color: P.textDark, fontWeight: 500 }}>{field.label}</label>
                  <span style={{ fontSize: 11, color: P.textLight }}>{field.unit}</span>
                </div>
                <p style={{ fontSize: 11, color: P.textLight, margin: '0 0 6px', lineHeight: 1.4 }}>{field.note}</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 4.20"
                  value={values[field.id] ?? ''}
                  onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '16px',
          background: saved ? P.green : P.brown, color: 'white',
          border: 'none', borderRadius: 14,
          fontSize: 16, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, cursor: 'pointer',
          marginTop: 24, transition: 'background 0.3s',
        }}
      >
        {saved ? '✓ Saved' : 'Save Lab Results'}
      </button>
    </div>
  );
}
