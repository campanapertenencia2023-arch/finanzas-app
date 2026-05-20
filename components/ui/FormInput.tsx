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
      {label && <label className="text-sm font-semibold text-slate-700 font-poppins">{label}</label>}
      <input
        className={`px-4 py-2 rounded-lg bg-white border ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'
        } text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors shadow-sm ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
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
      {label && <label className="text-sm font-semibold text-slate-700 font-poppins">{label}</label>}
      <textarea
        className={`px-4 py-2 rounded-lg bg-white border ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'
        } text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none shadow-sm ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
      {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}
