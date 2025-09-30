import React from "react";

interface SafeIconProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SafeIcon({ children, className = "", style = {} }: SafeIconProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  
  React.useEffect(() => {
    // Check for animation support
    const supportsAnimations = typeof window !== 'undefined' && 
      'requestAnimationFrame' in window &&
      'CSS' in window &&
      CSS.supports && 
      CSS.supports('animation', 'bounce 1s infinite');
    
    if (!supportsAnimations) {
      // Remove animation classes if animations aren't supported
      setIsVisible(true);
    }
  }, []);

  const safeStyle: React.CSSProperties = {
    ...style,
    contain: 'layout style paint',
    isolation: 'isolate',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  const safeClassName = React.useMemo(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return className.replace(/animate-\w+/g, '').replace(/\[animation-delay:[^\]]*\]/g, '');
      }
    }
    return className;
  }, [className]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={safeClassName} 
      style={safeStyle}
      role="presentation"
      aria-hidden="true"
    >
      {children}
    </div>
  );
}