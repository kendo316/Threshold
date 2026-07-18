import { useState } from 'react';
import { P } from '../data/palette';

function SliderRow({ label, value, color, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: P.textDark, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, color, fontWeight: 700 }}>{value}%</span>
      </div>
      <input
        type="range" min={10} max={100} step={5}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  );
}

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState('disclaimer');
  const [name, setName] = useState('');
  const [igeNumber, setIgeNumber] = useState('');
  const [thresholds, setThresholds] = useState({ gi: 55, hives: 80, severe: 95 });

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    border: `1.5px solid ${P.border}`,
    borderRadius: 13,
    fontSize: 16, fontFamily: "'DM Sans', sans-serif",
    color: P.textDark, background: P.card,
    outline: 'none', boxSizing: 'border-box',
  };

  const primaryBtn = {
    width: '100%', padding: '17px',
    background: P.brown, color: 'white',
    border: 'none', borderRadius: 14,
    fontSize: 16, fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, cursor: 'pointer',
    marginTop: 8,
  };

  const handleFinish = () => {
    onComplete({
      name: name.trim() || 'You',
      igeNumber: parseFloat(igeNumber) || null,
      thresholds,
      onboarded: true,
    });
  };

  const setThreshold = (key2, val) => setThresholds(prev => ({ ...prev, [key2]: val }));

  return (
    <div style={{
      minHeight: '100vh', background: P.bg,
      display: 'flex', flexDirection: 'column',
      padding: '48px 24px 48px',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 560, margin: '0 auto',
    }}>
      <h1 style={{
        margin: '0 0 32px',
        fontSize: 28, fontFamily: "'Lora', serif",
        color: P.textDark, letterSpacing: '-0.02em',
      }}>
        Threshold
      </h1>

      {step === 'disclaimer' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1, background: P.card,
            border: `1px solid ${P.border}`,
            borderRadius: 18, padding: '28px 24px',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🩺</div>
            <h2 style={{ margin: '0 0 16px', fontSize: 22, color: P.textDark, fontFamily: "'Lora', serif" }}>
              Before you start
            </h2>
            <p style={{ margin: '0 0 16px', fontSize: 15, color: P.textMid, lineHeight: 1.65 }}>
              Threshold is a personal tracking tool. It is not a medical device and does not provide medical advice.
            </p>
            <p style={{ margin: '0 0 16px', fontSize: 15, color: P.textMid, lineHeight: 1.65 }}>
              Always consult your doctor before making health decisions.
            </p>
            <p style={{ margin: 0, fontSize: 15, color: P.textMid, lineHeight: 1.65 }}>
              This app helps you see patterns in your own data — nothing more. Your body is the expert. This is just a log.
            </p>
          </div>
          <button onClick={() => setStep('profile')} style={primaryBtn}>
            I understand — let's go
          </button>
        </div>
      )}

      {step === 'profile' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, color: P.textDark, fontFamily: "'Lora', serif" }}>
            A little about you
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: P.textLight, lineHeight: 1.5 }}>
            This is just for personalizing the app. Nothing is shared.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            <div>
              <label style={{ fontSize: 13, color: P.textMid, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Your name (optional)
              </label>
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: P.textMid, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Your IgE number (kU/L, optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 4.2"
                value={igeNumber}
                onChange={e => setIgeNumber(e.target.value)}
                style={inputStyle}
                min="0"
                step="0.1"
              />
              <p style={{ margin: '6px 0 0', fontSize: 12, color: P.textLight }}>
                Found on your allergy blood test. You can add this later.
              </p>
            </div>
          </div>
          <button onClick={() => setStep('thresholds')} style={primaryBtn}>
            Next
          </button>
        </div>
      )}

      {step === 'thresholds' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, color: P.textDark, fontFamily: "'Lora', serif" }}>
            Your personal lines
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: P.textLight, lineHeight: 1.55 }}>
            Set your starting estimates. These will refine over time as the app learns from your logs.
          </p>
          <div style={{ flex: 1 }}>
            <SliderRow label="GI symptoms typically start at…" value={thresholds.gi} color={P.amber} onChange={v => setThreshold('gi', v)} />
            <SliderRow label="Hives / skin reactions start at…" value={thresholds.hives} color={P.orange} onChange={v => setThreshold('hives', v)} />
            <SliderRow label="Severe reaction risk starts at…" value={thresholds.severe} color={P.red} onChange={v => setThreshold('severe', v)} />
            <div style={{
              background: P.amberLight,
              border: `1px solid ${P.amber}`,
              borderRadius: 12, padding: '12px 14px', marginTop: 12,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: P.brown, lineHeight: 1.5 }}>
                Not sure? The defaults are a reasonable starting point. You can adjust these any time in your profile.
              </p>
            </div>
          </div>
          <button onClick={handleFinish} style={primaryBtn}>
            Start tracking
          </button>
        </div>
      )}
    </div>
  );
}
