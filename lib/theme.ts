// Unified Theme Configuration - LIGHT MODE
export const theme = {
  colors: {
    // Primary
    primary: '#3b82f6', // blue-500
    primaryDark: '#1e40af', // blue-800
    primaryLight: '#60a5fa', // blue-400

    // Income (Ingresos)
    income: '#10b981', // emerald-600
    incomeLight: '#d1fae5', // emerald-100
    incomeDark: '#059669', // emerald-700

    // Expense (Egresos)
    expense: '#ef4444', // red-500
    expenseLight: '#fee2e2', // red-100
    expenseDark: '#dc2626', // red-600

    // Balance (positive/negative)
    positive: '#06b6d4', // cyan-600
    negative: '#f97316', // orange-500

    // Backgrounds (Light Mode)
    bg: {
      light: '#ffffff', // white
      lighter: '#f5f7fa', // slate-100 light
      card: '#ffffff',
      cardHover: '#f9fafb', // slate-50
    },

    // Text (Light Mode)
    text: {
      primary: '#1f2937', // slate-800
      secondary: '#4b5563', // slate-600
      muted: '#6b7280', // slate-500
      disabled: '#9ca3af', // slate-400
    },

    // Borders (Light Mode)
    border: {
      default: '#e5e7eb', // slate-200
      light: '#f3f4f6', // slate-100
      lighter: '#e8ebf0', // slate-100 custom
    },

    // Status
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    success: '#10b981', // green-600
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

// Tailwind Class Helpers - LIGHT MODE
export const styles = {
  card: {
    base: 'rounded-2xl transition-all duration-300',
    default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
    premium: 'bg-white border border-slate-200 shadow-md hover:shadow-lg',
    elevated: 'bg-white border border-slate-200 shadow-lg hover:shadow-xl',
  },

  button: {
    base: 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm hover:shadow-md',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
  },

  input: {
    base: 'px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm',
    focus: 'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
    error: 'border-red-500 focus:ring-red-200',
  },

  table: {
    header: 'bg-slate-50 border-b border-slate-200 font-semibold text-slate-700',
    row: 'border-b border-slate-100 hover:bg-slate-50 transition-colors',
  },

  text: {
    h1: 'text-6xl font-bold text-slate-900',
    h2: 'text-4xl font-bold text-slate-900',
    h3: 'text-2xl font-bold text-slate-900',
    h4: 'text-xl font-bold text-slate-900',
    body: 'text-base text-slate-700',
    small: 'text-sm text-slate-600',
    xs: 'text-xs text-slate-500',
  },

  gradient: {
    brand: 'from-blue-500 to-cyan-500',
    warm: 'from-orange-500 to-red-500',
    cool: 'from-blue-500 to-cyan-500',
  },
};
