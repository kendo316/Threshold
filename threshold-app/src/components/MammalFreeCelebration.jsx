import { useState } from 'react';
import { P } from '../data/palette';
import Toast from './Toast';
import RobotEasterEgg from './RobotEasterEgg';

// Render this only at the moment a day is marked mammal-free. The robot
// roll happens once, on mount — never on re-render — so the easter egg
// stays a rare surprise instead of wallpaper.
export default function MammalFreeCelebration({ onDismiss }) {
  const [kind] = useState(() => (Math.random() < 0.12 ? 'robot' : 'plain'));
  return (
    <Toast tone="celebrate" autoHideMs={kind === 'robot' ? 4600 : 3000} onDismiss={onDismiss}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: P.green, fontFamily: "'Lora', serif" }}>
        Mammal-free day ✨
      </p>
      {kind === 'robot' && <RobotEasterEgg />}
    </Toast>
  );
}
