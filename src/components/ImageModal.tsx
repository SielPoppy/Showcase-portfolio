import React from 'react';
import Portal from './Portal';

export default function ImageModal({ images, index, onClose, onPrev, onNext }: {
  images: any[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!images || images.length === 0) return null;
  const current = images[index];
  const canGoBack = index > 0;
  const canGoForward = index < images.length - 1;

  // Prevent the opening click from immediately closing the modal.
  const ignoreClicksUntil = React.useRef<number>(0);
  React.useEffect(() => {
    // allow content to mount before accepting backdrop clicks
    ignoreClicksUntil.current = performance.now() + 250;
  }, []);

  // Close on Escape for accessibility
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Portal containerId="app-modal-root">
      <div className="modal-root" key="image-modal">
      <div
        className="modal-backdrop"
        onMouseDown={(e) => {
          // ignore the initial opening click
          if (performance.now() < ignoreClicksUntil.current) return;
          onClose();
        }}
      />
      {/* decorative halo/shadow behind the modal to focus attention */}
      <div className="modal-halo" aria-hidden>
        <div className="modal-halo-inner" />
      </div>


      {/* soft, page-wide shadow cast by the modal */}
      <div className="modal-shadow" aria-hidden />

      <div
        className="image-modal-frame"
        onMouseDown={(e) => {
          // prevent backdrop handler from seeing clicks that start inside the modal
          e.stopPropagation();
        }}
      >
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Project Images</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900" aria-label="Close image modal">✕</button>
          </div>

          <div className="image-stage">
            {canGoBack && (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 z-30" onClick={onPrev} aria-label="Back to previous image">
                <img src="/icons/arrow-27-16-left.ico" alt="Previous" className="w-16 h-16" />
              </button>
            )}

            <img src={current.src} alt={typeof current.description === 'string' ? current.description : ''} className="block max-w-[90%] md:max-w-[80%] max-h-[60vh] h-auto w-auto rounded shadow-lg object-contain object-center" />

            {canGoForward && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 z-30" onClick={onNext} aria-label="Next image">
                <img src="/icons/arrow-27-16.ico" alt="Next" className="w-16 h-16" />
              </button>
            )}
          </div>

          <div className="image-desc">
            {typeof current.description === 'string' ? (
              <p className="text-lg text-gray-700">{current.description}</p>
            ) : (
              current.description
            )}
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}

