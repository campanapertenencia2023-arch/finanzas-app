import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'balance' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const baseStyles = 'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest';

  const variants = {
    income: 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30',
    expense: 'bg-red-500/20 text-red-400 border border-red-400/30',
    balance: 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30',
    neutral: 'bg-slate-500/20 text-slate-400 border border-slate-400/30',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
