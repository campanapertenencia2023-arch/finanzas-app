import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'balance' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const baseStyles = 'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest';

  const variants = {
    income: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    expense: 'bg-red-100 text-red-700 border border-red-200',
    balance: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
