import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'elevated';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md',
    premium: 'bg-white border border-slate-200 p-8 shadow-md hover:shadow-lg',
    elevated: 'bg-white border border-slate-200 p-6 shadow-lg hover:shadow-xl',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
