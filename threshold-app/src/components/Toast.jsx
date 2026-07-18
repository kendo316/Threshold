import { useEffect, useState } from 'react';
import { P } from '../data/palette';

export default function Toast({ children, onDismiss, autoHideMs, tone = 'warm', showDismiss = true }) {
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 220);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    let timer;
    if (autoHideMs) {
      timer = setTimeout(() => handleClose(), autoHideMs);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bg = tone === 'celebrate' ? P.greenLight : P.amberLight;
  const borderColor = tone === 'celebrate' ? '#A8CCB0' : P.amber;

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: visible ? 'calc(96px + env(safe-area-inset-bottom))' : 'calc(70px + env(safe-area-inset-bottom))',
        transform: `translateX(-50%) scale(${visible ? 1 : 0.94})`,
        opacity: visible ? 1 : 0,
        transition: 'bottom 0.38s cubic-bezier(.2,.8,.25,1), opacity 0.3s ease, transform 0.38s cubic-bezier(.2,.8,.25,1)',
        width: 'calc(100% - 40px)',
        maxWidth: 500,
        zIndex: 500,
        pointerEvents: 'auto',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{
        background: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 8px 24px rgba(30,14,6,0.18)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {children}
        {!autoHideMs && showDismiss && (
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', color: P.textLight,
              fontSize: 12, cursor: 'pointer', padding: '6px 0 0',
              display: 'block', marginLeft: 'auto', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
