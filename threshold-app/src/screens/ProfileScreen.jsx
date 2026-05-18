import { useState } from 'react';
import { P } from '../data/palette';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen({ profile, onSave, onLabResults }) {
  const { logOut, currentUser } = useAuth();
  const [name, setName] = useState(profile?.name ?? '');
  const [igeNumber, setIgeNumber] = useState(profile?.igeNumber ?? '');
  const [thresholds, setThresholds] = useState(profile?.thresholds ?? { gi: 55, hives: 80, severe: 95 });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onSave({
      name: name.trim() || 'You',
      igeNumber: parseFloat(igeNumber) || null,
      thresholds,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: `1.5px solid ${P.border}`, borderRadius: 13,
    fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    color: P.textDark, background: P.card,
    outline: 'none', boxSizing: 'border-box',
  };

  const SliderRow = ({ label, key2, color }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: P.textDark, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{thresholds[key2]}%</span>
      </div>
      <input
        type="range" min={10} max={100} step={5}
        value={thresholds[key2]}
        onChange={e => setThresholds(prev => ({ ...prev, [key2]: Number(e.target.value) }))}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  );

  return (
    <div style={{ padding: '20px 20px 100px', fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ margin: '0 0 22px', fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
        Profile
      </h2>

      <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
        About You
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 13, color: P.textMid, fontWeight: 500, display: 'block', marginBottom: 5 }}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First name" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: P.textMid, fontWeight: 500, display: 'block', marginBottom: 5 }}>IgE number (kU/L)</label>
          <input type="number" value={igeNumber} onChange={e => setIgeNumber(e.target.value)} placeholder="e.g. 4.2" style={inputStyle} min="0" step="0.1" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: P.textLight, display: 'block' }}>Signed in as {currentUser?.email}</label>
        </div>
      </div>

      <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
        Personal Threshold Lines
      </p>
      <SliderRow label="GI symptoms" key2="gi" color={P.amber} />
      <SliderRow label="Hives / skin" key2="hives" color={P.orange} />
      <SliderRow label="Severe reaction" key2="severe" color={P.red} />

      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '16px',
          background: saved ? P.green : P.brown, color: 'white',
          border: 'none', borderRadius: 14,
          fontSize: 16, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, cursor: 'pointer',
          transition: 'background 0.3s', marginBottom: 14,
        }}
      >
        {saved ? '✓ Saved' : 'Save Profile'}
      </button>

      <button
        onClick={onLabResults}
        style={{
          width: '100%', padding: '14px',
          background: P.card, color: P.textMid,
          border: `1.5px solid ${P.border}`, borderRadius: 14,
          fontSize: 15, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500, cursor: 'pointer',
          marginBottom: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span>🧪 Lab Results</span>
        <span style={{ fontSize: 12, color: P.textLight }}>
          {profile?.labResults?.noResults ? 'Not available' : profile?.labResults?.testDate ? `Tested ${profile.labResults.testDate}` : 'Not entered →'}
        </span>
      </button>

      <button
        onClick={logOut}
        style={{
          width: '100%', padding: '14px',
          background: 'transparent', color: P.textLight,
          border: `1.5px solid ${P.border}`, borderRadius: 14,
          fontSize: 15, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500, cursor: 'pointer',
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
