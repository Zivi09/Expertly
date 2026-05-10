import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { expertsApi } from '../services/api';
import { getSocket } from '../services/socket';
import { useSocket } from '../hooks/useSocket';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { LoadingSpinner } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing, typographyStyles } from '../constants/theme';

export function ExpertDetailScreen({ route, navigation }) {
  const { expertId } = route.params;
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const { connected } = useSocket();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await expertsApi.getById(expertId);
      setExpert(data);
      const dates = [...new Set((data.availableSlots || []).map((s) => s.date))].sort();
      setSelectedDate(dates[0] || null);
      setSelectedTime(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Could not load expert.');
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    load();
  }, [load]);

  const slots = expert?.availableSlots || [];

  useEffect(() => {
    const socket = getSocket();
    socket.emit('join_expert_room', expertId);
    const onBooked = (payload) => {
      const { date, timeSlot } = payload;
      setExpert((prev) => {
        if (!prev) return prev;
        const nextSlots = prev.availableSlots.map((s) =>
          s.date === date && s.time === timeSlot ? { ...s, isBooked: true } : s
        );
        return { ...prev, availableSlots: nextSlots };
      });
    };
    socket.on('slot_booked', onBooked);
    return () => {
      socket.off('slot_booked', onBooked);
      socket.emit('leave_expert_room', expertId);
    };
  }, [expertId]);

  const canBook = selectedDate && selectedTime;

  const hero = useMemo(() => {
    if (!expert) return null;
    const typo = typographyStyles(colors);
    const stars = Math.round(Number(expert.rating) || 0);
    return (
      <View style={styles.hero}>
        <View style={styles.liveRow}>
          {connected ? (
            <View
              style={[
                styles.liveBadge,
                {
                  backgroundColor: isDark ? 'rgba(80, 200, 120, 0.15)' : 'rgba(80, 200, 120, 0.2)',
                  borderColor: colors.primary,
                },
              ]}
            >
              <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.liveText, { color: colors.primary, fontFamily: fonts.bold }]}>
                Live
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.liveBadge,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.liveTextMuted, { color: colors.textSecondary }]}>
                Connecting…
              </Text>
            </View>
          )}
        </View>
        {expert.avatar ? (
          <Image source={{ uri: expert.avatar }} style={styles.heroAvatar} />
        ) : (
          <View style={[styles.heroAvatarPlaceholder, { backgroundColor: colors.secondary }]}>
            <Text style={styles.heroInitials}>
              {expert.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={[typo.title, styles.heroName]}>{expert.name}</Text>
        <View style={[styles.catChip, { backgroundColor: colors.primaryMuted }]}>
          <Text style={[styles.catChipText, { color: colors.secondary, fontFamily: fonts.bold }]}>
            {expert.category}
          </Text>
        </View>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= stars ? 'star' : 'star-outline'}
              size={18}
              color={i <= stars ? colors.star : colors.disabled}
            />
          ))}
          <Text style={[styles.ratingNum, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
            {Number(expert.rating).toFixed(1)}
          </Text>
          <Text style={[styles.exp, { color: colors.textSecondary }]}> · {expert.experience} yrs exp</Text>
        </View>
      </View>
    );
  }, [expert, connected, colors, isDark]);

  const fabBottomPad = Math.max(insets.bottom, spacing.md);

  if (loading && !expert) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error && !expert) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <ErrorState message={error} onRetry={load} />
      </SafeAreaView>
    );
  }

  const typo = typographyStyles(colors);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.secondary} />
          <Text style={[styles.backText, { color: colors.secondary, fontFamily: fonts.bold }]}>Back</Text>
        </TouchableOpacity>
        {hero}
        <View style={styles.section}>
          <Text style={[typo.title, styles.sectionTitle]}>About</Text>
          <Text style={[typo.body, styles.bio, { color: colors.textSecondary }]}>
            {expert.bio || 'No bio yet.'}
          </Text>
        </View>
        <View style={styles.section}>
          <TimeSlotPicker
            slots={slots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setSelectedTime(null);
            }}
            onSelectTime={setSelectedTime}
          />
        </View>
      </ScrollView>
      <View
        style={[
          styles.fabWrap,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: fabBottomPad,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!canBook}
          onPress={() =>
            navigation.navigate('Booking', {
              expert,
              date: selectedDate,
              timeSlot: selectedTime,
            })
          }
        >
          <LinearGradient
            colors={
              canBook ? [colors.primary, colors.gradientEnd] : [colors.disabled, colors.disabled]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Text style={[styles.fabText, { color: canBook ? colors.ctaText : colors.textSecondary, fontFamily: fonts.bold }]}>
              Book Now
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 120 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backText: { fontSize: 16 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  liveRow: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: { fontSize: 12 },
  liveTextMuted: { fontSize: 12, fontFamily: fonts.semibold },
  heroAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    marginBottom: spacing.md,
  },
  heroAvatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroInitials: { color: '#fff', fontSize: 36, fontFamily: fonts.bold },
  heroName: { fontSize: 24, textAlign: 'center' },
  catChip: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  catChipText: { fontSize: 13 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ratingNum: { marginLeft: 6, fontSize: 16 },
  exp: { fontFamily: fonts.semibold, fontSize: 14 },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: { fontSize: 18, marginBottom: spacing.sm },
  bio: { lineHeight: 22 },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fab: {
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  fabText: { fontSize: 17 },
});
