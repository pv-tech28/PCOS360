import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function EthicalDisclaimer({
  type = 'info', // 'info' | 'warning' | 'clinical'
  title = 'Clinical Decision Support Notice',
  children,
  className = ''
}) {
  const isWarning = type === 'warning';
  
  return (
    <div className={`rounded-xl p-3.5 text-xs flex items-start gap-2.5 ${
      isWarning 
        ? 'bg-amber-50/80 border border-amber-200/80 text-amber-900' 
        : 'bg-[#F4EFFB] border border-[#E4D7F5] text-[#553878]'
    } ${className}`}>
      {isWarning ? (
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      ) : (
        <Info className="w-4 h-4 text-[#7950A8] shrink-0 mt-0.5" />
      )}
      <div className="leading-relaxed">
        {title && <span className="font-semibold block mb-0.5">{title}</span>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
