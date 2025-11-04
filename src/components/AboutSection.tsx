import hobbyImagesManifestData from '../data/hobbyImagesManifest.json';

// Add type for manifest with index signature
type HobbyImagesManifest = {
  [slug: string]: { url: string; title: string }[];
};
const hobbyImagesManifest: HobbyImagesManifest = hobbyImagesManifestData;
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Badge } from './ui/badge';
import { CardContent } from './ui/card';
import { Globe, Gamepad2, Dumbbell, Home, BookOpen } from 'lucide-react';
import { useIsMobile } from './ui/use-mobile';

interface Hobby {
  name: string;
  icon: React.ReactNode;
  description: string;
  skills: string[];
  color: string;
}

const hobbies: Hobby[] = [
  {
    name: "Geography",
    icon: <Globe className="w-6 h-6" />,
    description: "Fascinated by world cultures, maps, and geopolitical dynamics. One of my main concerns that I try to work on is climate change and how people can lessen their carbon footprint.",
    skills: ["Data Visualization", "Weather systems and predictions", "Analytics", "Research"],
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-6 h-6" />,
    description: "I play all kinds of games, from competitive shooters to expansive RPGs.",
    skills: ["Strategic Thinking", "Team Coordination", "Performance Optimization", "User Experience"],
    color: "bg-green-100 text-green-800 border-green-300"
  },
  {
    name: "Fitness",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Originally meant as a way to lose weight, fitness has become a core part of my life that teaches me discipline and perseverance.",
    skills: ["Discipline", "Goal Setting", "Time Management", "Persistence"],
    color: "bg-red-100 text-red-800 border-red-300"
  },
  {
    name: "Smart Home",
    icon: <Home className="w-6 h-6" />,
    description: "Originally meant as gift to help my mom, I have slowly been building up my home to be a smart home for various conveniences that make the lives of my mom and myself easier." +
        "My plan for later on is to create my own devices to make even more things automated and easier to use.",
    skills: ["IoT Integration", "Automation", "Network Setup", "Hardware Integration"],
    /* Switch to teal tones for better contrast on the new purple About background */
    color: "bg-teal-100 text-teal-800 border-teal-300"
  },
  {
    name: "Education",
    icon: <BookOpen className="w-6 h-6" />,
    description: "I have a passion for education and everything around it, I have done multiple internships teaching Geography in the past but while that study didn't fit me I do like the field as a whole and enjoy teaching people things.",
    skills: ["Teaching", "Curriculum design", "Continuous learning", "Mentorship"],
    color: "bg-yellow-100 text-yellow-800 border-yellow-300"
  }
];

export function AboutSection() {
  const [activeHobby, setActiveHobby] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const wrappersRef = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  // Auto-rotating hobby images state
  const [currentImageHobbyIndex, setCurrentImageHobbyIndex] = useState<number>(0);
  const [rotationPaused, setRotationPaused] = useState<boolean>(false);
  const resumeTimerRef = useRef<number | null>(null);

  
  const [columns, setColumns] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth >= 600 ? 2 : 1;
  });

  useEffect(() => {
    function onResize() {
      setColumns(window.innerWidth >= 600 ? 2 : 1);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (activeHobby === null) return;
      const wrapper = wrappersRef.current[activeHobby];
      if (!wrapper) return;
      if (!wrapper.contains(e.target as Node)) {
        setActiveHobby(null);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeHobby]);

  // Measure all badge wrapper widths and keep the maximum so all badges can be set to the same width
  useEffect(() => {
    function measure() {
      try {
        const widths = wrappersRef.current.map((el) => (el ? el.offsetWidth : 0));
        const max = widths.length ? Math.max(...widths) : 0;
        if (max && max !== measuredWidth) {
          setMeasuredWidth(max);
        }
      } catch (err) {
        // ignore measurement errors for now
      }
    }

    // measure on next tick to allow layout to settle
    const id = window.setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', measure);
    };
  }, [columns, hobbies.length, measuredWidth]);

  // Resolve hobby folder slug (matches public/images/personal/hobbies/<slug>)
  const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Use import.meta.globEager with '../public/images/personal/hobbies/**/*' for Vite public assets. Rewrite to /images/ for public serving.
  const hobbyImagesMap = useMemo(() => hobbyImagesManifest, []);

  const hobbySlugs = useMemo(() => hobbies.map((h) => slugify(h.name)), []);
  const availableImageSlugs = useMemo(
    () => hobbySlugs.filter((slug) => (hobbyImagesMap[slug]?.length ?? 0) > 0),
    [hobbySlugs, hobbyImagesMap]
  );

  // Keep current index within bounds and auto-rotate every 5s
  useEffect(() => {
    if (availableImageSlugs.length === 0) return;
    if (rotationPaused) return;
    // Reset to first available when set changes
    setCurrentImageHobbyIndex((idx) => (idx >= availableImageSlugs.length ? 0 : idx));
    const id = window.setInterval(() => {
      setCurrentImageHobbyIndex((prev) => (prev + 1) % availableImageSlugs.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [availableImageSlugs, rotationPaused]);

  // Clear any pending resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };
  }, []);

  
  const renderBadge = (index: number) => {
    const hobby = hobbies[index];
    if (!hobby) return null;
    const slug = slugify(hobby.name);
    const isImagesActive = availableImageSlugs[currentImageHobbyIndex] === slug;
  const imagesForThis = hobbyImagesMap[slug] || [];
    const positions = ['tl', 'bl', 'tr', 'br'] as const;
    const imagesToShow = imagesForThis.slice(0, 4);

    return (
      <div
        key={index}
        className="hobby-wrap"
        ref={(el) => { wrappersRef.current[index] = el }}
        style={measuredWidth ? (columns === 1 ? { width: `${measuredWidth}px`, margin: '0 auto' } : { width: `${measuredWidth}px` }) : undefined}
      >
        <Badge
          asChild
          className={`${hobby.color} border cursor-pointer hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 h-14 md:h-16 leading-none text-lg md:text-xl font-semibold w-full [&>svg]:size-5 md:[&>svg]:size-6 ${isImagesActive ? 'glow-active' : ''}`}
          onClick={() => {
            setActiveHobby(activeHobby === index ? null : index);
            const imgIdx = availableImageSlugs.indexOf(slug);
            if (imgIdx >= 0) setCurrentImageHobbyIndex(imgIdx);
            // Pause rotation for a bit when user explicitly picks a hobby
            setRotationPaused(true);
            if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = window.setTimeout(() => setRotationPaused(false), 8000);
          }}
        >
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3"
            style={{ height: '4.25rem' }}
          >
            {hobby.icon}
            {hobby.name}
          </button>
        </Badge>

        {activeHobby === index && (
          <div className={`z-50 ${isMobile ? 'hobby-popover-mobile' : 'hobby-popover-desktop'}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                {hobby.icon}
                <h3 className="font-semibold text-black text-xl">{hobby.name}</h3>
                {isMobile && (
                  <button
                    className="about-close"
                    onClick={() => setActiveHobby(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-base text-gray-700 leading-relaxed">{hobby.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Transferable Skills</p>
                <div className="flex flex-wrap gap-2">
                  {hobby.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="about" className="about-section">
      {/* Background layer: start solid white so the seam that ends in solid white blends seamlessly,
          then transition to the pale off-white used in the rest of the section. */}
      <div className="about-overlay" aria-hidden />

      {/* Content: above emojis */}
      <div className="about-container">
  {/* Top spacer to guarantee a visible gap between the section top and the first text */}
        <div aria-hidden={true} className="about-top-spacer" />
        <div className="max-w-screen-2xl mx-auto space-y-8">
          <div className="about-header">
            <h2 className="about-title">
              About Me
            </h2>
            <p className="about-subtitle">
              Beyond coding, I have other hobbies and interests that might make me the right fit for your company/team.
            </p>
          </div>
          {/* The images are now shown as floating polaroids around the active hobby buttons */}
          
          <div className="about-grid-wrap">
            <div
              id="about-grid"
              className="about-grid-base"
              style={{
                display: 'grid',
                /* For desktop, use auto-sized columns so badges hug their content; use a tiny gap between them */
                gridTemplateColumns: columns === 2 ? (measuredWidth ? `${measuredWidth}px ${measuredWidth}px` : 'auto auto') : '1fr',
                columnGap: columns === 2 ? '12px' : '0',
                rowGap: columns === 2 ? '3.25rem' : '2.5rem',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                // Always center the grid so single-column/mobile items are centered as well
                justifyContent: 'center',
                // Slightly smaller explicit bottom padding to ensure a bit less space below the last badge
                paddingBottom: '1rem'
              }}
            >
              {/* Render each hobby into a grid cell. For two-column layouts we align left/right cells toward the center. */}
              {hobbies.map((_, idx) => {
                const isLastAndOdd = columns === 2 && idx === hobbies.length - 1 && hobbies.length % 2 === 1;
                const positionClass = columns === 2 ? (isLastAndOdd ? 'center' : (idx % 2 === 0 ? 'start' : 'end')) : 'center';

                return (
                  <div key={idx} className={`about-cell ${positionClass}`}>
                    {renderBadge(idx)}
                  </div>
                );
              })}

              {/* Desktop-only side polaroids positioned relative to the grid container */}
              {availableImageSlugs.length > 0 && (
                <div className="polaroid-overlay" aria-hidden>
                  {(() => {
                    const slug = availableImageSlugs[currentImageHobbyIndex];
                    const imgs = (hobbyImagesMap[slug] || []).slice(0, 4);
                    const fig = (img: { url: string; title: string }, key: string, side: 'left' | 'right', vert: 'top' | 'bottom', i: number) => (
                      <figure
                        key={key}
                        className={`about-polaroid ${side} ${vert}`}
                        style={{ ['--rotate' as any]: `${((i % 5) - 2) * 1.2}deg` }}
                      >
                        <img src={img.url} alt={img.title} loading="lazy" />
                        <figcaption>{img.title}</figcaption>
                      </figure>
                    );
                    return (
                      <>
                        {imgs[0] && fig(imgs[0], `${imgs[0].url}-lt`, 'left', 'top', 0)}
                        {imgs[1] && fig(imgs[1], `${imgs[1].url}-lb`, 'left', 'bottom', 1)}
                        {imgs[2] && fig(imgs[2], `${imgs[2].url}-rt`, 'right', 'top', 2)}
                        {imgs[3] && fig(imgs[3], `${imgs[3].url}-rb`, 'right', 'bottom', 3)}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
          {/* Extra spacer to increase vertical gap between the final hobby badge and the next section */}
          <div aria-hidden={true} className="about-bottom-spacer" />
        </div>
      </div>
    </section>
  );
}
