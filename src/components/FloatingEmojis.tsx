import React from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  Code2,
  Compass,
  Database,
  Dices,
  Dumbbell,
  Footprints,
  Globe,
  Ghost,
  Heart,
  Map,
  MapPin,
  Mountain,
  Navigation,
  Puzzle,
  Route,
  Sun,
  Terminal,
  Timer,
  TreePine,
  Watch,
  Waves,
} from 'lucide-react';

type Props = {
  // z-index within the app-shell stacking context
  z?: number;
  // Optional target container id to portal into (defaults to 'emoji-root')
  containerId?: string;
};

export default function FloatingEmojis({ z = 10, containerId = 'emoji-root' }: Props) {
  // Ensure we portal into the intended host only after it's mounted in the DOM.
  // If we resolve the target during render, it may not exist yet and we'd fall back to body,
  // which places this layer underneath the app-shell on first paint.
  const [targetEl, setTargetEl] = React.useState<HTMLElement | null>(null);

  // Prefer layout effect so the target is established before paint.
  React.useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(containerId);
    setTargetEl(el || document.body);
  }, [containerId]);

  // Build a dense set of icons with mostly pink/purple colors and a few neutral ones for contrast.
  const icons = React.useMemo(() => {
    const components = [
      Map,
      Compass,
      Globe,
      Mountain,
      Navigation,
      Route,
      TreePine,
      MapPin,
      Dumbbell,
      Activity,
      Heart,
      Ghost,
      Dices,
      Puzzle,
      Timer,
      Footprints,
      Watch,
      Code2,
      Database,
      Terminal,
      Sun,
      Waves,
    ];

    const pinkPurple = [
      'text-pink-500',
      'text-pink-600',
      'text-pink-700',
      'text-purple-500',
      'text-purple-600',
      'text-purple-700',
    ];
    const neutrals = ['text-black', 'text-gray-700'];

    const items: Array<{
      icon: React.ReactNode;
      delay: string;
      duration: string;
      left: string;
      top: string;
      animation: 'float' | 'drift';
    }> = [];

    const total = 30;
    for (let i = 0; i < total; i++) {
      const Comp = components[i % components.length];
      const usePink = (i % 10) < 8; // ~80% pink/purple
      const color = usePink
        ? pinkPurple[i % pinkPurple.length]
        : neutrals[i % neutrals.length];
      const size = i % 3 === 0 ? 'w-5 h-5' : 'w-4 h-4';
      const leftPct = ((i * 19) % 96) + 2; // 2%..98%
      const topPct = ((i * 13 + 7) % 92) + 4; // 4%..96%
      const delay = ((i * 1.3) % 30).toFixed(1) + 's';
      const duration = (18 + (i % 9)).toString() + 's';
      const animation = (i % 2 === 0) ? 'float' : 'drift';

      items.push({
        icon: <Comp className={`${size} ${color}`} />,
        delay,
        duration,
        left: `${leftPct}%`,
        top: `${topPct}%`,
        animation,
      });
    }
    return items;
  }, []);

  // If server-side rendering, render nothing
  if (typeof document === 'undefined') return null;
  // Wait until we have a target (first client paint) to avoid body fallback
  if (!targetEl) return null;

  const overlay = (
    <div
      className="emojis-overlay"
      style={{
        zIndex: z,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      {icons.map((item, index) => (
        <div
          key={index}
          className={`emoji-item animate-${item.animation}`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >

          <div className="emoji-icon">{item.icon}</div>
        </div>
      ))}
    </div>
  );

  return createPortal(overlay, targetEl);
}
