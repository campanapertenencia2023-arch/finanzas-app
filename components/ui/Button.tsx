import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95';

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg w-full',
  };

  return (
    <button
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? '⏳ Cargando...' : children}
    </button>
  );
}
