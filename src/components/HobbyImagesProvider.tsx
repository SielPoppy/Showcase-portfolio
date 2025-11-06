import React, { createContext, useContext, useEffect, useState } from 'react';

export type HobbyImage = { url: string; title: string };
export type HobbyImagesManifest = { [slug: string]: HobbyImage[] };

const HobbyImagesContext = createContext<HobbyImagesManifest>({});

function titleFromUrl(url: string) {
  try {
    const parts = url.split('/');
    const file = parts[parts.length - 1] || '';
    const name = file.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ');
    return name.replace(/\b\w/g, (m) => m.toUpperCase());
  } catch (err) {
    return '';
  }
}

export function HobbyImagesProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<HobbyImagesManifest>({});

  useEffect(() => {
    let mounted = true;
    fetch('/data/hobbyImagesManifest.json', { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('manifest not found');
        return res.json();
      })
      .then((json: HobbyImagesManifest) => {
        if (!mounted) return;
        // Ensure every item has a friendly title derived from filename if missing
        const normalized: HobbyImagesManifest = {};
        Object.keys(json || {}).forEach((slug) => {
          const items = (json as any)[slug] || [];
          normalized[slug] = items.map((it: any) => ({ url: it.url, title: it.title || titleFromUrl(it.url) }));
        });
        setMap(normalized);
      })
      .catch(() => {
        // keep empty map on failure
        if (mounted) setMap({});
      });

    return () => {
      mounted = false;
    };
  }, []);

  return <HobbyImagesContext.Provider value={map}>{children}</HobbyImagesContext.Provider>;
}

export function useHobbyImages() {
  return useContext(HobbyImagesContext);
}

export default HobbyImagesProvider;
