import React from 'react';
import { projects, featuredProjectIds } from '../data/projects';
import type { Project, Skill } from '../data/projects';
import { SkillBadge } from './SkillBadge';
import { Button } from './ui/button';
import { getSkillCategory } from './utils/skillCategories';
import { useIsMobile } from './ui/use-mobile';

type Props = {
  onOpenVideo: (video: { url: string; title?: string; description?: React.ReactNode }) => void;
  onOpenImages: (images: any[]) => void;
};

export default function MoreProjects({ onOpenVideo, onOpenImages }: Props) {
  const nonFeatured: Project[] = projects.filter((p) => !featuredProjectIds.includes(p.id));

  if (nonFeatured.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="text-center mb-8">
        <h3 className="featured-subtitle">More projects</h3>
        <br/>
        <p className="text-gray-700">Explore additional work and experiences</p>
        <br/>
      </div>

      {/* Match featured card width: 1 col on small, 2 cols on lg with same gap */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {nonFeatured.map((p) => (
          <MinimalProjectTile key={p.id} project={p} onOpenImages={onOpenImages} onOpenVideo={onOpenVideo} />
        ))}
      </div>
    </div>
  );
}

// Minimal non-featured tile component
function MinimalProjectTile({ project, onOpenImages, onOpenVideo }: { project: Project; onOpenImages: (images: any[]) => void; onOpenVideo: (video: { url: string; title?: string; description?: React.ReactNode }) => void }) {
  const isMobile = useIsMobile();
  // Determine the best image to show (prefer non-company project image, fall back to first)
  const candidateImages: any[] = [
    ...(project.projectImages || []),
    ...(project.images || []),
  ];
  const mainImage = candidateImages.find((img) => !img?.src?.includes('/images/companies/')) || candidateImages[0] || null;
  const allProjectImages = candidateImages.filter((img) => !img?.src?.includes('/images/companies/'));

  // Normalize skills list to names
  const skills: string[] = Array.isArray(project.skills)
    ? (project.skills as Skill[]).map((s: any) => (s && s.name) ? s.name : String(s))
    : [];

  // Only show skills from these categories
  const allowedCategories = new Set([
    'Frontend Technologies',
    'Backend Technologies',
    'Databases & Storage',
    'IoT & Embedded',
  ]);
  const filteredSkills = skills.filter((name) => allowedCategories.has(getSkillCategory(name).name));

  // Sort badges by category: Databases, Backend, Frontend, IoT; then alphabetical
  const categoryOrder: Record<string, number> = {
    'Databases & Storage': 0,
    'Backend Technologies': 1,
    'Frontend Technologies': 2,
    'IoT & Embedded': 3,
  };
  const sortedSkills = filteredSkills.slice().sort((a, b) => {
    const ca = categoryOrder[getSkillCategory(a).name] ?? 999;
    const cb = categoryOrder[getSkillCategory(b).name] ?? 999;
    if (ca !== cb) return ca - cb;
    return a.localeCompare(b);
  });

  const handleTileClick = () => {
    if (!isMobile) return;
    if (allProjectImages.length > 0) {
      onOpenImages(allProjectImages);
    } else if (Array.isArray(project.projectVideo) && project.projectVideo.length > 0) {
      const v = project.projectVideo[0];
      onOpenVideo({ url: v.src, title: project.company, description: v.description ?? project.description });
    } else if (project.videoId) {
      onOpenVideo({ url: `https://www.youtube.com/embed/${project.videoId}`, title: project.company, description: project.description });
    }
  };

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl border-2 border-purple-800 bg-white p-[10px] hover:shadow-2xl transition-all duration-300 ring-2 ring-purple-400/18 group-hover:ring-6 group-hover:ring-purple-500/30 ${isMobile ? 'cursor-pointer' : ''}`}
      style={{ boxShadow: '0 0 12px rgba(124,58,237,0.22), 0 6px 18px rgba(124,58,237,0.10)', display: 'flex', flexDirection: 'column' }}
      onClick={handleTileClick}
      role={isMobile ? 'button' : undefined}
      tabIndex={isMobile ? 0 : undefined}
      onKeyDown={isMobile ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTileClick(); } } : undefined}
    >
      {/* Mobile-only title placed above the image to avoid overlap */}
      {isMobile && (
        <div style={{padding: '18px 18px 8px 18px'}}>
          <div className="text-black text-base font-semibold">{project.title}</div>
        </div>
      )}

      {/* Media area with fixed aspect to control height relative to width */}
      <div className="relative w-full aspect-[16/9] bg-white">
        {/* Desktop/tablet title bar overlay (hidden on mobile) */}
  <div className="hidden md:block absolute z-10 bottom-3 left-0 pr-2 py-2 rounded-md bg-black/55 text-black text-sm font-semibold pointer-events-none transition-opacity duration-200 group-hover:opacity-0 shadow" style={{ marginLeft: 16 }}>
          {project.title}
        </div>


        {/* Image wrapper ensures no stretch and centers the image with white outside */}
        <div className="absolute inset-0 bg-white flex items-center justify-center p-4 md:p-5 transition-opacity duration-200 group-hover:opacity-0">
          {mainImage ? (
            <img
              src={mainImage.src as string}
              alt={project.title}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">No image</div>
          )}
        </div>

  {/* Hover overlay (covers image completely) */}
  <div className="absolute inset-0 bg-white pt-4 md:pt-5 px-4 md:px-5 pb-16 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ pointerEvents: isMobile ? 'none' : undefined }}>
          <div className="mb-2">
            <br/>
            <div className="text-xs text-gray-600">{project.company} • {project.duration}</div>
          </div>
          <div className="text-sm text-gray-800 leading-relaxed flex-1">{project.description}</div>
          {sortedSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sortedSkills.map((name) => (
                <SkillBadge key={`${project.id}::${name}`} skill={name} tooltipTrigger="hover" />
              ))}
            </div>
          )}

          {/* Pinned action buttons: bottom-centered, 10px offset using inline style to avoid tailwind purge/config issues */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 whitespace-nowrap" style={{ bottom: 10 }}>
            {allProjectImages.length > 0 && (
              <Button
                variant="outline"
                className="border-purple-400 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-full shadow flex items-center gap-2"
                onClick={() => onOpenImages(allProjectImages)}
                aria-label={`View images for ${project.company}`}
              >
                <span className="inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-purple-600">
                    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                    <circle cx="8" cy="10" r="2" fill="currentColor" />
                    <path strokeWidth="2" d="M21 19l-5-5a3 3 0 0 0-4 0l-5 5" />
                  </svg>
                </span>
                View Images
              </Button>
            )}
            {(Array.isArray(project.projectVideo) && project.projectVideo.length > 0) || project.videoId ? (
              <Button
                variant="outline"
                className="border-purple-400 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-full shadow flex items-center gap-2"
                onClick={() => {
                  if (Array.isArray(project.projectVideo) && project.projectVideo.length > 0) {
                    const v = project.projectVideo[0];
                    onOpenVideo({ url: v.src, title: project.company, description: v.description ?? project.description });
                  } else if (project.videoId) {
                    onOpenVideo({ url: `https://www.youtube.com/embed/${project.videoId}`, title: project.company, description: project.description });
                  }
                }}
                aria-label={`View video for ${project.company}`}
              >
                <span className="inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink-600">
                    <path d="M6.5 5.5v13l12-6.5-12-6.5z" />
                  </svg>
                </span>
                View Video
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
