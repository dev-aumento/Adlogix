import React from 'react';

export const Badge = ({
  children,
  variant = 'blue', // 'blue' | 'emerald' | 'navy' | 'gray' | 'purple'
  size = 'sm',
  className = '',
  icon: Icon
}) => {
  const variantStyles = {
    blue: 'bg-brand-blue-light/80 text-brand-blue border-brand-blue/20',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    navy: 'bg-brand-navy text-white border-transparent',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const sizeStyles = {
    xs: 'px-2.5 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 font-semibold tracking-wide uppercase rounded-full border backdrop-blur-sm whitespace-nowrap shrink-0 leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};
