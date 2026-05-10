import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing } from '../constants/theme';

export function FloatingLabelInput({
  label,
  error,
  multiline,
  style,
  onBlur,
  onFocus,
  value,
  ...rest
}) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const floated = focused || (value && String(value).length > 0);

  const labelStyle = [
    styles.label,
    { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: 16 },
    floated && [
      styles.labelFloat,
      { color: colors.primary, fontFamily: fonts.semibold },
    ],
  ];

  return (
    <View style={[styles.wrap, style]}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        {...rest}
        value={value}
        multiline={multiline}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary,
            backgroundColor: colors.surface,
            fontFamily: fonts.regular,
          },
          multiline && styles.inputMulti,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    top: 16,
    zIndex: 1,
    fontSize: 16,
    pointerEvents: 'none',
  },
  labelFloat: {
    top: 6,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingTop: 22,
    paddingBottom: spacing.sm,
    fontSize: 16,
    minHeight: 52,
  },
  inputMulti: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
