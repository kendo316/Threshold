const PX = '#B8C4CC';
const PX_DARK = '#7C8A94';
const EYE = '#5CD6E8';

export default function RobotEasterEgg() {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 8,
      marginTop: 10, animation: 'robotPopIn 0.5s cubic-bezier(.3,1.4,.4,1)',
    }}>
      {/* Pixel-art robot, built from stacked squares */}
      <div style={{ width: 32, flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 5px)', gridAutoRows: '5px', gap: 1, imageRendering: 'pixelated' }}>
          {/* antenna */}
          <div style={{ gridColumn: '3 / 5', background: PX_DARK }} />
          <div style={{ gridColumn: '3 / 5', background: 'transparent' }} />
          {/* head row 1 */}
          <div style={{ gridColumn: '1 / 7', background: PX }} />
          {/* head row 2 - eyes */}
          <div style={{ background: PX }} />
          <div style={{ background: EYE, boxShadow: `0 0 4px ${EYE}` }} />
          <div style={{ background: PX }} />
          <div style={{ background: PX }} />
          <div style={{ background: EYE, boxShadow: `0 0 4px ${EYE}` }} />
          <div style={{ background: PX }} />
          {/* head row 3 */}
          <div style={{ gridColumn: '1 / 7', background: PX }} />
          {/* neck / body row */}
          <div style={{ gridColumn: '2 / 6', background: PX_DARK }} />
        </div>
      </div>

      {/* Speech bubble */}
      <div style={{
        background: 'white',
        border: '2px solid #1E0E06',
        borderRadius: 8,
        padding: '5px 9px',
        position: 'relative',
        marginBottom: 4,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          color: '#1E0E06', fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}>
          COMPLIANCE!
        </span>
        <div style={{
          position: 'absolute', left: -7, bottom: 6,
          width: 0, height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: '7px solid #1E0E06',
        }} />
        <div style={{
          position: 'absolute', left: -4.5, bottom: 7,
          width: 0, height: 0,
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderRight: '6px solid white',
        }} />
      </div>

      <style>{`
        @keyframes robotPopIn {
          0%   { opacity: 0; transform: translateY(6px) scale(0.85); }
          60%  { opacity: 1; transform: translateY(-2px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
