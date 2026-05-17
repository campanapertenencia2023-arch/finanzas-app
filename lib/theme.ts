// Unified Theme Configuration
export const theme = {
  colors: {
    // Primary
    primary: '#3b82f6', // blue-500
    primaryDark: '#1e40af', // blue-800
    primaryLight: '#60a5fa', // blue-400

    // Income (Ingresos)
    income: '#10b981', // emerald-600
    incomeLight: '#a7f3d0', // emerald-100
    incomeDark: '#047857', // emerald-800

    // Expense (Egresos)
    expense: '#dc2626', // red-600
    expenseLight: '#fecaca', // red-200
    expenseDark: '#991b1b', // red-900

    // Balance (positive/negative)
    positive: '#06b6d4', // cyan-600
    negative: '#f59e0b', // amber-500

    // Backgrounds
    bg: {
      dark: '#0f172a', // slate-950
      darker: '#0f172a', // slate-950
      card: 'rgba(71, 85, 105, 0.15)', // slate-700/15
      cardHover: 'rgba(71, 85, 105, 0.25)', // slate-700/25
    },

    // Text
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#cbd5e1', // slate-300
      muted: '#94a3b8', // slate-400
      disabled: '#64748b', // slate-500
    },

    // Borders
    border: {
      default: '#475569', // slate-600
      light: '#334155', // slate-700
      lighter: '#1e293b', // slate-800
    },

    // Status
    error: '#ef4444', // red-500
    warning: '#eab308', // yellow-400
    success: '#22c55e', // green-500
    info: '#3b82f6', // blue-500
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
  },

  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },

  transitions: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
  },
};

// Tailwind Class Helpers
export const styles = {
  card: {
    base: 'rounded-2xl backdrop-blur-xl transition-all duration-300',
    default: 'bg-slate-800/30 border border-slate-700/50',
    premium: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-xl hover:shadow-2xl',
    elevated: 'bg-gradient-to-b from-slate-700/40 to-slate-800/40 border border-slate-600/50 shadow-lg',
  },

  button: {
    base: 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 active:scale-95',
    danger: 'bg-red-600 hover:bg-red-700 text-white active:scale-95',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95',
  },

  input: {
    base: 'px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500',
    focus: 'focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20',
    error: 'border-red-500/50',
  },

  table: {
    header: 'bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50',
    row: 'border-b border-slate-700/30 hover:bg-slate-700/20',
  },

  text: {
    h1: 'text-6xl font-bold',
    h2: 'text-4xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-bold',
    body: 'text-base',
    small: 'text-sm',
    xs: 'text-xs',
  },

  gradient: {
    brand: 'from-emerald-400 via-cyan-400 to-blue-500',
    warm: 'from-amber-400 to-orange-500',
    cool: 'from-cyan-400 to-blue-500',
  },
};
