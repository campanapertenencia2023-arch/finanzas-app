import React from 'react';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
}

export function LoadingState({ variant = 'spinner', message = 'Cargando...' }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700/50" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400 animate-spin" />
      </div>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
