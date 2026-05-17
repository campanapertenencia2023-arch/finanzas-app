import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'elevated';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  const baseStyles = 'rounded-2xl overflow-hidden';

  const variantStyles = {
    default: 'bg-slate-800/30 border border-slate-700/50 backdrop-blur-xl',
    premium: 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/30 backdrop-blur-xl',
    elevated: 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/40 shadow-2xl backdrop-blur-xl',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
