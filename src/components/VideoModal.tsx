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
      
      if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
        
        let vidUrl: string;
        if (parsed.hostname === 'youtu.be') {
          const id = parsed.pathname.slice(1);
          vidUrl = `https://www.youtube-nocookie.com/embed/${id}`;
        } else {
          
          if (parsed.pathname.includes('/embed/')) {
            vidUrl = parsed.toString().replace('www.youtube.com', 'www.youtube-nocookie.com');
          } else {
            
            const v = parsed.searchParams.get('v');
            if (v) {
              vidUrl = `https://www.youtube-nocookie.com/embed/${v}`;
            } else {
              vidUrl = parsed.toString().replace('www.youtube.com', 'www.youtube-nocookie.com');
            }
          }
        }
        safeUrl = vidUrl;
      } else {
        safeUrl = parsed.toString();
      }
    }
  } catch (e) {
    safeUrl = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl md:max-w-3xl mx-4 ring-2 ring-purple-300 bg-purple-50 shadow-2xl rounded-xl">
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
                  // Rely on the boolean attribute for fullscreen and avoid using the
                  // `allow` attribute which may contain legacy/unsupported feature names
                  // that trigger browser Feature Policy warnings (these are often
                  // skipped by modern browsers). The boolean `allowFullScreen` is
                  // sufficient for enabling fullscreen for embedded players.
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    
                    // eslint-disable-next-line no-console
                    console.warn('Video iframe failed to load', e);
                  }}
                />
              ) : (
                <div className="p-8 text-center text-white">
                  <p className="font-semibold">Unable to display video</p>
                  <p className="text-sm opacity-90">The video URL is not from a supported host or appears unsafe.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t-2 border-purple-300 bg-white w-full">
            {video.description ? <p className="text-gray-700">{video.description}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
