import React from 'react';
import './Button.css';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`spendora-btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
