import React, { useState, useEffect } from 'react';
import { User, Code, Mail, Home } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <Code className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
];

export function SideNavbar() {
  
  const [activeSections, setActiveSections] = useState<string[]>(['hero']);

  
  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        
        setActiveSections((prev) => {
          const set = new Set(prev);

          entries.forEach((e) => {
            const id = e.target.id;
            if (e.isIntersecting) set.add(id);
            else set.delete(id);
          });

          
          if (set.size === 0) {
            // Find nearest section by distance to top and return its id
            let closestId: string | null = null;
            let minDist = Infinity;
            sections.forEach((s) => {
              const rect = s.getBoundingClientRect();
              const dist = Math.abs(rect.top);
              if (dist < minDist) {
                minDist = dist;
                closestId = s.id || s.getAttribute('id') || null;
              }
            });
            if (closestId) return [closestId];
          }

          return Array.from(set);
        });
      },
      {
        
        threshold: [0, 0.01, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((s) => observer.observe(s));

    
    const initiallyVisible = sections.filter((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }).map(s => s.id);

    if (initiallyVisible.length > 0) setActiveSections(initiallyVisible);

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Special-case About: align the About title lower in the viewport
      // so the text is clearly visible (top of the title ~52% of viewport).
      if (sectionId === 'about') {
        const titleEl = element.querySelector<HTMLElement>('.about-title');
        const anchor = titleEl || element;
        const r = anchor.getBoundingClientRect();
  const desiredTop = Math.round(window.innerHeight * 0.20);
        const rawTarget = window.pageYOffset + r.top - desiredTop;
        const maxScroll = Math.max(0, (document.documentElement?.scrollHeight || 0) - window.innerHeight);
        const target = Math.min(Math.max(0, rawTarget), maxScroll);
        window.scrollTo({ top: target, behavior: 'smooth' });
        return;
      }

      // Projects and Experiences: align the section headline near the top-third
      // for immediate visibility of the text (top ~22% of viewport).
      if (sectionId === 'projects' || sectionId === 'experience' || sectionId === 'experiences') {
        // Prefer the visible title if present
        const titleEl = element.querySelector<HTMLElement>('.featured-title');
        const anchor = titleEl || element;
        const rect = anchor.getBoundingClientRect();
  const desiredTop = Math.round(window.innerHeight * 0.10);
        const rawTarget = window.pageYOffset + rect.top - desiredTop;
        const maxScroll = Math.max(0, (document.documentElement?.scrollHeight || 0) - window.innerHeight);
        const target = Math.min(Math.max(0, rawTarget), maxScroll);
        window.scrollTo({ top: target, behavior: 'smooth' });
        return;
      }

      // Default behavior: scroll with a modest offset so content isn't flush to the top
      const offset = 64; // px
      const rect = element.getBoundingClientRect();
      const target = window.pageYOffset + rect.top - offset;
      window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }
  };

  return (
    <nav className="sidenav">
      <div className="sidenav-panel">
        <div className="sidenav-list">
          {navItems.map((item) => {
            const isActive = activeSections.includes(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`sidenav-button ${isActive ? 'sidenav-button-active' : 'sidenav-button-inactive'}`}
                title={item.label}
              >
                <div className={`sidenav-icon ${isActive ? 'sidenav-icon-active' : 'sidenav-icon-hover'}`}>
                  {item.icon}
                </div>
                
                {/* Tooltip */}
                <div className={`sidenav-tooltip ${isActive ? 'hidden' : ''}`}>
                  {item.label}
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="sidenav-indicator" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Decorative elements */}
        <div className="sidenav-dot-top" />
      </div>
    </nav>
  );
}