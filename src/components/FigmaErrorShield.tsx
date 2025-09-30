import React from "react";

interface FigmaErrorShieldProps {
  children: React.ReactNode;
}

// Global error suppression for Figma-specific errors
let errorShieldInitialized = false;

function initializeErrorShield() {
  if (errorShieldInitialized) return;
  errorShieldInitialized = true;

  // Suppress console errors from Figma
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('devtools_worker') ||
      message.includes('webpack-artifacts') ||
      message.includes('figma.com') ||
      message.toLowerCase().includes('figma')
    ) {
      return; // Suppress Figma-related errors
    }
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('devtools_worker') ||
      message.includes('webpack-artifacts') ||
      message.includes('figma.com') ||
      message.toLowerCase().includes('figma')
    ) {
      return; // Suppress Figma-related warnings
    }
    originalWarn.apply(console, args);
  };

  // Global error handler for window errors
  const handleWindowError = (event: ErrorEvent) => {
    const message = event.message || '';
    const filename = event.filename || '';
    
    if (
      message.includes('devtools_worker') ||
      message.includes('webpack-artifacts') ||
      filename.includes('figma.com') ||
      filename.includes('devtools_worker') ||
      message.toLowerCase().includes('figma')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };

  // Global promise rejection handler
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason?.toString() || '';
    const stack = event.reason?.stack || '';
    
    if (
      reason.includes('devtools_worker') ||
      reason.includes('webpack-artifacts') ||
      reason.includes('figma.com') ||
      stack.includes('figma.com') ||
      reason.toLowerCase().includes('figma')
    ) {
      event.preventDefault();
      return;
    }
  };

  // Global resource error handler
  const handleResourceError = (event: Event) => {
    const target = event.target as HTMLElement;
    const src = (target as any)?.src || (target as any)?.href || '';
    
    if (
      src.includes('figma.com') ||
      src.includes('webpack-artifacts') ||
      src.includes('devtools_worker')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };

  // Add all error listeners
  window.addEventListener('error', handleWindowError, true);
  window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
  window.addEventListener('error', handleResourceError, true);

  // Cleanup function (though we might not need it for this use case)
  return () => {
    window.removeEventListener('error', handleWindowError, true);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.removeEventListener('error', handleResourceError, true);
    console.error = originalError;
    console.warn = originalWarn;
  };
}

export function FigmaErrorShield({ children }: FigmaErrorShieldProps) {
  React.useEffect(() => {
    initializeErrorShield();
  }, []);

  return <>{children}</>;
}