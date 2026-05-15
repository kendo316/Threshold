import { P } from '../data/palette';

export default function HistoryScreen() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>📊</p>
      <h3 style={{ fontFamily: "'Lora', serif", color: P.textDark, fontSize: 20, marginBottom: 8 }}>
        History & Patterns
      </h3>
      <p style={{ fontSize: 14, color: P.textLight, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
        After a few weeks of logging, this is where<br />your patterns will start to emerge.
      </p>
    </div>
  );
}
