import React from 'react';

export function Card({ children, className = '', highlight = false, style = {} }) {
  return (
    <div 
      className={`glass-panel p-6 ${className}`} 
      style={{
        ...style,
        ...(highlight ? { border: '1px solid var(--neon-cyan)', boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)' } : {})
      }}
    >
      {children}
    </div>
  );
}
