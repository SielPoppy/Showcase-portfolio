import React from 'react';

type Video = { url: string; title?: string; description?: React.ReactNode } | null;

export default function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  if (!video) return null;

  
  let safeUrl: string | null = null;
  try {
    const parsed = new URL(video.url, window.location.href);
    const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'player.vimeo.com', 'vimeo.com'];
    const isAllowed = allowedHosts.some((h) => parsed.hostname.includes(h));
    if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && isAllowed) {
      // Normalize common YouTube forms into a privacy-friendly embed URL.
      if (parsed.hostname.includes('youtube') || parsed.hostname === 'youtu.be') {
        let id = '';
        // youtu.be short links
        if (parsed.hostname === 'youtu.be') {
          id = parsed.pathname.slice(1);
        } else {
          // If the path contains /embed/ we can extract the id from the path
          const embedMatch = parsed.pathname.match(/\/embed\/(.+)/);
          if (embedMatch && embedMatch[1]) {
            id = embedMatch[1];
          } else {
            // otherwise try the v= query param
            id = parsed.searchParams.get('v') || '';
          }
        }

        if (id) {
          // Add a few helpful params: modestbranding, rel=0, and origin to avoid some config errors
          const params = new URLSearchParams({
            rel: '0',
            modestbranding: '1',
            origin: window.location.origin,
          });
          safeUrl = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
        }
      } else {
        // For non-YouTube allowed hosts (e.g. Vimeo), allow the parsed URL as-is
        safeUrl = parsed.toString();
      }
    }
  } catch (e) {
    safeUrl = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {/* decorative halo/shadow behind the modal to focus attention */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="w-full max-w-2xl md:max-w-3xl mx-4 rounded-xl" style={{ boxShadow: '0 40px 90px rgba(0,0,0,0.55)', filter: 'blur(28px)', opacity: 0.9 }} />
      </div>

      {/* soft, page-wide shadow cast by the modal so it appears to sit above the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          // place between the dimmer and the modal content by ordering; use a soft radial gradient and blur
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.36) 60%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0) 90%)',
          filter: 'blur(24px)',
        }}
      />

      <div className="relative z-30 w-full max-w-2xl md:max-w-3xl mx-4 ring-2 ring-purple-300 bg-purple-50 shadow-2xl rounded-xl">
        <div className="bg-white/90 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">{video.title || 'Project Video'}</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900" aria-label="Close video modal">✕</button>
          </div>

          <div className="bg-black px-4 md:px-8">
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
              {safeUrl ? (
                <iframe
                  src={safeUrl}
                  title={video.title || 'Project video'}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  frameBorder="0"
                  // Allow common features used by embedded players. Leaving this
                  // improves compatibility and avoids some player configuration errors.
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  // Don't use `no-referrer` here — including the origin (via the
                  // `origin` param above) helps embedded players validate requests.
                  referrerPolicy="strict-origin-when-cross-origin"
                  onError={(e) => {
                    // eslint-disable-next-line no-console
                    console.warn('Video iframe failed to load', e);
                  }}
                />
              ) : (
                <div className="p-8 text-center text-white">
                  <p className="font-semibold">Unable to display video</p>
                  <p className="text-sm opacity-90 mb-4">The video URL is not from a supported host or appears unsafe.</p>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-white text-black rounded-md font-medium"
                  >
                    Open in new tab
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t-2 border-purple-300 bg-white w-full">
            {video.description ? <div className="text-lg text-gray-700">{video.description}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
