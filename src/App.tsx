import React from 'react';
import Portal from './components/Portal';
import { Button } from './components/ui/button';
import FeaturedProjects from './components/FeaturedProjects';
import { Mail, Download } from 'lucide-react';
import ImageModal from './components/ImageModal';
import VideoModal from './components/VideoModal';
import FloatingEmojis from './components/FloatingEmojis';
import { SideNavbar } from './components/SideNavbar';
import { getSkillCategory, skillCategories } from './components/utils/skillCategories';
import { projects, personalInfo } from './data/projects';
import ImageWithFallback from './components/figma/ImageWithFallback';
import ErrorBoundary from './components/ErrorBoundary';
import { AboutSection } from './components/AboutSection';


const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.849-3.037-1.85 0-2.131 1.445-2.131 2.938v5.668h-3.554V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.369-1.849 3.601 0 4.268 2.371 4.268 5.456v6.284zM5.337 7.433c-1.144 0-2.069-.927-2.069-2.07 0-1.144.925-2.07 2.069-2.07 1.143 0 2.07.926 2.07 2.07 0 1.143-.927 2.07-2.07 2.07zM7.119 20.452H3.554V9h3.565v11.452z" />
  </svg>
);


// Decorative seam removed; About now flows directly into Contact




export default function App() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);
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
    ? projects.filter((project) => Array.isArray(project.skills) && project.skills.some((skill: any) => getSkillCategory((skill && skill.name) ? skill.name : String(skill)).name === selectedCategory))
    : projects;

  // If a skill is selected, override to filter by skill name
  const fullyFilteredProjects = selectedSkill
    ? projects.filter((project) => Array.isArray(project.skills) && project.skills.some((skill: any) => {
        const name = (skill && skill.name) ? skill.name : String(skill);
        return name === selectedSkill;
      }))
    : filteredProjects;

  const activeCategoryObj = selectedSkill
    ? getSkillCategory(selectedSkill)
    : selectedCategory
    ? (skillCategories as any)[selectedCategory as keyof typeof skillCategories]
    : null;

  const badgeBg = activeCategoryObj ? activeCategoryObj.bgColor : 'bg-purple-100';
  const badgeColor = activeCategoryObj ? activeCategoryObj.color : 'text-purple-800';
  const badgeBorder = activeCategoryObj ? activeCategoryObj.borderColor : 'border-purple-200';
  const badgeRing = activeCategoryObj ? `${activeCategoryObj.borderColor.replace('border-', 'ring-')} ring-offset-2 ring-2` : 'ring-purple-500 ring-offset-2 ring-2';

  const handleOpenVideo = (v: { url: string; title?: string; description?: React.ReactNode }) => setVideo(v);
  const handleOpenImages = (images: any[]) => {
    setModalImages(images);
    setModalImageIndex(0);
    setImageModalOpen(true);
  };


  // Colors and decorative seams moved to CSS classes

   return (
    <ErrorBoundary>
      {/* Main content — dim when a modal is open. Modals are rendered as siblings so
          the dimming filter doesn't affect them. */}
  <div className={`app-shell`}>
  {/* Layer host for floating emojis so they sit above section backgrounds but below content */}
  <div id="emoji-root" aria-hidden />
  {/* Render emojis inside the app shell (between backgrounds and content). We avoid filter issues by not using page-dim. */}
  <FloatingEmojis z={10} containerId="emoji-root" />

        <SideNavbar />

        {/* Hero */}
        <section id="hero" className="hero-section">
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-container">
            <div className="hero-inner">
              <div className="status-pill">
                <div className="status-dot" />
                {personalInfo.status}
              </div>

              <div className="flex justify-center mt-2">
                <div className="avatar-hero">
                  <ImageWithFallback src="/images/personal/Youri.webp" alt={`${personalInfo.name} photo`} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="hero-name">{personalInfo.name}</h1>
                <p className="hero-title">{personalInfo.title}</p>
              </div>

              <div className="cta-row text-gray-700">
                <div className="cta-group">
                  <a href={`mailto:${personalInfo.email}`} aria-label={`Email ${personalInfo.email}`} className="inline-block">
                    <Button size="lg" className="btn-email">
                      <Mail className="w-4 h-4 mr-2" />{personalInfo.email}
                    </Button>
                  </a>

                  {personalInfo.secondaryEmail && (
                    <a href={`mailto:${personalInfo.secondaryEmail}`} aria-label={`Email ${personalInfo.secondaryEmail}`} className="inline-block">
                      <Button size="lg" className="btn-email">
                        <Mail className="w-4 h-4 mr-2" />{personalInfo.secondaryEmail}
                      </Button>
                    </a>
                  )}
                </div>

                <div className="phone-group">
                  <a href={`tel:${personalInfo.phone}`} aria-label={`Call ${personalInfo.phone}`} className="inline-block">
                    <Button size="lg" className="btn-phone">
                      <span className="text-lg mr-2">📞</span>
                      {personalInfo.phone}
                    </Button>
                  </a>
                </div>
              </div>

              <div className="cta-row mb-0">
                <a href="/document/Resume.pdf" download="Resume.pdf" className="inline-block">
                  <Button size="lg" className="btn-resume">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/youri-van-baal-114198332/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-linkedin"><LinkedInIcon className="w-4 h-4 mr-2" />LinkedIn</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

  {/* Featured Projects (uses featured IDs in data/projects.ts) */}
  <section id="projects" className="projects-section">
    <FeaturedProjects onOpenVideo={handleOpenVideo} onOpenImages={handleOpenImages} />
  </section>

  {/* Projects carousel always visible below featured projects */}


  {/* Use the dedicated AboutSection component which includes hobby badges and responsive layout */}
  <AboutSection />

  <section id="contact" className="contact-section">
          <div className="contact-inner">
            <div className="pt-12 pb-6 mb-0">
              <h2 className="section-title">Invite me over for a coffee ☕</h2>

              <p className="section-subtitle">I'm actively seeking internship opportunities where I can apply my skills and contribute to meaningful projects. Contact me to discuss potential collaborations!</p>
            </div>
              <div className="contact-grid">
              <div className="contact-left">
                {/* Emails side-by-side and centered */}
                <div className="cta-row">
                  <a href={`mailto:${personalInfo.email}`} aria-label={`Email ${personalInfo.email}`} className="inline-block">
                    <Button size="lg" className="btn-email">
                      <Mail className="w-4 h-4 mr-2" />{personalInfo.email}
                    </Button>
                  </a>
                  {personalInfo.secondaryEmail && (
                    <a href={`mailto:${personalInfo.secondaryEmail}`} aria-label={`Email ${personalInfo.secondaryEmail}`} className="inline-block">
                      <Button size="lg" className="btn-email">
                        <Mail className="w-4 h-4 mr-2" />{personalInfo.secondaryEmail}
                      </Button>
                    </a>
                  )}
                </div>

                <div className="center-wrap">
                  <a href={`tel:${personalInfo.phone}`} aria-label={`Call ${personalInfo.phone}`}>
                    <Button size="lg" className="btn-phone">
                      <span className="text-lg mr-2">📞</span>
                      {personalInfo.phone}
                    </Button>
                  </a>
                </div>

                <div className="center-wrap">
                  <a href="https://www.linkedin.com/in/youri-van-baal-114198332/" target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn">
                    <Button size="lg" className="btn-linkedin">
                      <LinkedInIcon className="w-4 h-4 mr-2" />LinkedIn
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <br />
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-text">© 2025 {personalInfo.name}. Built with React, TypeScript, and Vite.</p>
          </div>
        </footer>
      </div>

      {isModalOpen && (
        // Keep the dim overlay in the same portal root as modals to ensure consistent stacking and lifecycle
        <Portal containerId="app-modal-root"><div className="modal-dim" aria-hidden /></Portal>
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
  {/* Projects carousel is rendered inline above — no modal here */}
    </ErrorBoundary>
  );
}
