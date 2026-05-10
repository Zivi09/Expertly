import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing, typographyStyles } from '../constants/theme';

function uniqueDates(slots) {
  const set = new Set((slots || []).map((s) => s.date));
  return Array.from(set).sort();
}

export function TimeSlotPicker({
  slots,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}) {
  const { colors } = useAppTheme();
  const typo = typographyStyles(colors);
  const dates = uniqueDates(slots);
  const daySlots = (slots || []).filter((s) => s.date === selectedDate);

  return (
    <View>
      <Text style={[typo.title, styles.sectionTitle]}>Available slots</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateRow}
      >
        {dates.map((d) => {
          const active = d === selectedDate;
          const label = formatDateChip(d);
          return (
            <TouchableOpacity
              key={d}
              style={[
                styles.dateChip,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSelectDate(d)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.dateChipText,
                  {
                    color: active ? colors.ctaText : colors.textSecondary,
                    fontFamily: fonts.semibold,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.grid}>
        {daySlots.map((slot) => {
          const booked = slot.isBooked;
          const selected = !booked && slot.time === selectedTime;
          return (
            <TouchableOpacity
              key={`${slot.date}-${slot.time}`}
              style={[
                styles.slot,
                {
                  backgroundColor: booked ? colors.disabled : colors.surface,
                  borderColor: booked
                    ? colors.disabled
                    : selected
                      ? colors.primary
                      : colors.success,
                  borderWidth: 2,
                },
                selected && { backgroundColor: colors.primaryMuted },
              ]}
              disabled={booked}
              onPress={() => onSelectTime(slot.time)}
              activeOpacity={booked ? 1 : 0.85}
            >
              <Text
                style={[
                  styles.slotText,
                  { color: colors.textPrimary, fontFamily: fonts.bold },
                  booked && {
                    textDecorationLine: 'line-through',
                    color: colors.textSecondary,
                  },
                  selected && { color: colors.primary },
                ]}
              >
                {slot.time}
              </Text>
              {booked ? (
                <Text style={[styles.bookedLabel, { color: colors.textSecondary }]}>
                  Booked
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function formatDateChip(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekday = dt.toLocaleDateString(undefined, { weekday: 'short' });
  const day = dt.getDate();
  const month = dt.toLocaleDateString(undefined, { month: 'short' });
  return `${weekday} ${month} ${day}`;
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  dateChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  dateChipText: { fontSize: 13 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    width: '30%',
    flexGrow: 1,
    minWidth: '28%',
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  slotText: { fontSize: 14 },
  bookedLabel: {
    marginTop: spacing.xs,
    fontSize: 11,
    fontFamily: fonts.bold,
  },
});
