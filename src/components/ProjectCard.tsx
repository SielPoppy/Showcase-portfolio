import React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SkillBadge } from './SkillBadge';
import SkillUsagePanel from './SkillUsagePanel';
import CategoryBadge from './CategoryBadge';
import { getSkillCategory } from './utils/skillCategories';
import type { Project, Skill } from '../../public/data/projects';

type Props = {
  project: Project;
  onOpenVideo: (video: { url: string; title?: string; description?: React.ReactNode }) => void;
  onOpenImages: (images: any[]) => void;
  // allow optional React `key` to satisfy JSX usage without changing runtime behavior
  key?: React.Key;
  // when true, render a compact variant (smaller top image area and reduced min height)
  compact?: boolean;
};

export default function ProjectCard({ project, onOpenVideo, onOpenImages, compact }: Props) {
  // defensive: ensure skills is always an array to avoid runtime errors
  const skillsArr: Skill[] = Array.isArray(project.skills) ? project.skills : [];

  // Build the array of non-logo images (used for the "View Images" action)
  const allProjectImages = [...(project.projectImages || []), ...(project.images || [])].filter((img: any) => !img.src?.includes('/images/companies/'));

  // Company logo (the only image we render in the top box now)
  const companyLogo = (project.images || []).find((img: any) => img.src?.includes('/images/companies/')) || null;

  // When the top box is clicked: prefer opening images, otherwise fallback to video
  const handleImageClick = () => {
    if (allProjectImages.length > 0) {
      onOpenImages(allProjectImages);
    } else if (Array.isArray(project.projectVideo) && project.projectVideo.length > 0) {
      const v = project.projectVideo[0];
      onOpenVideo({ url: v.src, title: project.company, description: v.description ?? project.description });
    } else if (project.videoId) {
      onOpenVideo({ url: `https://www.youtube.com/embed/${project.videoId}`, title: project.company, description: project.description });
    }
  };

  // Measure actions block height so we can reserve space in CardContent to guarantee
  // a minimum gap between description and the actions. This avoids hardcoding a
  // fixed bottom padding that may be too small or too large when the actions wrap.
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const [actionsHeight, setActionsHeight] = useState<number>(0);

  // Measure this card's logo area so we can align the badge relative to the
  // tallest logo across all cards. We compute a global max by reading all
  // elements with the `.project-logo` class and keep it in component state so
  // rendering can use it synchronously.
  const logoRef = useRef<HTMLDivElement | null>(null);
  const [logoHeight, setLogoHeight] = useState<number>(0);
  const [maxLogoHeight, setMaxLogoHeight] = useState<number>(0);

  // Skill usage panel state (single skill or grouped)
  const [usagePanelOpen, setUsagePanelOpen] = useState(false);
  const [panelSkills, setPanelSkills] = useState<Skill[]>([]);
  const [panelTitle, setPanelTitle] = useState<string>('');
  const [panelAnchorEl, setPanelAnchorEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    // initialize
    setActionsHeight(el.offsetHeight || 0);
    const ro = new ResizeObserver(() => {
      setActionsHeight(el.offsetHeight || 0);
    });
    ro.observe(el);
    // also listen to window resize in case fonts/flow change
    const onWin = () => setActionsHeight(el.offsetHeight || 0);
    window.addEventListener('resize', onWin);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
    };
  }, [allProjectImages.length, skillsArr.length]);

  const projectKey = `${project.title}::${project.company}`;

  const openSkillEditor = (skill: Skill, e?: React.MouseEvent) => {
    const target = e?.currentTarget as HTMLElement | undefined;
    // if clicking the same badge that's already open, toggle closed
    if (usagePanelOpen && panelAnchorEl && target && panelAnchorEl === target && panelSkills.length === 1 && panelSkills[0].name === skill.name) {
      setUsagePanelOpen(false);
      setPanelAnchorEl(null);
      setPanelSkills([]);
      setPanelTitle('');
      return;
    }

    setPanelSkills([skill]);
    // show only the skill name (no project title)
    setPanelTitle(`${skill.name}`);
    setPanelAnchorEl(target ?? null);
    setUsagePanelOpen(true);
  };

  const openCategoryEditor = (categoryName: string, skills: Skill[], e?: React.MouseEvent) => {
    const target = e?.currentTarget as HTMLElement | undefined;
    // if clicking the same category badge that's already open, toggle closed
    if (usagePanelOpen && panelAnchorEl && target && panelAnchorEl === target && panelTitle === categoryName) {
      setUsagePanelOpen(false);
      setPanelAnchorEl(null);
      setPanelSkills([]);
      setPanelTitle('');
      return;
    }

    setPanelSkills(skills);
    // show only the category name (no project title)
    setPanelTitle(`${categoryName}`);
    setPanelAnchorEl(target ?? null);
    setUsagePanelOpen(true);
  };

  // Measure logo height and compute global max across all cards. This keeps
  // badges positioned immediately beneath the tallest logo.
  useLayoutEffect(() => {
    const el = logoRef.current;
    if (!el) return;

    const computeHeights = () => {
      // measure this card
      const my = el.offsetHeight || 0;
      setLogoHeight(my);

      // measure all logos in the page and use the tallest
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('.project-logo')) as HTMLElement[];
      const heights = nodes.map((n) => n.offsetHeight || 0);
      const globalMax = heights.length ? Math.max(...heights) : my;
      setMaxLogoHeight(globalMax);

      // also expose as a css variable so it can be inspected in devtools if needed
      try {
        document.documentElement.style.setProperty('--project-logo-max-height', `${globalMax}px`);
      } catch (e) {
        // ignore (defensive)
      }
    };

    // initial
    computeHeights();

    const ro = new ResizeObserver(() => computeHeights());
    ro.observe(el);
    // also observe all other logos so changes elsewhere update our max
    const otherNodes = Array.from(document.querySelectorAll<HTMLElement>('.project-logo')) as HTMLElement[];
    otherNodes.forEach((n) => ro.observe(n));

    const onWin = () => computeHeights();
    window.addEventListener('resize', onWin);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
    };
  }, [allProjectImages.length, skillsArr.length]);

  // Card-level padding applied so all internal content shares the same distance from the border
  // allow a compact variant for use in featured rows so cards can be smaller
  // `compact` comes from the component prop (boolean)
  const logoContainerClass = `relative flex items-center justify-center cursor-pointer w-full ${compact ? 'h-[180px]' : 'h-[350px]'} overflow-hidden`;
  // add horizontal padding so the image is inset from the sides of the top box
  const logoInnerBox = `flex items-center justify-center w-full h-full bg-white flex-shrink-0 overflow-hidden ${compact ? 'px-6' : 'px-[35px]'}`;
  // Use auto width/height with max constraints so small images keep their intrinsic size
  // and are centered by the parent flex container instead of being upscaled.
  const logoImgClass = "block w-auto h-auto max-w-full max-h-full object-contain rounded-md shadow-sm";

  // actionsBottom is the distance (px) from the card bottom where the actions are placed
  const actionsBottom = 20;
  const desiredGap = 20; // minimum gap between description bottom and actions top
  const contentPaddingBottom = actionsHeight + actionsBottom + desiredGap;

  return (
    <div className="h-full flex">

      <Card
        className={`relative z-50 group hover:shadow-2xl transition-all duration-300 border-2 border-purple-800 bg-white overflow-hidden cursor-pointer max-w-full flex flex-col h-full ${compact ? 'min-h-[420px]' : 'min-h-[520px]'} ring-2 ring-purple-400/18 group-hover:ring-6 group-hover:ring-purple-500/30 project-card-frame`}
      >
        {/* Top area: fixed height so the project type badge sits at the same vertical position
            across all cards. The image is centered inside the top box and will leave
            whitespace below if it's smaller, which is expected. */}
        {/* Top area: logo lives here. We add `.project-logo` so all cards can be
            measured and we compute the tallest logo to align badges under it. */}
        <div className="relative w-full">
          <div
            ref={logoRef}
            className={`${logoContainerClass} project-logo`}
            onClick={handleImageClick}
            aria-label={`Open images for ${project.company}`}
            tabIndex={0}
            role="button"
          >
            <div className={logoInnerBox}>
              {companyLogo ? (
                <ImageWithFallback
                  src={companyLogo.src}
                  alt={companyLogo.description || `${project.company} logo`}
                  className={logoImgClass}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md text-sm text-muted-foreground">No Logo</div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-black/28 to-transparent pointer-events-none" />
          </div>

          {/* Badge flows after logo. We add extra top margin equal to the difference
              between the tallest logo and this card's logo so badges line up. */}
          <div className="logo-gap" style={{ ['--logo-gap' as any]: `${Math.max(0, (maxLogoHeight || 0) - (logoHeight || 0) + 8)}px` }}>
            <div className="flex items-center justify-start">
              {project.type === 'internship' ? (
                <Badge variant="default" className="bg-pink-500 text-white border-pink-400 px-3 py-1.5 text-sm md:text-base rounded-full">💼 Internship</Badge>
              ) : project.type === 'job' ? (
                <Badge variant="default" className="!bg-blue-500 !text-white !border-blue-600 px-3 py-1.5 text-sm md:text-base rounded-full">💼 Job</Badge>
              ) : (
                <Badge variant="secondary" className="bg-purple-500 text-white border-purple-400 px-3 py-1.5 text-sm md:text-base rounded-full">🎓 Project</Badge>
              )}
            </div>
          </div>
        </div>

  <CardHeader className="px-0 pb-4 border-b border-gray-200">
          <div className="space-y-2">
            {/* Show project title as the CardTitle */}
            <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">{project.title}</CardTitle>

            {/* Render role using the same small font/size as company and date */}
            <div className="text-sm text-gray-600">{project.role}</div>

            <div className="text-sm text-gray-600">{project.company}</div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{project.duration}</span>
              </div>
            </div>
          </div>
        </CardHeader>

  <CardContent className="px-0 pb-0 flex flex-col flex-grow min-h-0 card-content-padding" style={{ ['--content-padding-bottom' as any]: `${contentPaddingBottom}px` }}>
          {/* Description section */}
          <div className="pb-4 flex-grow">
            <CardDescription className="text-gray-700 leading-relaxed">{project.description}</CardDescription>
          </div>
        </CardContent>

  {/* Bottom actions (skills + media) anchored to the Card bottom. Add fixed bottom padding so distance to card bottom is identical for every card */}
  {/* Bottom actions absolutely positioned to the card bottom so spacing is identical across cards */}
  <div
    ref={actionsRef}
    className={`absolute actions-overlay`}
    style={{ ['--actions-bottom' as any]: `${actionsBottom}px` }}
  >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(() => {
                const grouped: Record<string, Skill[]> = {};
                skillsArr.forEach((s) => {
                  const skillName = s?.name ?? String(s);
                  const cat = getSkillCategory(skillName).name ?? 'Other';
                  if (!grouped[cat]) grouped[cat] = [];
                  if (!grouped[cat].some((x) => x.name === skillName)) grouped[cat].push(s);
                });

                const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

                // categories that should show all individual skill badges
                const showAllIndividually = new Set([
                  'Programming Languages',
                  'Databases & Storage',
                ]);

                // Build two lists: individual skill badges (for selected categories)
                // and grouped category badges (for the rest). Individual badges
                // should appear first, grouped ones afterwards.
                const individualNodes: React.ReactNode[] = [];
                const groupedNodes: React.ReactNode[] = [];

                sortedCategories.forEach((cat) => {
                  const skills = (grouped[cat] || []).slice().sort((a, b) => a.name.localeCompare(b.name));
                  if (skills.length === 0) return;

                  if (showAllIndividually.has(cat)) {
                    skills.forEach((skill) => individualNodes.push(<SkillBadge key={`${cat}::${skill.name}`} skill={skill.name} onClick={(e) => openSkillEditor(skill, e)} />));
                  } else {
                    groupedNodes.push(<CategoryBadge key={cat} categoryName={cat} skills={skills.map((s) => s.name)} onClick={(e) => openCategoryEditor(cat, skills, e)} />);
                  }
                });

                return [...individualNodes, ...groupedNodes];
              })()}
            </div>

            <div className="flex justify-center mt-6 gap-4">
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

              {allProjectImages.length > 0 && (
                <Button variant="outline" className="border-purple-400 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-full shadow flex items-center gap-2" onClick={() => onOpenImages(allProjectImages)} aria-label={`View images for ${project.company}`}>
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
            </div>
          </div>
        </div>
      {usagePanelOpen && (
        <SkillUsagePanel open={usagePanelOpen} title={panelTitle} skills={panelSkills} anchorEl={panelAnchorEl} onClose={() => setUsagePanelOpen(false)} />
      )}

      </Card>
    </div>
  );
}