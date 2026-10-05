import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'white' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'right',
  className = '',
  isLoading = false,
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs font-semibold gap-1.5',
    md: 'px-6 py-3 text-sm font-semibold gap-2',
    lg: 'px-8 py-4 text-base font-bold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:bg-brand-blue-hover hover:shadow-brand-blue/50 border border-transparent',
    secondary:
      'bg-brand-surface-soft text-brand-navy hover:bg-brand-blue-light hover:text-brand-blue border border-brand-border hover:border-brand-blue/30',
    outline:
      'bg-transparent text-brand-navy hover:bg-brand-surface-soft border border-brand-border hover:border-brand-blue hover:text-brand-blue',
    white:
      'bg-white text-brand-navy hover:bg-brand-surface-soft shadow-md shadow-slate-900/5 border border-brand-border/60 hover:text-brand-blue',
    dark:
      'bg-brand-navy text-white hover:bg-brand-navy-dark shadow-lg shadow-brand-navy/25 border border-transparent'
  };

  const baseStyles =
    'inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-[0.98] select-none cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0 leading-none';

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        Icon && iconPosition === 'left' && (
          <Icon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        )
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClass} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClass} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClass} disabled={isLoading} {...props}>
      {content}
    </button>
  );
};
