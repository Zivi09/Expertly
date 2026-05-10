import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import { bookingsApi } from '../services/api';
import { getSocket } from '../services/socket';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import {
  isValidEmail,
  isTenDigitPhone,
  normalizePhone,
} from '../utils/validators';
import { useAppTheme } from '../context/AppThemeContext';
import { useNetwork } from '../context/NetworkContext';
import { fonts, radius, spacing, typographyStyles, cardShadow } from '../constants/theme';

export function BookingScreen({ route, navigation }) {
  const { expert, date, timeSlot } = route.params;
  const { colors, isDark } = useAppTheme();
  const { isConnected } = useNetwork();
  const typo = typographyStyles(colors);
  const cardSh = useMemo(() => cardShadow(colors, isDark), [colors, isDark]);

  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const scale = useState(() => new Animated.Value(0))[0];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', phone: '', notes: '' },
  });

  const onSubmit = async (values) => {
    if (!isConnected) {
      setSubmitError('No internet connection. Please connect and try again.');
      return;
    }
    setSubmitError(null);
    try {
      const { data } = await bookingsApi.create({
        expertId: expert._id,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: normalizePhone(values.phone),
        date,
        timeSlot,
        notes: values.notes?.trim() || '',
      });
      setBooking(data);
      setSuccess(true);
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
      const socket = getSocket();
      socket.emit('new_booking', {
        expertId: expert._id,
        date,
        timeSlot,
      });
    } catch (e) {
      const msg =
        e.response?.data?.error || e.message || 'Booking failed. Please try again.';
      setSubmitError(msg);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[typo.title, styles.header]}>Complete Your Booking</Text>
        {!success ? (
          <>
            <View
              style={[
                styles.summary,
                { backgroundColor: colors.surface },
                cardSh,
              ]}
            >
              <Text style={[styles.summaryTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                Session summary
              </Text>
              <Text style={[typo.body, styles.summaryLine]}>
                <Text style={{ fontFamily: fonts.bold }}>Expert: </Text>
                {expert.name}
              </Text>
              <Text style={[typo.body, styles.summaryLine]}>
                <Text style={{ fontFamily: fonts.bold }}>Date: </Text>
                {date}
              </Text>
              <Text style={[typo.body, styles.summaryLine]}>
                <Text style={{ fontFamily: fonts.bold }}>Time: </Text>
                {timeSlot}
              </Text>
            </View>

            <Controller
              control={control}
              name="name"
              rules={{ required: 'Full name is required.' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FloatingLabelInput
                  label="Full Name *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required.',
                validate: (v) => isValidEmail(v) || 'Enter a valid email address.',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FloatingLabelInput
                  label="Email Address *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              rules={{
                required: 'Phone number is required.',
                validate: (v) => isTenDigitPhone(v) || 'Enter a valid 10-digit phone number.',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FloatingLabelInput
                  label="Phone Number *"
                  value={value}
                  onChangeText={(t) => onChange(normalizePhone(t))}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={errors.phone?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <FloatingLabelInput
                  label="Notes / Message (optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  error={errors.notes?.message}
                />
              )}
            />

            <View
              style={[
                styles.readonlyBlock,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[typo.caption, { fontFamily: fonts.bold, marginBottom: 4 }]}>Date</Text>
              <Text style={[typo.body, { fontFamily: fonts.semibold }]}>{date}</Text>
            </View>
            <View
              style={[
                styles.readonlyBlock,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[typo.caption, { fontFamily: fonts.bold, marginBottom: 4 }]}>
                Time slot
              </Text>
              <Text style={[typo.body, { fontFamily: fonts.semibold }]}>{timeSlot}</Text>
            </View>

            {submitError ? (
              <Text style={[styles.formError, { color: colors.error, fontFamily: fonts.semibold }]}>
                {submitError}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.9}
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            >
              <LinearGradient
                colors={[colors.primary, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.confirm}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.ctaText} />
                ) : (
                  <Text style={[styles.confirmText, { color: colors.ctaText, fontFamily: fonts.bold }]}>
                    Confirm Booking
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View style={{ transform: [{ scale }] }}>
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>✅</Text>
              <Text style={[typo.title, styles.successTitle]}>Booking Confirmed! 🎉</Text>
              <Text style={[typo.subtitle, styles.successSub]}>
                You’re all set. We’ve reserved your slot with {expert.name}.
              </Text>
              <View
                style={[
                  styles.summary,
                  { backgroundColor: colors.surface, marginTop: spacing.md },
                  cardSh,
                ]}
              >
                <Text style={[styles.summaryTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                  Booking details
                </Text>
                <Text style={[typo.body, styles.summaryLine]}>{booking?.name}</Text>
                <Text style={[typo.body, styles.summaryLine]}>{booking?.email}</Text>
                <Text style={[typo.body, styles.summaryLine]}>
                  {booking?.date} · {booking?.timeSlot}
                </Text>
                <Text style={[typo.body, styles.summaryLine]}>Status: {booking?.status}</Text>
              </View>
              <TouchableOpacity
                style={[styles.secondaryBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.getParent()?.navigate('MyBookings')}
              >
                <Text style={[styles.secondaryBtnText, { color: colors.ctaText, fontFamily: fonts.bold }]}>
                  View My Bookings
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { fontSize: 22, marginBottom: spacing.md },
  summary: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: { fontSize: 16, marginBottom: spacing.sm },
  summaryLine: { marginBottom: 4 },
  readonlyBlock: {
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  formError: {
    marginBottom: spacing.md,
  },
  confirm: {
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  confirmText: { fontSize: 17 },
  successCard: { alignItems: 'center', paddingVertical: spacing.lg },
  successEmoji: { fontSize: 56, marginBottom: spacing.sm },
  successTitle: {
    fontSize: 22,
    textAlign: 'center',
  },
  successSub: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  secondaryBtn: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  secondaryBtnText: { fontSize: 16 },
});
