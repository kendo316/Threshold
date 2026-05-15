import { useState } from "react";

const P = {
  bg: '#FAF6F0',
  card: '#FFFFFF',
  brown: '#4A2C1A',
  brownLight: '#7A4A30',
  amber: '#C8872A',
  amberLight: '#F5E6C8',
  green: '#3D6B4A',
  greenLight: '#E0EDE4',
  orange: '#C85A20',
  orangeLight: '#FAE6DC',
  red: '#B02020',
  redLight: '#FAE0E0',
  textDark: '#1E0E06',
  textMid: '#6B4030',
  textLight: '#A07858',
  border: '#E8D8C4',
  borderLight: '#F2EAE0',
};

const TRIGGERS = [
  { id: 'beef',     label: 'Beef',        emoji: '🥩', cat: 'meat',     load: 25, note: 'Steak, burger, roast, ground beef' },
  { id: 'pork',     label: 'Pork',        emoji: '🐖', cat: 'meat',     load: 20, note: 'Bacon, ham, sausage, pork chops' },
  { id: 'lamb',     label: 'Lamb',        emoji: '🐑', cat: 'meat',     load: 28, note: 'High alpha-gal content' },
  { id: 'venison',  label: 'Venison',     emoji: '🦌', cat: 'meat',     load: 25, note: 'Deer, elk, bison' },
  { id: 'rabbit',   label: 'Rabbit',      emoji: '🐇', cat: 'meat',     load: 22, note: 'Often overlooked mammal' },
  { id: 'dairy',    label: 'Milk/Cream',  emoji: '🥛', cat: 'dairy',    load: 8,  note: 'Whole milk, cream, butter' },
  { id: 'cheese',   label: 'Cheese',      emoji: '🧀', cat: 'dairy',    load: 10, note: 'Aged cheese has less alpha-gal' },
  { id: 'gelatin',  label: 'Gelatin',     emoji: '🍬', cat: 'hidden',   load: 12, note: 'Gummies, marshmallows, gel caps, broth' },
  { id: 'lard',     label: 'Lard/Tallow', emoji: '🫙', cat: 'hidden',   load: 15, note: 'Baked goods, frying oils' },
  { id: 'alcohol',  label: 'Alcohol',     emoji: '🍷', cat: 'cofactor', load: 15, note: 'Lowers your reaction threshold' },
  { id: 'nsaids',   label: 'NSAIDs',      emoji: '💊', cat: 'cofactor', load: 20, note: 'Ibuprofen, aspirin, naproxen' },
  { id: 'heat',     label: 'Heat/Hot',    emoji: '🌡️', cat: 'cofactor', load: 13, note: 'Hot shower, sun, sauna, fever' },
  { id: 'exercise', label: 'Exercise',    emoji: '🏃', cat: 'cofactor', load: 10, note: 'Vigorous physical activity' },
  { id: 'illness',  label: 'Sick/Stress', emoji: '🤒', cat: 'cofactor', load: 22, note: 'Illness, poor sleep, high stress' },
];

const SYMPTOMS = [
  { id: 'fine',    label: 'Feeling Good', emoji: '✅' },
  { id: 'hives',   label: 'Hives/Itch',   emoji: '🔴' },
  { id: 'gi',      label: 'GI / Stomach', emoji: '😣' },
  { id: 'stuffy',  label: 'Congestion',   emoji: '🤧' },
  { id: 'foggy',   label: 'Brain Fog',    emoji: '🌫️' },
  { id: 'tired',   label: 'Fatigue',      emoji: '😴' },
];

const DAY_CONTEXTS = [
  { id: 'home',   label: 'Home Day',    emoji: '🏠', tip: 'Good day to test tolerance if you\'ve been curious.' },
  { id: 'work',   label: 'Work Day',    emoji: '💼', tip: 'Stay aware — stress can lower your threshold.' },
  { id: 'travel', label: 'Traveling',   emoji: '✈️', tip: 'Protect your bucket. Hidden sources everywhere.' },
  { id: 'social', label: 'Social Plans',emoji: '🥂', tip: 'Plan ahead so you can enjoy yourself.' },
];

function bucketColor(pct) {
  if (pct < 30) return P.green;
  if (pct < 55) return P.amber;
  if (pct < 80) return P.orange;
  return P.red;
}
function bucketBg(pct) {
  if (pct < 30) return P.greenLight;
  if (pct < 55) return P.amberLight;
  if (pct < 80) return P.orangeLight;
  return P.redLight;
}
function bucketLabel(pct) {
  if (pct < 30) return 'Low Load';
  if (pct < 55) return 'Moderate';
  if (pct < 80) return 'High Load';
  return 'Near Limit';
}
function bucketAdvice(pct, ctx) {
  if (pct === 0) return null;
  if (pct > 75) {
    if (ctx === 'travel' || ctx === 'social') return '⚠️ Your load is high and you have plans. Be selective about what you add from here.';
    return '⚠️ Your load is high. Worth being cautious about anything more today.';
  }
  if (pct > 45) {
    if (ctx === 'home') return 'Moderate load — you have headroom, but keep track.';
    return 'Moderate load. You\'re okay, but co-factors like heat or alcohol will add up fast.';
  }
  if (ctx === 'home') return '✓ Load is low. Good day to relax your guard if you want to.';
  return '✓ Load is low. You\'re in good shape for the day.';
}

function BucketGauge({ pct }) {
  const r = 68;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  const color = bucketColor(pct);
  const label = bucketLabel(pct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 176, height: 176 }}>
        <svg width="176" height="176" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx="88" cy="88" r={r} fill="none" stroke={P.borderLight} strokeWidth="13" />
          <circle
            cx="88" cy="88" r={r}
            fill="none"
            stroke={color}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1), stroke 0.4s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 38, fontWeight: 700,
            color,
            fontFamily: "'Lora', serif",
            lineHeight: 1,
            transition: 'color 0.4s',
          }}>
            {pct}%
          </span>
          <span style={{
            fontSize: 11, color: P.textLight,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, marginTop: 4,
          }}>
            {label}
          </span>
        </div>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: P.textLight, fontFamily: "'DM Sans', sans-serif" }}>
        Today's Bucket
      </p>
    </div>
  );
}

function TileModal({ trigger, onConfirm, onClose }) {
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
          <p style={{ margin: '6px 0 0', fontSize: 13, color: P.textLight, fontFamily: "'DM Sans', sans-serif" }}>
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

function LogScreen({ onAdd, logged, onBack }) {
  const [modal, setModal] = useState(null);

  const handleConfirm = (trigger, amount) => {
    onAdd(trigger, amount);
    setModal(null);
  };

  const cats = [
    { key: 'meat',     label: 'Meat & Mammal' },
    { key: 'dairy',    label: 'Dairy' },
    { key: 'hidden',   label: 'Hidden Sources' },
    { key: 'cofactor', label: 'Co-factors' },
  ];

  return (
    <div>
      {modal && <TileModal trigger={modal} onConfirm={handleConfirm} onClose={() => setModal(null)} />}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.textMid, lineHeight: 1, padding: 0 }}>←</button>
        <h2 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
          What did you have?
        </h2>
      </div>
      <div style={{ padding: '12px 20px 100px' }}>
        {cats.map(cat => {
          const items = TRIGGERS.filter(t => t.cat === cat.key);
          return (
            <div key={cat.key} style={{ marginBottom: 26 }}>
              <p style={{
                fontSize: 11, color: P.textLight, letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, marginBottom: 10,
              }}>
                {cat.label}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                gap: 10,
              }}>
                {items.map(t => {
                  const isLogged = logged.some(l => l.id === t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => setModal(t)}
                      style={{
                        padding: '16px 8px 12px',
                        background: isLogged ? P.amberLight : P.card,
                        border: `2px solid ${isLogged ? P.amber : P.border}`,
                        borderRadius: 16, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 34, lineHeight: 1 }}>{t.emoji}</span>
                      <span style={{
                        fontSize: 11, lineHeight: 1.3, textAlign: 'center',
                        color: isLogged ? P.brown : P.textMid,
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: isLogged ? 600 : 400,
                      }}>
                        {t.label}
                      </span>
                      {isLogged && (
                        <span style={{ fontSize: 10, color: P.amber, fontWeight: 700 }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckInScreen({ onComplete, onBack }) {
  const [selected, setSelected] = useState([]);
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div style={{ padding: '16px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.textMid, lineHeight: 1, padding: 0 }}>←</button>
        <h2 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>Good morning.</h2>
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
              <span style={{ fontSize: 12, color: on ? P.brown : P.textMid, fontFamily: "'DM Sans', sans-serif", textAlign: 'center', fontWeight: on ? 600 : 400, lineHeight: 1.2 }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onComplete(selected)}
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

export default function App() {
  const [tab, setTab] = useState('home');
  const [logged, setLogged] = useState([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [dayCtx, setDayCtx] = useState(null);

  const bucketPct = Math.min(100, Math.round(
    logged.reduce((sum, item) => {
      const mult = item.amount === 'small' ? 0.5 : item.amount === 'large' ? 1.5 : 1;
      return sum + item.load * mult;
    }, 0)
  ));

  const handleAdd = (trigger, amount) => {
    setLogged(prev => {
      const filtered = prev.filter(l => l.id !== trigger.id);
      return [...filtered, { ...trigger, amount }];
    });
    setTab('home');
  };

  const handleCheckin = (sel) => {
    setSymptoms(sel);
    setCheckedIn(true);
    setTab('home');
  };

  const advice = bucketAdvice(bucketPct, dayCtx?.id);

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: P.bg,
      minHeight: '100vh',
      maxWidth: 640,
      margin: '0 auto',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { transition: opacity 0.15s; }
        button:active { opacity: 0.75; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '48px 20px 18px',
        background: P.card,
        borderBottom: `1px solid ${P.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 26,
            fontFamily: "'Lora', serif",
            color: P.textDark, letterSpacing: '-0.02em',
          }}>
            Threshold
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: P.textLight, letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600 }}>
            Alpha-Gal Load Tracker
          </p>
        </div>
        <span style={{
          fontSize: 12, color: P.textLight,
          background: P.bg, border: `1px solid ${P.border}`,
          borderRadius: 20, padding: '4px 12px', fontWeight: 500,
        }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Screens */}
      <div style={{ paddingBottom: 80 }}>

        {/* HOME */}
        {tab === 'home' && (
          <div>
            {/* Gauge */}
            <div style={{ padding: '28px 20px 20px', textAlign: 'center' }}>
              <BucketGauge pct={bucketPct} />
            </div>

            {/* Day context */}
            <div style={{ padding: '0 20px 16px' }}>
              <p style={{ fontSize: 12, color: P.textLight, marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>
                What kind of day is this?
              </p>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center' }}>
                {DAY_CONTEXTS.map(ctx => (
                  <button
                    key={ctx.id}
                    onClick={() => setDayCtx(dayCtx?.id === ctx.id ? null : ctx)}
                    style={{
                      padding: '7px 13px',
                      background: dayCtx?.id === ctx.id ? P.amberLight : P.card,
                      border: `1.5px solid ${dayCtx?.id === ctx.id ? P.amber : P.border}`,
                      borderRadius: 20, cursor: 'pointer',
                      fontSize: 13, color: dayCtx?.id === ctx.id ? P.brown : P.textMid,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: dayCtx?.id === ctx.id ? 600 : 400,
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {ctx.emoji} {ctx.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advice banner */}
            {advice && (
              <div style={{
                margin: '0 20px 16px',
                padding: '13px 16px',
                background: bucketPct > 70 ? P.orangeLight : P.greenLight,
                border: `1.5px solid ${bucketPct > 70 ? '#E0A090' : '#A8CCB0'}`,
                borderRadius: 13,
              }}>
                <p style={{ margin: 0, fontSize: 14, color: P.textDark, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
                  {advice}
                </p>
                {dayCtx && bucketPct < 55 && (
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: P.textLight, fontStyle: 'italic' }}>
                    {dayCtx.tip}
                  </p>
                )}
              </div>
            )}

            {/* Today's log */}
            {logged.length > 0 && (
              <div style={{ padding: '0 20px 16px' }}>
                <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
                  Today's Log
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {logged.map(item => {
                    const mult = item.amount === 'small' ? 0.5 : item.amount === 'large' ? 1.5 : 1;
                    const load = Math.round(item.load * mult);
                    return (
                      <div key={item.id} style={{
                        padding: '7px 12px',
                        background: P.card,
                        border: `1.5px solid ${P.border}`,
                        borderRadius: 20,
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 13, color: P.textMid,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {item.emoji} {item.label}
                        <span style={{ fontSize: 10, color: bucketColor(load * 3), fontWeight: 700 }}>
                          +{load}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Symptoms from check-in */}
            {checkedIn && symptoms.length > 0 && (
              <div style={{ padding: '0 20px 16px' }}>
                <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
                  How You Felt This Morning
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {symptoms.map(id => {
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
                  background: checkedIn ? P.greenLight : P.card,
                  color: checkedIn ? P.green : P.textMid,
                  border: `2px solid ${checkedIn ? '#A8CCB0' : P.border}`,
                  borderRadius: 16, fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
                }}
              >
                {checkedIn ? '✓ Checked In' : '☀️ Check In'}
              </button>
            </div>

            {/* Empty state */}
            {logged.length === 0 && !checkedIn && (
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: P.textLight, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                  Start by logging what you've eaten today,<br />or check in with how you're feeling.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 'log' && (
          <LogScreen onAdd={handleAdd} logged={logged} onBack={() => setTab('home')} />
        )}

        {tab === 'checkin' && (
          <CheckInScreen onComplete={handleCheckin} onBack={() => setTab('home')} />
        )}

        {tab === 'history' && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>📊</p>
            <h3 style={{ fontFamily: "'Lora', serif", color: P.textDark, fontSize: 20, marginBottom: 8 }}>History & Patterns</h3>
            <p style={{ fontSize: 14, color: P.textLight, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              After a few weeks of logging, this is where<br />your patterns will start to emerge.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 640,
        background: P.card,
        borderTop: `1px solid ${P.border}`,
        display: 'flex', padding: '8px 0 24px',
        zIndex: 50,
      }}>
        {[
          { id: 'home',    label: 'Today',    emoji: '🪣' },
          { id: 'log',     label: 'Log',      emoji: '＋' },
          { id: 'checkin', label: 'Check In', emoji: '☀️' },
          { id: 'history', label: 'History',  emoji: '📊' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, background: 'none', border: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', padding: '6px 0',
              opacity: tab === t.id ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: 22 }}>{t.emoji}</span>
            <span style={{
              fontSize: 11,
              color: tab === t.id ? P.brown : P.textLight,
              fontWeight: tab === t.id ? 600 : 400,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
