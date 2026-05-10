import { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { radius, spacing, cardShadow } from '../constants/theme';

export function ListSkeleton() {
  const { colors, isDark } = useAppTheme();
  const shadow = useMemo(() => cardShadow(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.skeletonWrap}>
      {[0, 1, 2, 3].map((k) => (
        <View
          key={k}
          style={[styles.skeletonCard, { backgroundColor: colors.surface }, shadow]}
        >
          <View style={[styles.skeletonAvatar, { backgroundColor: colors.disabled }]} />
          <View style={[styles.skeletonLineWide, { backgroundColor: colors.disabled }]} />
          <View style={[styles.skeletonLine, { backgroundColor: colors.disabled }]} />
          <View style={[styles.skeletonChip, { backgroundColor: colors.disabled }]} />
        </View>
      ))}
    </View>
  );
}

export function LoadingSpinner({ message }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <View style={{ height: spacing.md }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrap: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  skeletonCard: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
  skeletonAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: spacing.sm,
  },
  skeletonLineWide: {
    height: 14,
    borderRadius: 6,
    width: '70%',
    marginBottom: spacing.sm,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    width: '45%',
    marginBottom: spacing.sm,
    opacity: 0.85,
  },
  skeletonChip: {
    height: 28,
    width: 100,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
