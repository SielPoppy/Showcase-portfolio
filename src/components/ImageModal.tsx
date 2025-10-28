import React from 'react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl md:max-w-3xl mx-4 ring-2 ring-purple-300 bg-purple-50 shadow-2xl rounded-xl">
        <div className="bg-white/90 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Project Images</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900" aria-label="Close image modal">✕</button>
          </div>

          <div className="relative w-full flex flex-col items-center justify-center bg-black py-4 px-4 md:px-8">
            {canGoBack && (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 z-30" onClick={onPrev} aria-label="Back to previous image">
                <img src="/icons/arrow-27-16.ico" alt="Previous" className="w-7 h-7" style={{ transform: 'rotate(180deg)' }} />
              </button>
            )}

            <img src={current.src} alt={typeof current.description === 'string' ? current.description : ''} className="block max-w-[90%] md:max-w-[80%] max-h-[60vh] h-auto w-auto rounded shadow-lg" style={{ objectFit: 'contain', objectPosition: 'center' }} />

            {canGoForward && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 z-30" onClick={onNext} aria-label="Next image">
                <img src="/icons/arrow-27-16.ico" alt="Next" className="w-7 h-7" />
              </button>
            )}
          </div>

          <div className="p-4 border-t-2 border-purple-300 bg-white w-full">
            {typeof current.description === 'string' ? current.description : null}
          </div>
        </div>
      </div>
    </div>
  );
}

