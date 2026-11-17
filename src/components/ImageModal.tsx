import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Media } from '../data/portfolio';

type Props = {
  images: Media[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function ImageModal({ images, index, onClose, onPrev, onNext }: Props) {
  const [opener] = React.useState(() => typeof document !== 'undefined' && document.activeElement instanceof HTMLElement ? document.activeElement : null);
  const current = images[index];
  const canGoBack = index > 0;
  const canGoForward = index < images.length - 1;

  if (!current) return null;

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="gallery-backdrop" />
        <Dialog.Content
          className="gallery-dialog"
          onCloseAutoFocus={(event) => { event.preventDefault(); opener?.focus(); }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              if (event.key === 'ArrowLeft' && canGoBack) onPrev();
              if (event.key === 'ArrowRight' && canGoForward) onNext();
            }
          }}
        >
          <header className="gallery-header">
            <Dialog.Title>Project screenshots</Dialog.Title>
            <Dialog.Close className="gallery-close" aria-label="Close image modal"><X size={22} aria-hidden="true" /></Dialog.Close>
          </header>

          <div className="gallery-visual">
            <img src={current.src} alt={current.description || `Project screenshot ${index + 1}`} />
          </div>

          <div className="gallery-controls" role="group" aria-label="Screenshot navigation">
            <button type="button" className="gallery-button" onClick={() => { if (canGoBack) onPrev(); }} aria-disabled={!canGoBack} aria-label="Previous image">
              <ChevronLeft size={22} aria-hidden="true" /><span>Previous</span>
            </button>
            <p className="gallery-count" role="status" aria-live="polite" aria-atomic="true">{index + 1} / {images.length}</p>
            <button type="button" className="gallery-button" onClick={() => { if (canGoForward) onNext(); }} aria-disabled={!canGoForward} aria-label="Next image">
              <span>Next</span><ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>

          <Dialog.Description className="gallery-caption">{current.description || `Project screenshot ${index + 1} of ${images.length}.`}</Dialog.Description>
          <p className="gallery-keyboard-hint">← / → to browse · Esc to close</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
