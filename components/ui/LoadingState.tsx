import React from 'react';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
  rows?: number;
}

export function LoadingState({ variant = 'pulse', message = 'Cargando...', rows = 3 }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-slate-600 text-sm">{message}</p>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="space-y-4 py-8">
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
      </div>
    );
  }

  return (
    <div className="py-16 text-center">
      <div className="inline-block">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      <p className="text-slate-600 text-sm mt-4">{message}</p>
    </div>
  );
}
