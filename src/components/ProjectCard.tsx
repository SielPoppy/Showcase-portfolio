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

  // Build the array of non-logo images (used for the "View Images" action)
  const allProjectImages = [...(project.projectImages || []), ...(project.images || [])].filter((img: any) => !img.src?.includes('/images/companies/'));

  // Company logo (the only image we render in the top box now)
  const companyLogo = (project.images || []).find((img: any) => img.src?.includes('/images/companies/')) || null;

  // When the top box is clicked: prefer opening images, otherwise fallback to video
  const handleImageClick = () => {
    if (allProjectImages.length > 0) {
      onOpenImages(allProjectImages);
    } else if (project.videoId) {
      onOpenVideo({ url: `https://www.youtube.com/embed/${project.videoId}`, title: project.company, description: project.description });
    }
  };

  const logoContainerClass = "relative bg-white flex items-center justify-center cursor-pointer w-full h-[350px] overflow-hidden";
  const logoInnerBox = "flex items-center justify-center w-full h-full p-3 bg-white flex-shrink-0 overflow-hidden";
  // Use auto width/height with max constraints so small images keep their intrinsic size
  // and are centered by the parent flex container instead of being upscaled.
  const logoImgClass = "block w-auto h-auto max-w-full max-h-full object-contain rounded-md shadow-sm";

  return (
    <div>

      <Card className="relative z-50 group hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 bg-white hover:border-pink-300 overflow-hidden cursor-pointer max-w-full">
        <div
          className={logoContainerClass}
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

        {/* Badge row: moved below the image (above the role) and slightly larger */}
        <div className="px-4 pt-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
