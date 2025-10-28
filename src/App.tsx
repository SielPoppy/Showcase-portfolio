import React from 'react';
import { Button } from './components/ui/button';
import { Mail, Download } from 'lucide-react';
import ImageModal from './components/ImageModal';
import VideoModal from './components/VideoModal';
import ProjectCard from './components/ProjectCard';
import { SkillLegend } from './components/SkillLegend';
import FloatingEmojis from './components/FloatingEmojis';
import { SideNavbar } from './components/SideNavbar';
import { getSkillCategory } from './components/utils/skillCategories';
import { projects, personalInfo } from './data/projects';
import ImageWithFallback from './components/figma/ImageWithFallback';
import ErrorBoundary from './components/ErrorBoundary';
import { AboutSection } from './components/AboutSection';


const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.849-3.037-1.85 0-2.131 1.445-2.131 2.938v5.668h-3.554V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.369-1.849 3.601 0 4.268 2.371 4.268 5.456v6.284zM5.337 7.433c-1.144 0-2.069-.927-2.069-2.07 0-1.144.925-2.07 2.069-2.07 1.143 0 2.07.926 2.07 2.07 0 1.143-.927 2.07-2.07 2.07zM7.119 20.452H3.554V9h3.565v11.452z" />
  </svg>
);


function Seam({
                  fromColor,
                  toColor,
                  height,
                  blur,
                  placement = 'top',
              }: {
    fromColor: string;
    toColor: string;
    height: number;
    blur: number;
    placement?: 'top' | 'bottom';
}) {
    const isBottom = placement === 'bottom';
    const overlap = Math.round(height * 0.85);
    return (
        <div
            style={{
                height,
                width: '100%',
                pointerEvents: 'none',
                position: 'absolute',
                left: 0,
                right: 0,
                top: isBottom ? 'auto' : -overlap,
                bottom: isBottom ? -overlap : 'auto',
                zIndex: 5,
                background: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`,
                filter: `blur(${blur}px)`,
                boxShadow: '0 30px 60px rgba(0,0,0,0.06)',
                opacity: 1,
                willChange: 'transform',
            }}
        />
    );
}




export default function App() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [video, setVideo] = React.useState<{ url: string; title?: string; description?: React.ReactNode } | null>(null);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [modalImages, setModalImages] = React.useState<any[]>([]);
  const [modalImageIndex, setModalImageIndex] = React.useState(0);

  // Whether any modal is currently open (used to dim the page and block scroll)
  const isModalOpen = (imageModalOpen && modalImages.length > 0) || !!video;

  React.useEffect(() => {
    if (isModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const filteredProjects = selectedCategory
    ? projects.filter((project) => Array.isArray(project.skills) && project.skills.some((skill) => getSkillCategory(skill).name === selectedCategory))
    : projects;

  const handleOpenVideo = (v: { url: string; title?: string; description?: React.ReactNode }) => setVideo(v);
  const handleOpenImages = (images: any[]) => {
    setModalImages(images);
    setModalImageIndex(0);
    setImageModalOpen(true);
  };

  
  const heroColor = 'rgba(243,244,246,1)'; 
  const heroColorTransparent = 'rgba(243,244,246,0.0)';

  
    const projectColor = 'rgba(255,190,230,1)';
    
    const projectColorTransparent = 'rgba(255,190,230,0.08)'; // increased alpha

   const aboutColorTransparent = 'rgba(247,250,252,0.0)';
   const contactTop = 'rgba(0,0,0,0.14)';

   return (
    <ErrorBoundary>
      {/* Main content — dim when a modal is open. Modals are rendered as siblings so
          the dimming filter doesn't affect them. */}
      <div className={`min-h-screen relative z-30 ${isModalOpen ? 'filter brightness-50 transition duration-300' : ''}`}>

        <FloatingEmojis z={-1} />

        <SideNavbar />

        {/* Hero */}
        <section id="hero" className="relative">
          <div className="absolute inset-0" aria-hidden="true" style={{ background: `linear-gradient(180deg, ${heroColor} 0%, ${heroColorTransparent} 55%)`, zIndex: -100 }} />
          <div className="relative z-20 pt-20 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ring-2 ring-white/75 shadow-sm" />
                {personalInfo.status}
              </div>

              <div className="flex justify-center mt-2">
                <div className="rounded-full bg-gray-200 overflow-hidden" style={{ width: 360, height: 360 }}>
                  <ImageWithFallback src="/images/personal/Youri.png" alt={`${personalInfo.name} photo`} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-purple-900 to-pink-900 bg-clip-text text-transparent">{personalInfo.name}</h1>
                <p className="text-xl md:text-2xl text-black font-medium">{personalInfo.title}</p>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">{personalInfo.subtitle}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <div className="flex flex-col leading-tight">
                    <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>
                    <a href={`mailto:${personalInfo.secondaryEmail}`} className="text-sm opacity-90 underline">{personalInfo.secondaryEmail}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
            <span className="text-lg">📞</span>
            <a href={`tel:${personalInfo.phone}`} className="underline">{personalInfo.phone}</a>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a href="/document/Resume.pdf" download="Resume.pdf" className="inline-block">
                  <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/youri-van-baal-114198332/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-[#0077B5] text-white"><LinkedInIcon className="w-4 h-4 mr-2" />LinkedIn</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="relative">
          {/* Background under Projects: fade project pastel into white at the bottom so Projects->About is smooth */}
          <div className="absolute inset-0" aria-hidden style={{ background: `linear-gradient(180deg, ${projectColorTransparent} 0%, ${projectColor} 10%, ${projectColor} 80%, rgba(255,255,255,1) 95%)`, zIndex: -10 }} />
          <div className="relative z-40 pb-32 px-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div style={{ height: '12rem' }} />
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Experience & Projects</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">Real-world experience gained through internships and collaborative projects with industry leaders</p>
              </div>
              <div className="flex justify-center">
                <div className="max-w-4xl w-full">
                  <SkillLegend selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
                </div>
              </div>

              {selectedCategory && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                    Showing projects with <strong>{selectedCategory}</strong>
                    <button onClick={() => setSelectedCategory(null)} className="ml-2 text-purple-600 hover:text-purple-800 font-bold">✕</button>
                  </div>
                </div>
              )}

              {filteredProjects.length === 0 && selectedCategory ? (
                <div className="text-center py-8">No projects found with the selected skill category.</div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                    {filteredProjects.map((project, idx) => (
                      <div key={idx} className="w-full max-w-md mx-auto">
                        <ProjectCard project={project} onOpenVideo={handleOpenVideo} onOpenImages={handleOpenImages} />
                      </div>
                    ))}
                  </div>

                  {/* Spacer: push the gradient transition below the project cards */}
                  <div style={{ height: '20rem' }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Inline seam between Projects and About: painted as a DOM sibling to avoid stacking-context clipping */}


        {/* Use the dedicated AboutSection component which includes hobby badges and responsive layout */}
        <AboutSection />

  <Seam fromColor={`${aboutColorTransparent}`} toColor={`${contactTop}`} height={120} blur={36} />
  <section id="contact" className="relative z-20 pt-32 pb-64 px-6 bg-gradient-to-r from-black via-purple-900 to-pink-900">
          <div className="max-w-5xl mx-auto text-center space-y-16 text-white">
            <div className="pt-12 pb-12 mb-20">
              <br />
              <h2 className="text-5xl font-bold">Ready to Contribute</h2>

              <p className="text-2xl opacity-95 mt-8">I'm actively seeking internship opportunities where I can apply my skills and contribute to meaningful projects.</p>

              <br />
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-12 w-full mt-20">
              <div className="text-base opacity-95 text-white text-left w-full max-w-2xl space-y-6">
                <div>
                  <a href={`mailto:${personalInfo.email}`} aria-label={`Email ${personalInfo.email}`} className="inline-block">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 inline-flex items-center px-6 py-3">
                      <Mail className="w-4 h-4 mr-2" />{personalInfo.email}
                    </Button>
                  </a>
                </div>
                {personalInfo.secondaryEmail && (
                  <div>
                    <a href={`mailto:${personalInfo.secondaryEmail}`} aria-label={`Email ${personalInfo.secondaryEmail}`} className="inline-block">
                      <Button size="lg" className="bg-white text-black hover:bg-gray-100 inline-flex items-center px-6 py-3">
                        <Mail className="w-4 h-4 mr-2" />{personalInfo.secondaryEmail}
                      </Button>
                    </a>
                  </div>
                )}

                <div className="flex justify-center">
                  <a href={`tel:${personalInfo.phone}`} aria-label={`Call ${personalInfo.phone}`}>
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 inline-flex items-center px-6 py-3">
                      <span className="text-lg mr-2">📞</span>
                      {personalInfo.phone}
                    </Button>
                  </a>
                </div>

                <div className="flex justify-center">
                  <a href="https://www.linkedin.com/in/youri-van-baal-114198332/" target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn">
                    <Button size="lg" className="bg-[#0077B5] text-white inline-flex items-center px-6 py-3">
                      <LinkedInIcon className="w-4 h-4 mr-2" />LinkedIn
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <br />
          </div>
        </section>

        <footer className="relative z-20 py-8 px-6 border-t border-gray-300 bg-white/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-700">© 2025 {personalInfo.name}. Built with React, TypeScript, and Vite.</p>
          </div>
        </footer>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 pointer-events-none" aria-hidden />
      )}

      {/* Render modals outside the dimmed content so they remain bright and clickable */}
      {imageModalOpen && modalImages.length > 0 && (
        <ImageModal
          images={modalImages}
          index={modalImageIndex}
          onClose={() => setImageModalOpen(false)}
          onPrev={() => setModalImageIndex((i) => Math.max(0, i - 1))}
          onNext={() => setModalImageIndex((i) => Math.min(modalImages.length - 1, i + 1))}
        />
      )}

      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
    </ErrorBoundary>
  );
}
