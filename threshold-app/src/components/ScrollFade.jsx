import { P } from '../data/palette';

export default function ScrollFade({ bottom = 80 }) {
  return (
    <div style={{
      position: 'fixed',
      bottom,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 640,
      height: 52,
      background: `linear-gradient(to bottom, transparent, ${P.bg})`,
      pointerEvents: 'none',
      zIndex: 10,
    }} />
  );
}
