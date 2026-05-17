import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'elevated';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-2xl backdrop-blur-xl transition-all duration-300';

  const variants = {
    default: 'bg-slate-800/30 border border-slate-700/50 p-8',
    premium: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 shadow-xl hover:shadow-2xl',
    elevated: 'bg-gradient-to-b from-slate-700/40 to-slate-800/40 border border-slate-600/50 p-6 shadow-lg',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
