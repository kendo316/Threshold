import { useState } from 'react';
import { P } from '../data/palette';
import { useAuth } from '../contexts/AuthContext';
import TickBiteModal from '../components/TickBiteModal';

const MED_CHIPS = [
  { id: 'escitalopram', label: 'Escitalopram (Lexapro)' },
  { id: 'bupropion',    label: 'Bupropion (Wellbutrin)' },
  { id: 'glp1',         label: 'GLP-1 (Ozempic/Wegovy/Zepbound/Mounjaro)' },
];

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const sectionLabel = {
  fontSize: 11, color: P.textLight, letterSpacing: '0.1em',
  textTransform: 'uppercase', fontWeight: 600, marginBottom: 12,
};

function SliderRow({ label, value, color, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: P.textDark, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{value}%</span>
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

export default function ProfileScreen({ profile, onSave, onLabResults, onBack, tickBites = [], onAddTickBite }) {
  const { logOut, currentUser } = useAuth();
  const [name, setName] = useState(profile?.name ?? '');
  const [igeNumber, setIgeNumber] = useState(profile?.igeNumber ?? '');
  const [thresholds, setThresholds] = useState(profile?.thresholds ?? { gi: 55, hives: 80, severe: 95 });
  const [acidBlockerDefault, setAcidBlockerDefault] = useState(profile?.acidBlockerDefault ?? false);
  const [medChips, setMedChips] = useState(profile?.standingMedications?.chips ?? []);
  const [otherMeds, setOtherMeds] = useState(profile?.standingMedications?.other ?? '');
  const [saved, setSaved] = useState(false);
  const [tickModal, setTickModal] = useState(false);

  const toggleMedChip = (id) => {
    setMedChips(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    const thresholdsChanged = JSON.stringify(thresholds) !== JSON.stringify(profile?.thresholds);
    const ok = await onSave({
      name: name.trim() || 'You',
      igeNumber: parseFloat(igeNumber) || null,
      thresholds,
      thresholdsUpdatedAt: thresholdsChanged ? new Date().toISOString() : (profile?.thresholdsUpdatedAt ?? null),
      acidBlockerDefault,
      standingMedications: { chips: medChips, other: otherMeds.trim() },
    });
    if (ok === false) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddTickBite = async (data) => {
    await onAddTickBite(data);
    setTickModal(false);
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: `1.5px solid ${P.border}`, borderRadius: 13,
    fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    color: P.textDark, background: P.card,
    outline: 'none', boxSizing: 'border-box',
  };

  const setThreshold = (key2, val) => setThresholds(prev => ({ ...prev, [key2]: val }));

  return (
    <div style={{ padding: '16px 20px calc(100px + env(safe-area-inset-bottom))', fontFamily: "'DM Sans', sans-serif", animation: 'screenFadeIn 0.28s ease' }}>
      {tickModal && (
        <TickBiteModal variant="manual" onConfirm={handleAddTickBite} onClose={() => setTickModal(false)} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.textMid, lineHeight: 1, padding: 0 }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
          Profile
        </h2>
      </div>

      <p style={sectionLabel}>About You</p>

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

      <p style={sectionLabel}>Personal Threshold Lines</p>
      <div style={{
        background: P.amberLight, border: `1px solid ${P.amber}`,
        borderRadius: 12, padding: '12px 14px', marginBottom: 18,
      }}>
        <p style={{ margin: 0, fontSize: 13, color: P.brown, lineHeight: 1.55 }}>
          Alpha-gal isn't static — a tick bite can reset your tolerance, and careful reintroduction can raise it back up over time. These lines are meant to move with you. Adjust them here whenever your body tells you something's changed.
        </p>
      </div>
      {profile?.thresholdsUpdatedAt && (
        <p style={{ fontSize: 12, color: P.textLight, marginTop: -10, marginBottom: 18 }}>
          Last adjusted {formatDate(profile.thresholdsUpdatedAt)}
        </p>
      )}
      <SliderRow label="GI symptoms" value={thresholds.gi} color={P.amber} onChange={v => setThreshold('gi', v)} />
      <SliderRow label="Hives / skin" value={thresholds.hives} color={P.orange} onChange={v => setThreshold('hives', v)} />
      <SliderRow label="Severe reaction" value={thresholds.severe} color={P.red} onChange={v => setThreshold('severe', v)} />

      <p style={{ ...sectionLabel, marginTop: 8 }}>Medications</p>
      <button
        onClick={() => setAcidBlockerDefault(v => !v)}
        style={{
          width: '100%', padding: '14px',
          background: acidBlockerDefault ? P.amberLight : P.card,
          border: `2px solid ${acidBlockerDefault ? P.amber : P.border}`,
          borderRadius: 13, cursor: 'pointer',
          fontSize: 14, color: acidBlockerDefault ? P.brown : P.textMid,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: acidBlockerDefault ? 600 : 400,
          marginBottom: 10, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>{acidBlockerDefault ? '✓' : '○'}</span>
        I take a daily acid blocker (e.g. Pepcid/Famotidine)
      </button>
      <p style={{ fontSize: 12, color: P.textLight, lineHeight: 1.5, margin: '0 0 20px' }}>
        We'll mark Pepcid/Famotidine as taken by default each day — you can always remove it from a specific day's log.
      </p>

      <p style={{ fontSize: 13, color: P.textMid, fontWeight: 500, marginBottom: 10 }}>
        Standing daily medications
      </p>
      <p style={{ fontSize: 12, color: P.textLight, lineHeight: 1.5, margin: '0 0 12px' }}>
        Ongoing medications you take regularly — set once, not something to log every day.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {MED_CHIPS.map(m => {
          const on = medChips.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => toggleMedChip(m.id)}
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
              {m.label}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        value={otherMeds}
        onChange={e => setOtherMeds(e.target.value)}
        placeholder="Other medications (optional)"
        style={{ ...inputStyle, marginBottom: 28 }}
      />

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
          marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span>🧪 Lab Results</span>
        <span style={{ fontSize: 12, color: P.textLight }}>
          {profile?.labResults?.noResults ? 'Not available' : profile?.labResults?.testDate ? `Tested ${profile.labResults.testDate}` : 'Not entered →'}
        </span>
      </button>

      <p style={sectionLabel}>Tick Bite History</p>
      <p style={{ fontSize: 12, color: P.textLight, lineHeight: 1.5, margin: '0 0 12px' }}>
        Tick bites can reset your baseline, so their dates matter — for you, and for future research. This is separate from logging a bite in the moment (that lives on the Log screen).
      </p>
      {tickBites.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {tickBites.map(b => (
            <div key={b.id} style={{
              padding: '10px 14px', background: P.card,
              border: `1.5px solid ${P.border}`, borderRadius: 13,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 14, color: P.textDark }}>{formatDateKey(b.date)}</span>
              {b.region && <span style={{ fontSize: 12, color: P.textLight }}>{b.region}</span>}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setTickModal(true)}
        style={{
          width: '100%', padding: '14px',
          background: 'transparent',
          border: `1.5px dashed ${P.border}`,
          borderRadius: 14, cursor: 'pointer',
          fontSize: 14, color: P.textLight,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500, marginBottom: 28,
        }}
      >
        + Add a bite you remember
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
