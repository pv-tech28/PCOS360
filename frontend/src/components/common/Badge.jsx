import React from 'react';

export function Badge({ children, variant = 'purple', size = 'sm', className = '' }) {
  const variantStyles = {
    purple: 'bg-[#EDE5F7] text-[#7950A8] border-[#DECFF2]',
    pink: 'bg-[#FBEAF3] text-[#A6417A] border-[#F4CCE3]',
    green: 'bg-[#EAF7EE] text-[#247A46] border-[#CEEFD7]',
    amber: 'bg-[#FEF6E6] text-[#B26B00] border-[#FCE6B7]',
    red: 'bg-[#FEEBEB] text-[#C52828] border-[#FDCACA]',
    teal: 'bg-[#E6F7F7] text-[#1B7878] border-[#C2EFEF]',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 font-medium rounded-full',
    sm: 'text-xs px-2.5 py-1 font-medium rounded-full',
    md: 'text-sm px-3 py-1.5 font-medium rounded-full',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border ${variantStyles[variant] || variantStyles.purple} ${sizeStyles[size] || sizeStyles.sm} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#EFEAF4] p-5 shadow-[0_2px_12px_rgba(121,80,168,0.04)] ${
        hover ? 'transition-all duration-200 hover:shadow-[0_6px_20px_rgba(121,80,168,0.08)] hover:border-[#DFCDEE] cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
