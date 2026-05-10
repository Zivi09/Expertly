import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing } from '../constants/theme';

const FILTERS = [
  'All',
  'Tech',
  'Business',
  'Design',
  'Health',
  'Finance',
  'Education',
];

export function FilterBar({ selected, onSelect }) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((item) => {
        const active = item === selected;
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.surface,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(item)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.ctaText : colors.textSecondary, fontFamily: fonts.semibold },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: 14,
  },
});
