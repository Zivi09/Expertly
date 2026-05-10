import { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '../hooks/useBookings';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { ListSkeleton } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing, typographyStyles, cardShadow } from '../constants/theme';

export function MyBookingsScreen() {
  const { colors, isDark } = useAppTheme();
  const typo = typographyStyles(colors);
  const cardSh = useMemo(() => cardShadow(colors, isDark), [colors, isDark]);

  const {
    emailInput,
    setEmailInput,
    bookings,
    loading,
    error,
    searched,
    search,
    retry,
    cancel,
  } = useBookings();

  const handleCancel = useCallback((bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this session? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        { 
          text: 'Cancel Session', 
          style: 'destructive',
          onPress: () => cancel(bookingId) 
        },
      ]
    );
  }, [cancel]);

  const headerBlock = (
    <>
      <View style={styles.header}>
        <Text style={[typo.title, styles.title]}>My Bookings</Text>
        <Text style={[typo.subtitle, styles.subtitle]}>Look up reservations by email</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
              fontFamily: fonts.regular,
            },
          ]}
          placeholder="you@example.com"
          placeholderTextColor={colors.textSecondary}
          value={emailInput}
          onChangeText={setEmailInput}
          keyboardType="email-address"
          autoCapitalize="none"
          onSubmitEditing={() => search(emailInput)}
        />
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: colors.primary }]}
          onPress={() => search(emailInput)}
        >
          <Text style={[styles.searchBtnText, { color: colors.ctaText, fontFamily: fonts.bold }]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (error && searched && !loading && bookings.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        {headerBlock}
        <ErrorState message={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {headerBlock}
      {loading ? (
        <ListSkeleton />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={
            bookings.length === 0 && searched ? styles.emptyList : styles.listContent
          }
          ListEmptyComponent={
            searched && !loading ? (
              <View style={styles.empty}>
                <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
                <Text style={[typo.title, styles.emptyTitle]}>No bookings found</Text>
                <Text style={[typo.subtitle, styles.emptySub]}>
                  Try another email or make a new booking.
                </Text>
              </View>
            ) : !searched ? (
              <View style={styles.empty}>
                <Ionicons name="mail-outline" size={56} color={colors.textSecondary} />
                <Text style={[typo.title, styles.emptyTitle]}>Enter your email</Text>
                <Text style={[typo.subtitle, styles.emptySub]}>
                  We’ll show sessions tied to that address.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.surface }, cardSh]}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.expertName, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                    {item.expertName}
                  </Text>
                  <Text style={[typo.caption, { marginTop: 2 }]}>{item.category}</Text>
                </View>
                <BookingStatusBadge status={item.status} />
              </View>
              <Text style={[styles.slot, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                {item.date} · {item.timeSlot}
              </Text>
              {item.notes ? (
                <Text style={[typo.caption, styles.notes]} numberOfLines={2}>
                  {item.notes}
                </Text>
              ) : null}
              
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => handleCancel(item._id)}
              >
                <Text style={[typo.caption, { color: colors.error, fontFamily: fonts.bold }]}>
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: 24 },
  subtitle: { marginTop: spacing.xs },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
  },
  searchBtn: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  searchBtnText: { fontSize: 15 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  emptyList: { flexGrow: 1 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyTitle: { marginTop: spacing.md },
  emptySub: { textAlign: 'center', marginTop: spacing.sm },
  card: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  expertName: { fontSize: 17 },
  slot: { marginTop: spacing.xs },
  notes: { marginTop: spacing.sm },
  cancelBtn: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    alignItems: 'flex-end',
  },
});
