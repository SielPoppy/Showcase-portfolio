import React from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  Bike,
  Code2,
  Compass,
  Database,
  Dumbbell,
  Footprints,
  Globe,
  Heart,
  Map,
  MapPin,
  Mountain,
  Navigation,
  Route,
  Sun,
  Target,
  Terminal,
  Timer,
  TreePine,
  Trophy,
  Watch,
  Waves,
  Zap,
} from 'lucide-react';

type Props = {
  z?: number;
};

export default function FloatingEmojis({ z = -1 }: Props) {
  const icons = [
    { icon: <Map className="w-5 h-5 text-purple-600" />, delay: '0s', duration: '20s', left: '10%', top: '10%', animation: 'float' },
    { icon: <Compass className="w-4 h-4 text-pink-600" />, delay: '5s', duration: '25s', left: '20%', top: '25%', animation: 'drift' },
    { icon: <Globe className="w-5 h-5 text-purple-500" />, delay: '10s', duration: '18s', left: '80%', top: '15%', animation: 'float' },
    { icon: <Mountain className="w-5 h-5 text-black" />, delay: '15s', duration: '22s', left: '70%', top: '30%', animation: 'drift' },
    { icon: <Navigation className="w-4 h-4 text-pink-500" />, delay: '3s', duration: '19s', left: '30%', top: '40%', animation: 'float' },
    { icon: <Route className="w-5 h-5 text-purple-600" />, delay: '8s', duration: '24s', left: '60%', top: '50%', animation: 'drift' },
    { icon: <TreePine className="w-4 h-4 text-black" />, delay: '12s', duration: '21s', left: '40%', top: '60%', animation: 'float' },
    { icon: <MapPin className="w-4 h-4 text-pink-600" />, delay: '6s', duration: '23s', left: '90%', top: '70%', animation: 'drift' },

    { icon: <Dumbbell className="w-5 h-5 text-purple-500" />, delay: '18s', duration: '20s', left: '5%', top: '80%', animation: 'float' },
    { icon: <Activity className="w-4 h-4 text-pink-600" />, delay: '2s', duration: '26s', left: '85%', top: '45%', animation: 'drift' },
    { icon: <Heart className="w-4 h-4 text-pink-500" />, delay: '14s', duration: '17s', left: '15%', top: '65%', animation: 'float' },
    { icon: <Target className="w-5 h-5 text-purple-600" />, delay: '7s', duration: '19s', left: '95%', top: '85%', animation: 'drift' },
    { icon: <Trophy className="w-4 h-4 text-purple-600" />, delay: '11s', duration: '23s', left: '25%', top: '75%', animation: 'float' },
    { icon: <Timer className="w-4 h-4 text-black" />, delay: '4s', duration: '21s', left: '75%', top: '55%', animation: 'drift' },
    { icon: <Bike className="w-5 h-5 text-pink-500" />, delay: '16s', duration: '18s', left: '45%', top: '35%', animation: 'float' },
    { icon: <Footprints className="w-4 h-4 text-purple-500" />, delay: '9s', duration: '24s', left: '65%', top: '20%', animation: 'drift' },
    { icon: <Watch className="w-4 h-4 text-black" />, delay: '13s', duration: '20s', left: '35%', top: '90%', animation: 'float' },
    { icon: <Zap className="w-4 h-4 text-pink-600" />, delay: '1s', duration: '25s', left: '55%', top: '5%', animation: 'drift' },

    { icon: <Code2 className="w-4 h-4 text-purple-500" />, delay: '17s', duration: '22s', left: '12%', top: '50%', animation: 'float' },
    { icon: <Database className="w-4 h-4 text-black" />, delay: '19s', duration: '26s', left: '88%', top: '35%', animation: 'drift' },
    { icon: <Terminal className="w-4 h-4 text-pink-500" />, delay: '22s', duration: '20s', left: '92%', top: '10%', animation: 'float' },

    { icon: <Sun className="w-5 h-5 text-purple-600" />, delay: '25s', duration: '24s', left: '8%', top: '95%', animation: 'drift' },
    { icon: <Waves className="w-4 h-4 text-black" />, delay: '28s', duration: '18s', left: '50%', top: '85%', animation: 'float' },
  ];

  // If server-side rendering, render nothing
  if (typeof document === 'undefined') return null;

  const overlay = (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: z }}>
      {icons.map((item, index) => (
        <div
          key={index}
          className={`absolute animate-${item.animation} transition-opacity duration-1000 opacity-90 drop-shadow-xl`}
          style={{
            left: item.left,
            top: item.top,
            transform: 'translate(-50%, -50%)',
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >

          <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
        </div>
      ))}
    </div>
  );

  return createPortal(overlay, document.body);
}
