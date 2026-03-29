export const Theme = {
  colors: {
    // Core palette
    background: '#030305',
    surface: 'rgba(26, 26, 46, 0.4)',
    surfaceHighlight: 'rgba(99, 102, 241, 0.15)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',

    // Gradient stops
    primary: '#6366F1',
    primaryLight: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    accentPink: '#EC4899',

    // Text
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      tertiary: '#64748B',
      inverse: '#030305',
    },

    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  typography: {
    heading1: {
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    heading2: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.3,
      lineHeight: 36,
    },
    heading3: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: 0,
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
    },
    overline: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 64,
    hugePlus: 80,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    md: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    lg: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
    glow: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 6,
    },
  },

  gradients: {
    primary: ['#6366F1', '#8B5CF6'],
    accent: ['#F59E0B', '#F59E0B'],
    success: ['#10B981', '#34D399'],
    surface: ['rgba(26, 26, 46, 0.6)', 'rgba(26, 26, 46, 0.8)'],
    mesh: ['#030305', '#0F0F23', '#1A1A2E', '#16213E'],
  } as const,

  animation: {
    spring: {
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    } as const,
    springBounce: {
      tension: 60,
      friction: 5,
      useNativeDriver: true,
    } as const,
    fade: {
      duration: 400,
      useNativeDriver: true,
    } as const,
    slow: {
      duration: 800,
      useNativeDriver: true,
    } as const,
  } as const,
};

// No explicit type export in JS; use typeof Theme in TS contexts
