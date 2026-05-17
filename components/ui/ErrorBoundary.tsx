'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 max-w-md text-center">
              <h1 className="text-2xl font-bold text-red-400 mb-2">⚠️ Error</h1>
              <p className="text-slate-300 mb-4">
                {this.state.error?.message || 'Algo salió mal. Por favor intenta recargar la página.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Recargar Página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
