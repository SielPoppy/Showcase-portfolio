import React, { useState, useRef, useEffect } from 'react';
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
    icon: <Globe className="w-4 h-4" />,
    description: "Fascinated by world cultures, maps, and geopolitical dynamics. One of my main concerns that I try to work on is climate change and how people can lessen their carbon footprint.",
    skills: ["Data Visualization", "Weather systems and predictions", "Analytics", "Research"],
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-4 h-4" />,
    description: "I play all kinds of games, from competitive shooters to expansive RPGs.",
    skills: ["Strategic Thinking", "Team Coordination", "Performance Optimization", "User Experience"],
    color: "bg-green-100 text-green-800 border-green-300"
  },
  {
    name: "Fitness",
    icon: <Dumbbell className="w-4 h-4" />,
    description: "Originally meant as a way to lose weight, fitness has become a core part of my life that teaches me discipline and perseverance.",
    skills: ["Discipline", "Goal Setting", "Time Management", "Persistence"],
    color: "bg-red-100 text-red-800 border-red-300"
  },
  {
    name: "Smart Home",
    icon: <Home className="w-4 h-4" />,
    description: "Originally meant as gift to help my mom, I have slowly been building up my home to be a smart home for various conveniences that make the lives of my mom and myself easier." +
        "My plan for later on is to create my own devices to make even more things automated and easier to use.",
    skills: ["IoT Integration", "Automation", "Network Setup", "Hardware Integration"],
    color: "bg-purple-100 text-purple-800 border-purple-300"
  },
  {
    name: "Education",
    icon: <BookOpen className="w-4 h-4" />,
    description: "Lifelong learner — I enjoy following courses, reading research papers, and mentoring others to help them grow.",
    skills: ["Teaching", "Curriculum design", "Continuous learning", "Mentorship"],
    color: "bg-yellow-100 text-yellow-800 border-yellow-300"
  }
];

export function AboutSection() {
  const [activeHobby, setActiveHobby] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const wrappersRef = useRef<Array<HTMLDivElement | null>>([]);

  
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

  
  const renderBadge = (index: number) => {
    const hobby = hobbies[index];
    if (!hobby) return null;

    return (
      <div key={index} className="relative w-max mb-12 md:mb-0 shrink-0" ref={(el) => (wrappersRef.current[index] = el)}>
        <Badge
          className={`${hobby.color} border cursor-pointer hover:scale-105 transition-all duration-200 flex items-center gap-3 px-4 py-3 text-base font-medium`}
          onClick={() => setActiveHobby(activeHobby === index ? null : index)}
        >
          {hobby.icon}
          {hobby.name}
        </Badge>

        {activeHobby === index && (
          <div
            className="z-50"
            style={isMobile
              ? {
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90vw',
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(6px)',
                }
              : {
                  position: 'absolute',
                  bottom: 'calc(100% + 0.5rem)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20rem',
                  maxWidth: '20rem',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(6px)',
                }
            }
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                {hobby.icon}
                <h3 className="font-semibold text-black">{hobby.name}</h3>
                {isMobile && (
                  <button
                    className="ml-auto text-gray-500 hover:text-black text-lg font-bold"
                    onClick={() => setActiveHobby(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{hobby.description}</p>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Transferable Skills</p>
                <div className="flex flex-wrap gap-1">
                  {hobby.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">{skill}</Badge>
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
    <section
      id="about"
      className="relative"
      style={{ paddingTop: '1.5rem', paddingBottom: '0.75rem' }}
    >
      {/* Background layer: start solid white so the seam that ends in solid white blends seamlessly,
          then transition to the pale off-white used in the rest of the section. */}
      <div className="absolute inset-0" aria-hidden style={{ background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(247,250,252,1) 100%)', zIndex: -100 }} />

      {/* Content: above emojis */}
      <div className="relative z-20 px-6 min-h-[70vh] mb-12 md:mb-20">
        {/* Top spacer to guarantee a visible gap between the section top and the first text */}
        <div aria-hidden="true" style={{ height: '1.5rem', minHeight: '1.5rem' }} />
        <div className="max-w-screen-2xl mx-auto space-y-8">
          <div
            className="text-center space-y-4 pt-4 pb-6 md:pt-6 md:pb-6"
            // small extra top padding to separate the heading from the section top
            style={{ paddingTop: '0.125rem' }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-black to-purple-900 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Beyond coding, I have other hobbies and interests that might make me the right fit for your company/team.
            </p>
          </div>
          
          {/* Responsive CSS grid: force a desktop 2-column layout via an explicit media rule
              as a robust fallback in case Tailwind responsive classes are not applied. */}
          <style>{`
            /* Force two-column layout at a slightly smaller breakpoint to cover most desktop/tablet sizes */
            @media (min-width: 600px) {
              /* Reduced column-gap and side padding so paired items sit closer but don't touch */
              /* Constrain columns and center the grid so pairs sit closer to the page center */
              /* Use auto-sized columns and a small gap so pairs sit just a small distance apart */
              /* Very small gap between the two columns to make the pair almost touch */
              /* 2px gap keeps a visible separation while being extremely tight */
              #about-grid { display: grid !important; grid-template-columns: auto auto !important; column-gap: 2px !important; row-gap: 3.25rem !important; padding-left: 0.5rem !important; padding-right: 0.5rem !important; justify-content: center !important; }
              /* Align left-column children to the end and right-column children to the start so pairs sit toward the center */
              #about-grid .about-cell.start { justify-self: end !important; }
              #about-grid .about-cell.end { justify-self: start !important; }
              #about-grid .about-cell.center { grid-column: 1 / -1 !important; justify-self: center !important; }
            }
          `}</style>
          <div
            id="about-grid"
            className="pb-2 md:pb-4"
            style={{
              display: 'grid',
              /* For desktop, use auto-sized columns so badges hug their content; use a tiny gap between them */
              gridTemplateColumns: columns === 2 ? 'auto auto' : '1fr',
              columnGap: columns === 2 ? '2px' : '0',
              rowGap: columns === 2 ? '3.25rem' : '2.5rem',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              justifyContent: columns === 2 ? 'center' : 'stretch',
              // Slightly smaller explicit bottom padding to ensure a bit less space below the last badge
              paddingBottom: '1rem'
            }}

