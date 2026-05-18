import { useState } from 'react';
import { P } from '../data/palette';
import { TRIGGERS, SYMPTOMS } from '../data/triggers';
import { bucketColor, bucketBg } from '../data/bucketUtils';
import TileModal from './TileModal';

function formatDateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function PastDayModal({ dateKey, logData, checkinData, onAppendItem, onClose }) {
  const [addModal, setAddModal] = useState(null);
  const items = logData?.items ?? [];
  const load = logData?.totalLoad ?? 0;
  const symptoms = checkinData?.symptoms ?? [];

  const handleAddConfirm = async (trigger, amount) => {
    await onAppendItem(dateKey, trigger, amount);
    setAddModal(null);
  };

  return (
    <>

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
            background: P.bg,
            borderRadius: '24px 24px 0 0',
            padding: '28px 24px 44px',
            width: '100%', maxWidth: 560,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 20 }}>
                {formatDateLabel(dateKey)}
              </h3>
              <p style={{
                margin: '4px 0 0', fontSize: 13,
                color: bucketColor(load),
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              }}>
                {load}% bucket load
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: 22, color: P.textLight, cursor: 'pointer', padding: 0, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          {items.length === 0 && (
            <p style={{ fontSize: 14, color: P.textLight, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
              Nothing logged for this day.
            </p>
          )}

          {items.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                Logged Items
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px',
                    background: P.card, border: `1.5px solid ${P.border}`,
                    borderRadius: 13,
                  }}>
                    <span style={{ fontSize: 14, color: P.textDark, fontFamily: "'DM Sans', sans-serif" }}>
                      {item.label}
                      <span style={{ fontSize: 11, color: P.textLight, marginLeft: 6, textTransform: 'capitalize' }}>
                        ({item.amount})
                      </span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: bucketColor(item.effectiveLoad * 3), fontFamily: "'DM Sans', sans-serif" }}>
                      +{item.effectiveLoad}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {symptoms.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: P.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                Next Morning Check-In
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

          <button
            onClick={() => setAddModal('open')}
            style={{
              width: '100%', padding: '14px',
              background: 'transparent',
              border: `1.5px dashed ${P.border}`,
              borderRadius: 14, cursor: 'pointer',
              fontSize: 14, color: P.textLight,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            + Add something I forgot
          </button>

          {addModal === 'open' && (
            <AddForgottenModal
              loggedIds={items.map(i => i.triggerId)}
              onAdd={handleAddConfirm}
              onClose={() => setAddModal(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}

function AddForgottenModal({ loggedIds, onAdd, onClose }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      {selected && (
        <TileModal
          trigger={selected}
          isLogged={false}
          zIndex={400}
          onConfirm={(trigger, amount) => { onAdd(trigger, amount); setSelected(null); }}
          onClose={() => setSelected(null)}
        />
      )}
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
            padding: '24px 20px 44px',
            width: '100%', maxWidth: 560,
            maxHeight: '70vh', overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontFamily: "'Lora', serif", color: P.textDark, fontSize: 18 }}>
              What did you forget?
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: P.textLight, cursor: 'pointer', padding: 0 }}>✕</button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: 10,
          }}>
            {TRIGGERS.map(t => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                style={{
                  padding: '14px 8px 10px',
                  background: P.card,
                  border: `2px solid ${P.border}`,
                  borderRadius: 16, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 30, lineHeight: 1 }}>{t.emoji}</span>
                <span style={{ fontSize: 10, lineHeight: 1.3, textAlign: 'center', color: P.textMid, fontFamily: "'DM Sans', sans-serif" }}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
