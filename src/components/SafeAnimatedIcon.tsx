import React from "react";

interface SafeAnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SafeAnimatedIcon({ children, className, style }: SafeAnimatedIconProps) {
  const [animationEnabled, setAnimationEnabled] = React.useState(true);

  React.useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAnimationEnabled(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setAnimationEnabled(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const safeStyle = {
    ...style,
    willChange: animationEnabled ? 'transform' : 'auto',
    transform: animationEnabled ? style?.transform : 'none'
  };

  const safeClassName = animationEnabled ? className : className?.replace(/animate-\w+/g, '');

  return (
    <div className={safeClassName} style={safeStyle}>
      {children}
    </div>
  );
}