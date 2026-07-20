import { P } from '../data/palette';
import { bucketColor, bucketLabel } from '../data/bucketUtils';

export default function BucketGauge({ pct, thresholds }) {
  const r = 68;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  const color = bucketColor(pct);
  const label = bucketLabel(pct);

  // Draw threshold tick marks on the gauge ring
  const thresholdTicks = thresholds
    ? Object.entries(thresholds).map(([key, val]) => {
        const angle = (val / 100) * 2 * Math.PI - Math.PI / 2;
        const innerR = r - 10;
        const outerR = r + 4;
        const x1 = 88 + innerR * Math.cos(angle);
        const y1 = 88 + innerR * Math.sin(angle);
        const x2 = 88 + outerR * Math.cos(angle);
        const y2 = 88 + outerR * Math.sin(angle);
        const tickColor = key === 'gi' ? P.amber : key === 'hives' ? P.orange : P.red;
        return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tickColor} strokeWidth="3" strokeLinecap="round" />;
      })
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 176, height: 176 }}>
        <svg width="176" height="176" style={{ display: 'block' }}>
          <circle cx="88" cy="88" r={r} fill="none" stroke={P.borderLight} strokeWidth="13"
            strokeDasharray={`${circ} 0`}
            transform="rotate(-90 88 88)"
          />
          <circle
            cx="88" cy="88" r={r}
            fill="none"
            stroke={color}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 88 88)"
            style={{
              transition: 'stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1), stroke 0.4s ease, opacity 0.4s ease',
              // A zero-length arc with a round cap still paints a dot — hide
              // the arc entirely at 0% so an empty bucket looks empty.
              opacity: pct > 0 ? 1 : 0,
            }}
          />
          {thresholdTicks}
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
