import React from 'react';

export default function Logo({ size = 'md', showTagline = false, className = '' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`${iconSizes[size]} relative flex items-center justify-center shrink-0`}>
        {/* Soft elegant butterfly / organic lotus icon */}
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <circle cx="24" cy="24" r="22" fill="#EDE5F7" fillOpacity="0.7" />
          {/* Left upper wing */}
          <path d="M24 23C21 16 13 14 11 20C9.5 24.5 15 28 23 25" stroke="#7950A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="#FAF9FC" />
          {/* Right upper wing */}
          <path d="M24 23C27 16 35 14 37 20C38.5 24.5 33 28 25 25" stroke="#7950A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="#FAF9FC" />
          {/* Left lower wing */}
          <path d="M23 25C17 28 14 34 18 37C21 39 23.5 33 24 27" stroke="#7950A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#E8B8D0" fillOpacity="0.4" />
          {/* Right lower wing */}
          <path d="M25 25C31 28 34 34 30 37C27 39 24.5 33 24 27" stroke="#7950A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#E8B8D0" fillOpacity="0.4" />
          {/* Center body */}
          <ellipse cx="24" cy="25" rx="1.8" ry="6" fill="#7950A8" />
          {/* Antennae */}
          <path d="M23 19C21.5 17 20 16.5 19 17" stroke="#7950A8" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M25 19C26.5 17 28 16.5 29 17" stroke="#7950A8" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 font-bold tracking-tight text-[#292431]">
          <span className={`${textSizes[size]} font-extrabold bg-gradient-to-r from-[#7950A8] to-[#9B6DC4] bg-clip-text text-transparent`}>
            PCOS
          </span>
          <span className={`${textSizes[size]} text-[#292431]`}>360</span>
        </div>
        {showTagline && (
          <span className="text-[11px] tracking-wide text-[#77717F] font-medium -mt-0.5">
            Beyond Symptoms
          </span>
        )}
      </div>
    </div>
  );
}
