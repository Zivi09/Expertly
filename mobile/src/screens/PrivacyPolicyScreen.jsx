import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, spacing, typographyStyles } from '../constants/theme';

export function PrivacyPolicyScreen({ navigation }) {
  const { colors } = useAppTheme();
  const typo = typographyStyles(colors);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
          Privacy Policy
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typo.title, styles.sectionHeader]}>1. Data Collection</Text>
        <Text style={[typo.body, styles.para]}>
          We collect information you provide directly to us when you book a session, such as your name, email address, and phone number. This is necessary to facilitate the booking and send confirmations.
        </Text>

        <Text style={[typo.title, styles.sectionHeader]}>2. How We Use Data</Text>
        <Text style={[typo.body, styles.para]}>
          Your data is used solely to manage your bookings, communicate session details via email (SMTP), and improve our application performance. We do not sell your personal information to third parties.
        </Text>

        <Text style={[typo.title, styles.sectionHeader]}>3. Data Security</Text>
        <Text style={[typo.body, styles.para]}>
          We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </Text>

        <Text style={[typo.title, styles.sectionHeader]}>4. Your Rights</Text>
        <Text style={[typo.body, styles.para]}>
          You have the right to access, update, or delete your personal information at any time by contacting our support team via the feedback section in your profile.
        </Text>

        <Text style={[typo.caption, styles.footer]}>
          Last updated: May 10, 2026. This policy may be updated periodically to reflect changes in our practices.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { padding: spacing.sm },
  headerTitle: { fontSize: 18 },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionHeader: { fontSize: 18, marginTop: spacing.md, marginBottom: spacing.xs },
  para: { marginBottom: spacing.md, lineHeight: 24, opacity: 0.8 },
  footer: { marginTop: spacing.lg, opacity: 0.6, fontStyle: 'italic' },
});
