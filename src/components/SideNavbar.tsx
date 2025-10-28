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
      // Scroll with a small upward offset so the target sits slightly higher
      // on the viewport. This helps for sections that have top spacing or
      // when a fixed header/decoration overlays the top.
      // Apply a slightly larger offset for the 'about' section specifically.
      const offset = sectionId === 'about' ? 200 : 64; // px, tweakable
      const rect = element.getBoundingClientRect();
      const target = window.pageYOffset + rect.top - offset;
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-2">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeSections.includes(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={item.label}
              >
                <div className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {item.icon}
                </div>
                
                {/* Tooltip */}
                <div className={`absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                  isActive ? 'hidden' : ''
                }`}>
                  {item.label}
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-500" />
      </div>
    </nav>
  );
}