import React from 'react';
import { createPortal } from 'react-dom';
import { CardContent } from './ui/card';

interface Skill {
  name: string;
  usage: string;
}

interface Props {
  open: boolean;
  title?: string;
  skills: Skill[];
  // anchor element to position the panel above
  anchorEl?: HTMLElement | null;
  onClose: () => void;
}

export default function SkillUsagePanel({ open, title, skills, anchorEl, onClose }: Props) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null);
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;
    const compute = () => {
      const panel = panelRef.current;
      if (!anchorEl || !panel) {
        // fallback: center bottom
        setPos(null);
        return;
      }

      const aRect = anchorEl.getBoundingClientRect();
      const pRect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      let left = Math.round(aRect.left + aRect.width / 2 - pRect.width / 2);
      const minLeft = 8;
      const maxLeft = Math.max(8, viewportWidth - pRect.width - 8);
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      let top = Math.round(aRect.top - pRect.height - 12);
      if (top < 8) {
        // not enough room above, show below the anchor
        top = Math.round(aRect.bottom + 12);
      }

      setPos({ left, top });
    };

    // compute after next paint so panel has measured size
    const raf = requestAnimationFrame(() => setTimeout(compute, 0));
    window.addEventListener('resize', compute);
    document.addEventListener('scroll', compute, true);
    return () => {
      cancelAnimationFrame(raf as unknown as number);
      window.removeEventListener('resize', compute);
      document.removeEventListener('scroll', compute, true);
    };
  }, [open, anchorEl, skills]);

  // ensure portal root exists when open
  React.useEffect(() => {
    if (!open) return;
    const id = 'skill-usage-panel-root';
    let el = document.getElementById(id) as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
    setPortalRoot(el);
    return () => setPortalRoot(null);
  }, [open]);

  // close when pointerdown happens outside panel and outside anchor
  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const panel = panelRef.current;
      const target = e.target as Node | null;
      if (panel && (panel.contains(target))) return;
      if (anchorEl && anchorEl.contains(target)) return;
      onClose();
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, anchorEl, onClose]);

  if (!open || !portalRoot) return null;

  const panelNode = (
    <div
      ref={panelRef}
      className="pointer-events-auto"
      style={{
        position: 'fixed',
        left: pos ? `${pos.left}px` : undefined,
        top: pos ? `${pos.top}px` : undefined,
        right: pos ? 'auto' : '4rem',
        zIndex: 2147483647,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(6px)',
        maxWidth: 'min(720px, calc(100% - 32px))',
        padding: '1rem',
        maxHeight: '56vh',
        overflow: 'auto',
      }}
    >
      <div className="mb-3">
        <h3 className="font-semibold text-black">{title ?? 'Skill details'}</h3>
      </div>

      <CardContent className="p-0">
        <div className="space-y-3">
          {skills.length === 1 ? (
            // single skill: show only the title (rendered above) and the description
            <div key={skills[0].name} className="rounded-md p-3 bg-white/0">
              <div className="text-sm text-gray-700 leading-relaxed">{skills[0].usage || <span className="text-gray-400">(No description)</span>}</div>
            </div>
          ) : (
            // multiple skills: show name + description for each
            skills.map((s) => (
              <div key={s.name} className="rounded-md p-3 bg-white/0">
                <div className="font-medium mb-1 text-sm text-black">{s.name}</div>
                <div className="text-sm text-gray-700 leading-relaxed">{s.usage || <span className="text-gray-400">(No description)</span>}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </div>
  );

  return createPortal(panelNode, portalRoot);
}
