import { useState } from 'react';
import { P } from '../data/palette';
import { bucketBg, bucketColor } from '../data/bucketUtils';
import {
  getAmountOptions, computeEffectiveLoad,
  NSAID_TYPE_OPTIONS, NSAID_TIMING_OPTIONS, computeNsaidLoad,
  FAT_PROFILE_OPTIONS, computeFatAdjustedLoad,
} from '../data/triggers';

function ChoiceRow({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          style={{
            flex: 1, padding: '13px 6px 11px',
            border: `2px solid ${selected === o.key ? P.amber : P.border}`,
            borderRadius: 13,
            background: selected === o.key ? P.amberLight : 'white',
            color: selected === o.key ? P.brown : P.textMid,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: selected === o.key ? 600 : 400, textAlign: 'center' }}>{o.label}</span>
          {o.descriptor && (
            <span style={{ fontSize: 10, color: selected === o.key ? P.brownLight : P.textLight, lineHeight: 1.3, textAlign: 'center' }}>
              {o.descriptor}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function TileModal({ trigger, isLogged, existingItem, onConfirm, onRemove, onClose, zIndex = 200 }) {
  const isNsaid = trigger.nsaidModifier === true;
  const isMeat = trigger.cat === 'meat';

  const amountOptions = getAmountOptions(trigger.id);
  const defaultAmount = amountOptions.find(o => o.key === 'moderate')?.key ?? amountOptions[0].key;
  const [amount, setAmount] = useState(existingItem?.amount ?? defaultAmount);
  const [nsaidType, setNsaidType] = useState(existingItem?.nsaidType ?? 'nsaid');
  const [nsaidTiming, setNsaidTiming] = useState(existingItem?.nsaidTiming ?? 'simultaneous');
  const [fatProfile, setFatProfile] = useState(existingItem?.fatProfile ?? 'fatty');

  let effectiveLoad, confirmExtra, confirmAmount;
  if (isNsaid) {
    effectiveLoad = computeNsaidLoad(trigger, nsaidType, nsaidTiming);
    const typeLabel = NSAID_TYPE_OPTIONS.find(o => o.key === nsaidType).label;
    const timingLabel = NSAID_TIMING_OPTIONS.find(o => o.key === nsaidTiming).label;
    confirmAmount = `${typeLabel}, ${timingLabel.toLowerCase()}`;
    confirmExtra = { nsaidType, nsaidTiming, effectiveLoad };
  } else if (isMeat) {
    effectiveLoad = computeFatAdjustedLoad(trigger, amount, fatProfile);
    confirmAmount = amount;
    confirmExtra = { fatProfile, effectiveLoad };
  } else {
    effectiveLoad = computeEffectiveLoad(trigger, amount);
    confirmAmount = amount;
    confirmExtra = { effectiveLoad };
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,14,6,0.55)',
        zIndex,
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
          <p style={{ margin: '6px 0 0', fontSize: 13, color: P.textLight, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
            {trigger.note}
          </p>
        </div>

        {isNsaid && (
          <>
            <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
              What kind?
            </p>
            <ChoiceRow options={NSAID_TYPE_OPTIONS} selected={nsaidType} onSelect={setNsaidType} />
            <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
              When, relative to food?
            </p>
            <ChoiceRow options={NSAID_TIMING_OPTIONS} selected={nsaidTiming} onSelect={setNsaidTiming} />
          </>
        )}

        {!isNsaid && (
          <>
            <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
              How much?
            </p>
            <ChoiceRow options={amountOptions} selected={amount} onSelect={setAmount} />
          </>
        )}

        {isMeat && (
          <>
            <p style={{ fontSize: 13, color: P.textMid, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
              Fat profile?
            </p>
            <ChoiceRow options={FAT_PROFILE_OPTIONS} selected={fatProfile} onSelect={setFatProfile} />
          </>
        )}

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
          onClick={() => onConfirm(trigger, confirmAmount, confirmExtra)}
          style={{
            width: '100%', padding: '16px',
            background: P.brown, color: 'white',
            border: 'none', borderRadius: 14,
            fontSize: 16, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, cursor: 'pointer',
            marginBottom: isLogged ? 10 : 0,
          }}
        >
          {isLogged ? 'Update' : 'Add to Today'}
        </button>

        {isLogged && (
          <button
            onClick={() => onRemove(trigger)}
            style={{
              width: '100%', padding: '13px',
              background: 'transparent', color: P.textLight,
              border: `1.5px solid ${P.border}`, borderRadius: 14,
              fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            Remove from today's log
          </button>
        )}
      </div>
    </div>
  );
}
