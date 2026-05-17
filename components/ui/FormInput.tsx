import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 rounded-lg
          bg-slate-800/50 border border-slate-700/50
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
          transition-all duration-200
          ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function FormTextarea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2 rounded-lg
          bg-slate-800/50 border border-slate-700/50
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
          transition-all duration-200
          ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
}
