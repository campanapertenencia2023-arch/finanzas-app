import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'balance' | 'neutral';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const variantStyles = {
    income: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    expense: 'bg-red-500/20 text-red-300 border border-red-500/30',
    balance: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    neutral: 'bg-slate-700/40 text-slate-300 border border-slate-600/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
