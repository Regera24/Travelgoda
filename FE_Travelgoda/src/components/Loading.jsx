import React from 'react';
import './Loading.css';

const Loading = ({ 
  size = 'medium', 
  variant = 'spinner',
  text = '',
  fullScreen = false,
  className = '' 
}) => {
  const containerClasses = [
    'loading-container',
    fullScreen && 'loading-fullscreen',
    className,
  ].filter(Boolean).join(' ');

  const spinnerClasses = [
    'loading-spinner',
    `loading-${size}`,
    `loading-${variant}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}>
        {variant === 'spinner' && (
          <div className="spinner-circle"></div>
        )}
        {variant === 'dots' && (
          <div className="spinner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {variant === 'pulse' && (
          <div className="spinner-pulse"></div>
        )}
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
