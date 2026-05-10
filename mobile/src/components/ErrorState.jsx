import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing, typographyStyles } from '../constants/theme';

export function ErrorState({ message, onRetry }) {
  const { colors } = useAppTheme();
  const typo = typographyStyles(colors);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={56} color={colors.textSecondary} />
      <Text style={[typo.title, styles.title]}>Something went wrong</Text>
      <Text style={[typo.subtitle, styles.body]}>
        {message || 'Please check your connection and try again.'}
      </Text>
      {onRetry ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: colors.ctaText, fontFamily: fonts.bold }]}>
            Retry
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  buttonText: {
    fontSize: 15,
  },
});
