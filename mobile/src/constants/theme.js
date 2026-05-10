export const fonts = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

/** User-provided palette */
export const palette = {
  navy: '#000926',
  sapphire: '#0F52BA',
  iceBlue: '#D8E6F3',
  white: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.1)',
};

/**
 * @param {boolean} isDark
 * @returns {Record<string, string>}
 */
export function getColors(isDark) {
  if (isDark) {
    return {
      background: palette.navy,
      surface: '#010E3A',
      surfaceElevated: '#02185C',
      textPrimary: palette.iceBlue,
      textSecondary: 'rgba(216, 230, 243, 0.7)',
      primary: palette.sapphire,
      secondary: '#1A6BFF',
      primaryMuted: 'rgba(15, 82, 186, 0.22)',
      border: 'rgba(216, 230, 243, 0.14)',
      disabled: 'rgba(216, 230, 243, 0.22)',
      error: '#F87171',
      warning: '#FBBF24',
      success: '#10B981',
      confirmed: palette.iceBlue,
      gradientEnd: '#0639A2',
      tabBar: '#00061A',
      tabBarBorder: 'rgba(216, 230, 243, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.7)',
      star: '#FBBF24',
      ctaText: palette.iceBlue,
    };
  }
  return {
    background: '#F0F5FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: palette.navy,
    textSecondary: 'rgba(0, 9, 38, 0.62)',
    primary: palette.sapphire,
    secondary: '#1A6BFF',
    primaryMuted: 'rgba(15, 82, 186, 0.15)',
    border: 'rgba(15, 82, 186, 0.15)',
    disabled: 'rgba(0, 9, 38, 0.12)',
    error: '#DC2626',
    warning: '#D97706',
    success: '#059669',
    confirmed: palette.sapphire,
    gradientEnd: '#1A6BFF',
    tabBar: '#FFFFFF',
    tabBarBorder: 'rgba(15, 82, 186, 0.1)',
    overlay: 'rgba(0, 9, 38, 0.45)',
    star: '#D97706',
    ctaText: '#FFFFFF',
  };
}

export function typographyStyles(colors) {
  return {
    title: {
      fontSize: 22,
      fontFamily: fonts.bold,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    body: {
      fontSize: 15,
      fontFamily: fonts.regular,
      color: colors.textPrimary,
    },
    caption: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: colors.textSecondary,
    },
  };
}

export function cardShadow(colors, isDark) {
  return {
    shadowColor: isDark ? '#000' : palette.darkEvergreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.35 : 0.08,
    shadowRadius: 12,
    elevation: isDark ? 6 : 4,
  };
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 12,
  md: 16,
  pill: 999,
};
