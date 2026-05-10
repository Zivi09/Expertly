import { Text, View, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing } from '../constants/theme';

function statusMap(colors) {
  return {
    pending: { label: 'Pending', bg: 'rgba(245, 158, 11, 0.25)', color: '#D97706' },
    confirmed: { label: 'Confirmed', bg: 'rgba(80, 200, 120, 0.25)', color: colors.secondary },
    completed: { label: 'Completed', bg: 'rgba(80, 200, 120, 0.4)', color: colors.textPrimary },
  };
}

export function BookingStatusBadge({ status }) {
  const { colors } = useAppTheme();
  const MAP = statusMap(colors);
  const key = String(status || '').toLowerCase();
  const cfg =
    MAP[key] || {
      label: status || 'Unknown',
      bg: colors.disabled,
      color: colors.textSecondary,
    };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.color, fontFamily: fonts.bold }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: 12,
  },
});
