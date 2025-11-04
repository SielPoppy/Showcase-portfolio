import React from 'react';
import { createPortal } from 'react-dom';

// A tiny portal helper that renders children into a stable container in <body>.
// We create the container lazily and keep it for the app lifetime to avoid
// attach/detach races that can cause DOMException in some browsers.
export default function Portal({ children, containerId = 'app-modal-root' }: { children: React.ReactNode; containerId?: string }) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    let el = document.getElementById(containerId) as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      // keep this container around permanently; do not remove on unmount
      // to avoid removeChild races during rapid mounts/unmounts
      document.body.appendChild(el);
    }
    setTarget(el);
  }, [containerId]);

  if (!target) return null;
  return createPortal(children, target);
}
