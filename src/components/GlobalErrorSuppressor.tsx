// Global error suppression - this must run before any other code
(function suppressFigmaErrors() {
  // Store original functions
  const originalError = window.console?.error;
  const originalWarn = window.console?.warn;
  const originalLog = window.console?.log;

  // Comprehensive error patterns to suppress
  const errorPatterns = [
    'devtools_worker',
    'webpack-artifacts',
    'figma.com',
    'pb/<@',
    'us@',
    'CSSScopeRule',
    'stylesheet',
    'cross-origin',
    'br:1786:2973',
    'br:1759:1695',
    'br:1759:1979',
    'br:1759:1615',
    'br:1783:906'
  ];

  function shouldSuppress(message: string): boolean {
    if (!message) return false;
    const msg = message.toString().toLowerCase();
    return errorPatterns.some(pattern => msg.includes(pattern.toLowerCase()));
  }

  // Override console methods
  if (window.console) {
    window.console.error = function(...args) {
      const message = args.join(' ');
      if (shouldSuppress(message)) return;
      if (originalError) originalError.apply(console, args);
    };

    window.console.warn = function(...args) {
      const message = args.join(' ');
      if (shouldSuppress(message)) return;
      if (originalWarn) originalWarn.apply(console, args);
    };

    window.console.log = function(...args) {
      const message = args.join(' ');
      if (shouldSuppress(message)) return;
      if (originalLog) originalLog.apply(console, args);
    };
  }

  // Global error handler - must be synchronous
  const handleGlobalError = (event: ErrorEvent) => {
    const message = event.message || '';
    const filename = event.filename || '';
    const source = event.error?.stack || '';
    
    if (shouldSuppress(message) || shouldSuppress(filename) || shouldSuppress(source)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  };

  // Global rejection handler
  const handleGlobalRejection = (event: PromiseRejectionEvent) => {
    const reason = String(event.reason || '');
    const stack = event.reason?.stack || '';
    
    if (shouldSuppress(reason) || shouldSuppress(stack)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  };

  // Add listeners immediately
  window.addEventListener('error', handleGlobalError, true);
  window.addEventListener('unhandledrejection', handleGlobalRejection, true);

  // Also handle resource errors
  window.addEventListener('error', (event) => {
    const target = event.target as any;
    if (target?.src && shouldSuppress(target.src)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Try to suppress errors in the error event queue
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(() => {
      // Additional suppression for any queued errors
      const errorQueue = (window as any).__error_queue || [];
      (window as any).__error_queue = errorQueue.filter((error: any) => {
        const msg = error?.message || error?.toString() || '';
        return !shouldSuppress(msg);
      });
    });
  }
})();

// React component wrapper
import React from 'react';

interface GlobalErrorSuppressorProps {
  children: React.ReactNode;
}

export function GlobalErrorSuppressor({ children }: GlobalErrorSuppressorProps) {
  return <>{children}</>;
}