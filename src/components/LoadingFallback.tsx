import React from "react";

export function LoadingFallback() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-white"
      style={{ 
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div className="text-center space-y-4">
        <div 
          className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"
          style={{
            animation: 'spin 1s linear infinite',
            borderColor: '#d1d5db',
            borderTopColor: '#2563eb'
          }}
        />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Loading portfolio...
        </p>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}