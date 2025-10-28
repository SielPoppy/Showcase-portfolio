import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SkillBadge } from './SkillBadge';
import { getSkillCategory } from './utils/skillCategories';
import type { Project } from '../data/projects';

type Props = {
  project: Project;
  onOpenVideo: (video: { url: string; title?: string; description?: React.ReactNode }) => void;
  onOpenImages: (images: any[]) => void;
  // allow optional React `key` to satisfy JSX usage without changing runtime behavior
  key?: React.Key;
};

export default function ProjectCard({ project, onOpenVideo, onOpenImages }: Props) {
  // defensive: ensure skills is always an array to avoid runtime errors
  const skillsArr: string[] = Array.isArray(project.skills) ? project.skills : [];
  const isShowcase = (src: string) => src.includes('/images/projects/showcase');
  const nonLogoImagesFromImages = (project.images || []).filter((img: any) => !img.src.includes('/images/companies/'));
  const allProjectImages = (project.projectImages || []).concat(nonLogoImagesFromImages);
  const showcaseImagesArr = allProjectImages.filter((img: any) => isShowcase(img.src));
  const nonShowcaseImages = allProjectImages.filter((img: any) => !isShowcase(img.src));
  const showcaseImage = showcaseImagesArr.length > 0 ? showcaseImagesArr[0] : null;

  const handleImageClick = () => {
    const combined = [...showcaseImagesArr, ...nonShowcaseImages];
    if (combined.length > 0) {
      onOpenImages(combined);
    } else if (project.videoId) {
      onOpenVideo({ url: `https://www.youtube.com/embed/${project.videoId}`, title: project.company, description: project.description });
    }
  };

  const hasShowcase = Boolean(showcaseImage);
  const isYookrIntern = project.company === 'Yookr' && project.type === 'internship';
  // company-specific tweaks: make BDO and Fontys logos larger and their inline showcase images a bit smaller
  const isBdo = project.company === 'BDO';
  const isFontys = project.company === 'Fontys';
  const isLargeLogo = isBdo || isFontys;
  // logo classes: Yookr-intern keeps its larger logo; BDO/Fontys get a medium-large logo; others keep the small default
  const logoClass = isYookrIntern
    ? "h-20 md:h-24 w-auto object-contain rounded-md shadow-sm"
    : isLargeLogo
    ? "h-12 md:h-20 w-auto object-contain rounded-md shadow-sm"
    : "h-8 w-auto object-contain rounded-md shadow-sm";
  // non-showcase logo (used when there's no showcase image) — make BDO/Fontys noticeably larger here too
  const logoClassNonShowcase = isLargeLogo ? "h-16 w-auto object-contain rounded-md shadow-sm" : "h-12 w-auto object-contain rounded-md shadow-sm";
  
  const defaultImageClass = isYookrIntern ? "max-h-[12rem] w-full object-contain rounded-md shadow-md" : "max-h-[14rem] w-full object-cover rounded-md shadow-md";
  const smallImageClass = "max-h-[11rem] w-full object-cover rounded-md shadow-md";
  const companyLogo = project.images?.find((img: any) => img.src.includes('/images/companies/')) || null;

  return (
    <div>

      <Card className="relative z-50 group hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 bg-white hover:border-pink-300 overflow-hidden cursor-pointer max-w-full">
        {hasShowcase ? (
          
          <div
            className={isYookrIntern ? "aspect-[4/3] relative overflow-hidden bg-white flex flex-row items-stretch cursor-pointer" : "aspect-[4/3] relative overflow-hidden bg-white flex flex-col md:flex-row items-stretch cursor-pointer"}
            onClick={handleImageClick}
            aria-label={`Open images for ${project.company}`}
            tabIndex={0}
            role="button"
          >
            <div className={isYookrIntern ? "w-full md:w-1/5 flex items-center justify-center p-4 bg-white border-r border-border" : "w-full md:w-1/5 flex items-center justify-center p-3 bg-white border-r border-border"}>
              {companyLogo ? (
                <ImageWithFallback src={companyLogo.src} alt={companyLogo.description || `${project.company} logo`} className={logoClass} />
              ) : (
                <div className={isYookrIntern ? "h-20 w-20 bg-gray-200 flex items-center justify-center rounded-md text-sm text-muted-foreground" : isLargeLogo ? "h-12 w-12 bg-gray-200 flex items-center justify-center rounded-md text-sm text-muted-foreground" : "h-8 w-8 bg-gray-200 flex items-center justify-center rounded-md text-sm text-muted-foreground"}>No Logo</div>
              )}
            </div>

            <div className={isYookrIntern ? "w-full md:w-4/5 flex items-start justify-center p-2 bg-gray-50" : "w-full md:w-4/5 flex items-center justify-center p-2 bg-gray-50"}>

              <ImageWithFallback src={showcaseImage!.src} alt={showcaseImage!.description || `${project.company} image`} className={isBdo || isFontys ? smallImageClass : defaultImageClass} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-black/28 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"></div>
                {project.type === 'internship' ? (
                  <Badge variant="default" className="bg-pink-500 text-white border-pink-400">💼 Internship</Badge>
                ) : project.type === 'job' ? (
                  <Badge variant="default" className="bg-green-600 text-black border-green-500">💼 Job</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-purple-500 text-white border-purple-400">🎓 Project</Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-white" onClick={handleImageClick} aria-label={project.videoId ? `Open video for ${project.company}` : 'Open images'} tabIndex={0} role={project.videoId ? 'button' : undefined}>
            {companyLogo ? (
              <ImageWithFallback src={companyLogo.src} alt={companyLogo.description || `${project.company} logo`} className={logoClassNonShowcase} />
            ) : (
              <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-md text-sm text-muted-foreground">No Logo</div>
            )}

            {/* Show type badge for projects without showcase images */}
            <div className="mt-3">
              {project.type === 'internship' ? (
                <Badge variant="default" className="bg-pink-500 text-white border-pink-400">💼 Internship</Badge>
              ) : project.type === 'job' ? (
                <Badge variant="default" className="bg-green-600 text-black border-green-500">💼 Job</Badge>
              ) : (
                <Badge variant="secondary" className="bg-purple-500 text-white border-purple-400">🎓 Project</Badge>
              )}
            </div>
          </div>
        )}

        <CardHeader className="pb-4 border-b border-gray-200">
          <div className="space-y-2">
            <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">{project.role}</CardTitle>
            <div className="text-sm text-gray-600">{project.company}</div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{project.duration}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Description section */}
          <div className="pb-4">
            <CardDescription className="text-gray-700 leading-relaxed">{project.description}</CardDescription>
          </div>

          {/* Divider between description and skills/actions */}
          <div className="mt-4 border-t border-gray-200 pt-12">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mt-4">
                {(() => {
                  const grouped: Record<string, string[]> = {};
                  skillsArr.forEach((s) => {
                    const cat = getSkillCategory(s).name ?? 'Other';
                    if (!grouped[cat]) grouped[cat] = [];
                    if (!grouped[cat].includes(s)) grouped[cat].push(s);
                  });

                  const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
                  const orderedSkills: string[] = [];
                  sortedCategories.forEach((cat) => {
                    const skills = grouped[cat].slice().sort((a, b) => a.localeCompare(b));
                    orderedSkills.push(...skills);
                  });

                  return orderedSkills.map((skill) => <SkillBadge key={skill} skill={skill} />);
                })()}
              </div>

              <div className="flex justify-center mt-6 gap-4">
                {project.videoId && (
                  <Button variant="outline" className="border-purple-400 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-full shadow flex items-center gap-2" onClick={() => onOpenVideo({ url: `https://www.youtube.com/embed/${project.videoId}`, title: project.company, description: project.description })} aria-label={`View video for ${project.company}`}>
                    <span className="inline-flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink-600">
                        <path d="M6.5 5.5v13l12-6.5-12-6.5z" />
                      </svg>
                    </span>
                    View Video
                  </Button>
                )}

                {allProjectImages.length > 0 && (
                  <Button variant="outline" className="border-purple-400 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-full shadow flex items-center gap-2" onClick={() => onOpenImages([...showcaseImagesArr, ...nonShowcaseImages])} aria-label={`View images for ${project.company}`}>
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
        </CardContent>
      </Card>
    </div>
  );
}
