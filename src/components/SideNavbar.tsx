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
  const [activeSection, setActiveSection] = useState('hero');

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-2">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            
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