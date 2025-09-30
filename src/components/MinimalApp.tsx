import React from "react";

// Minimal, conflict-free version of the portfolio
export function MinimalApp() {
  React.useEffect(() => {
    // Super minimal error suppression
    const handleError = (e: ErrorEvent) => {
      const msg = e.message || '';
      if (msg.includes('devtools_worker') || msg.includes('figma.com') || msg.includes('webpack-artifacts')) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError, true);
    return () => window.removeEventListener('error', handleError, true);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
          Alex Johnson
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
          Computer Science Student & Software Developer
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '3rem'
        }}>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e5e5e5', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              About Me
            </h3>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
              Passionate Computer Science student with experience in full-stack development, 
              cloud computing, and mobile app development.
            </p>
          </div>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e5e5e5', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Experience
            </h3>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
              Software Development Intern at TechFlow Solutions.
              Led projects at Microsoft and Google for Education.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}