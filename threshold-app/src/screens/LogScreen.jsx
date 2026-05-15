import { useState } from 'react';
import { P } from '../data/palette';
import { TRIGGERS, LOG_CATEGORIES } from '../data/triggers';
import TileModal from '../components/TileModal';

export default function LogScreen({ onAdd, loggedItems, onBack }) {
  const [modal, setModal] = useState(null);

  const handleConfirm = (trigger, amount) => {
    onAdd(trigger, amount);
    setModal(null);
  };

  return (
    <div>
      {modal && <TileModal trigger={modal} onConfirm={handleConfirm} onClose={() => setModal(null)} />}

      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: P.textMid, lineHeight: 1, padding: 0 }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 22 }}>
          What did you have?
        </h2>
      </div>

      <div style={{ padding: '12px 20px 100px' }}>
        {LOG_CATEGORIES.map(cat => {
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
                  const isLogged = loggedItems.some(l => l.triggerId === t.id);
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
