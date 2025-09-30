// Ultra-aggressive error suppression script
// This runs immediately when loaded, before React even initializes

(function() {
  'use strict';
  
  // Patterns to suppress
  const patterns = [
    'devtools_worker',
    'webpack-artifacts', 
    'figma.com',
    'pb/<@',
    'us@',
    'br:1786:2973',
    'br:1759:1695',
    'br:1759:1979', 
    'br:1759:1615',
    'br:1783:906',
    'CSSScopeRule',
    'CSSStyleSheet.cssRules',
    'Not allowed to access cross-origin'
  ];

  function shouldSuppress(str) {
    if (!str) return false;
    const s = String(str).toLowerCase();
    return patterns.some(p => s.includes(p.toLowerCase()));
  }

  // Override all console methods immediately
  const originalMethods = {};
  ['error', 'warn', 'log', 'info', 'debug'].forEach(method => {
    if (console[method]) {
      originalMethods[method] = console[method];
      console[method] = function(...args) {
        const msg = args.join(' ');
        if (shouldSuppress(msg)) return;
        originalMethods[method].apply(console, args);
      };
    }
  });

  // Global error suppression
  window.addEventListener('error', function(e) {
    if (shouldSuppress(e.message) || shouldSuppress(e.filename) || shouldSuppress(e.error?.stack)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Promise rejection suppression
  window.addEventListener('unhandledrejection', function(e) {
    if (shouldSuppress(String(e.reason)) || shouldSuppress(e.reason?.stack)) {
      e.preventDefault();
      return false;
    }
  }, true);

  // Resource error suppression
  document.addEventListener('error', function(e) {
    const target = e.target || e.srcElement;
    if (target && (shouldSuppress(target.src) || shouldSuppress(target.href))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Override onerror
  window.onerror = function(msg, file, line, col, error) {
    if (shouldSuppress(msg) || shouldSuppress(file) || shouldSuppress(error?.stack)) {
      return true; // Suppress the error
    }
    return false; // Let other errors through
  };

  // Override onunhandledrejection
  window.onunhandledrejection = function(e) {
    if (shouldSuppress(String(e.reason)) || shouldSuppress(e.reason?.stack)) {
      e.preventDefault();
      return true;
    }
    return false;
  };

})();