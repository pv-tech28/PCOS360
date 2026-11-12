import React from 'react';

export function BrandMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="24" cy="24" r="22" fill="#F1EAF8" />
      <circle cx="24" cy="24" r="18" stroke="#D8C9E7" strokeWidth="1.4" />
      <path d="M36.2 12.8a17.7 17.7 0 0 1 5.7 11.8" stroke="#7950A8" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="36" cy="12.7" r="2.8" fill="#E8B8D0" stroke="#fff" strokeWidth="1.2" />
      <path d="M23.5 22.7C19.4 13.3 11.1 12.9 10 18.2c-1 4.8 5.6 7.8 13.1 6.5" fill="#fff" stroke="#7950A8" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M24.5 22.7c4.1-9.4 12.4-9.8 13.5-4.5 1 4.8-5.6 7.8-13.1 6.5" fill="#fff" stroke="#7950A8" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M23.3 25.1c-7.7 1.4-10.2 7.4-6.3 9.4 3.4 1.8 6.3-2.6 7-7.9" fill="#E8B8D0" stroke="#7950A8" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M24.7 25.1c7.7 1.4 10.2 7.4 6.3 9.4-3.4 1.8-6.3-2.6-7-7.9" fill="#E8B8D0" stroke="#7950A8" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M24 19.7v11.1" stroke="#5E3B87" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="24.7" r="2.1" fill="#7950A8" />
    </svg>
  );
}

export default function Logo({ size = 'md', showTagline = false, className = '' }) {
  const iconSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14', xl: 'w-[4.5rem] h-[4.5rem]' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl', xl: 'text-3xl' };
  const safeSize = iconSizes[size] ? size : 'md';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <BrandMark className={`${iconSizes[safeSize]} shrink-0`} />
      <div className="flex flex-col">
        <div className={`${textSizes[safeSize]} flex items-center gap-1 font-extrabold leading-none tracking-tight`}>
          <span className="bg-gradient-to-r from-[#7950A8] to-[#9B6DC4] bg-clip-text text-transparent">PCOS</span>
          <span className="text-[#292431]">360</span>
        </div>
        {showTagline && <span className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-[#77717F]">BEYOND SYMPTOMS</span>}
      </div>
    </div>
  );
}
