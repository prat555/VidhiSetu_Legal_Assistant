// VidhiSetu Theme - Minimalist Design System
// Clean, professional, and consistent

export const theme = {
  colors: {
    // Primary brand color - warm saffron inspired
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      main: '#f97316',
    },
    // Neutral grays
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    // Background
    bg: {
      primary: '#fafafa',
      secondary: '#ffffff',
      dark: '#171717',
      card: '#ffffff',
    },
    // Text
    text: {
      primary: '#171717',
      secondary: '#525252',
      muted: '#737373',
      light: '#a3a3a3',
    },
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  // Spacing scale
  spacing: {
    page: 'px-4 sm:px-6 lg:px-8',
    section: 'py-16 sm:py-20 lg:py-24',
    container: 'max-w-6xl mx-auto',
  },
  // Border radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  // Transitions
  transition: {
    fast: 'all 0.15s ease',
    normal: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
};

// Feature card styles - Consistent across all features
export const featureStyles = {
  chat: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    accent: 'blue',
  },
  document: {
    icon: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    accent: 'violet',
  },
  forms: {
    icon: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    accent: 'amber',
  },
  search: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    accent: 'emerald',
  },
  rights: {
    icon: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    accent: 'rose',
  },
  tracker: {
    icon: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    accent: 'indigo',
  },
};

// Common gradient backgrounds (kept for backward compatibility)
export const gradients = {
  page: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950',
  hero: 'bg-gradient-to-br from-orange-950/20 via-zinc-950 to-purple-950/20',
  card: 'bg-gradient-to-br from-white/5 to-white/[0.02]',
  accent: 'bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400',
};

// Glass morphism styles
export const glass = {
  light: 'bg-white/5 backdrop-blur-sm border border-white/10',
  medium: 'bg-white/10 backdrop-blur-md border border-white/15',
  dark: 'bg-black/20 backdrop-blur-xl border border-white/10',
};
