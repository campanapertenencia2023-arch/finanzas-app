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
          <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-md">
              <h1 className="text-2xl font-bold text-red-700 mb-2 font-montserrat">Error</h1>
              <p className="text-red-600 mb-4">
                {this.state.error?.message || 'Algo salió mal. Por favor intenta recargar la página.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
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
