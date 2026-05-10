import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing } from '../constants/theme';

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  containerStyle,
  compact,
}) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        compact ? styles.wrapCompact : styles.wrapDefault,
        containerStyle,
      ]}
    >
      <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: colors.textPrimary, fontFamily: fonts.regular }]}
        placeholder={placeholder || 'Search by name…'}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value?.length ? (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={12}>
          <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    flex: 1,
  },
  wrapDefault: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  wrapCompact: {
    marginBottom: 0,
  },
  icon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
});
