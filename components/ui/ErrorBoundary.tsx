'use client';

import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/30 rounded-2xl p-8 max-w-md backdrop-blur-xl">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Algo salió mal</h2>
              <p className="text-slate-400 mb-4">
                Ocurrió un error inesperado. Por favor, intenta recargar la página.
              </p>
              {this.state.error && (
                <details className="text-xs text-slate-500 mb-4">
                  <summary className="cursor-pointer font-semibold text-slate-300">
                    Detalles del error
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-900/50 rounded border border-slate-700/30 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
