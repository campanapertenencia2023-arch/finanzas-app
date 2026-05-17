import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  helperText,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold text-slate-300">{label}</label>}
      <input
        className={`px-4 py-2 rounded-lg bg-slate-800/50 border ${
          error ? 'border-red-500/50' : 'border-slate-700/50'
        } text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}

export function FormTextarea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold text-slate-300">{label}</label>}
      <textarea
        className={`px-4 py-2 rounded-lg bg-slate-800/50 border ${
          error ? 'border-red-500/50' : 'border-slate-700/50'
        } text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}
