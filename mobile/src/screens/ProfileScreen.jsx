import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  TextInput,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing, typographyStyles } from '../constants/theme';

const SUPPORT_EMAIL = 'support@example.com';

function MenuRow({ icon, label, onPress, colors, endAdornment }) {
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={22} color={colors.secondary} style={styles.rowIcon} />
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      {endAdornment !== undefined ? (
        endAdornment
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export function ProfileScreen({ navigation }) {
  const { colors, isDark, setMode } = useAppTheme();
  const typo = typographyStyles(colors);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const openMail = async (subject, body) => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else
        Alert.alert(
          'Email',
          `Send to ${SUPPORT_EMAIL}\n\nSubject: ${subject}\n\n${body}`,
          [{ text: 'OK' }]
        );
    } catch {
      Alert.alert('Could not open mail app', `Email ${SUPPORT_EMAIL}`);
    }
  };

  const submitComplaint = () => {
    if (!complaintText.trim()) {
      Alert.alert('Required', 'Please describe your complaint.');
      return;
    }
    setComplaintOpen(false);
    openMail('Complaint report', complaintText.trim());
    setComplaintText('');
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Required', 'Please enter your feedback.');
      return;
    }
    setFeedbackOpen(false);
    openMail('App feedback', feedbackText.trim());
    setFeedbackText('');
  };

  const onRateApp = async () => {
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
        return;
      }
    } catch {
      /* fall through */
    }
    Alert.alert(
      'Rate the app',
      'In-app ratings appear when the app is published to the store. Thank you for your support.'
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
          Profile
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: fonts.semibold }]}>
            Appearance
          </Text>
          <View style={[styles.row, { borderBottomWidth: 0, paddingVertical: spacing.sm }]}>
            <Ionicons name="moon-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Dark theme</Text>
            <Switch
              value={isDark}
              onValueChange={(v) => setMode(v ? 'dark' : 'light')}
              trackColor={{ false: colors.disabled, true: colors.primaryMuted }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: fonts.semibold }]}>
            Support
          </Text>
          <MenuRow
            icon="star-outline"
            label="Rate the app"
            onPress={onRateApp}
            colors={colors}
            endAdornment={null}
          />
          <MenuRow
            icon="document-text-outline"
            label="Privacy policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
            colors={colors}
          />
          <MenuRow
            icon="bug-outline"
            label="Report an issue"
            onPress={() => setComplaintOpen(true)}
            colors={colors}
          />
          <MenuRow
            icon="warning-outline"
            label="Report a complaint"
            onPress={() => setComplaintOpen(true)}
            colors={colors}
          />
          <MenuRow
            icon="chatbubble-ellipses-outline"
            label="Feedback"
            onPress={() => setFeedbackOpen(true)}
            colors={colors}
          />
        </View>

        <Text style={[typo.caption, styles.footerNote, { textAlign: 'center' }]}>
          Support email: {SUPPORT_EMAIL}
        </Text>
      </ScrollView>

      <Modal visible={complaintOpen} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[typo.title, { fontSize: 18 }]}>Report a complaint</Text>
            <Text style={[typo.caption, { marginTop: spacing.sm }]}>
              Describe the issue. This will open your email app to send us a message.
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="What went wrong?"
              placeholderTextColor={colors.textSecondary}
              value={complaintText}
              onChangeText={setComplaintText}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setComplaintOpen(false)} style={styles.modalBtnGhost}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitComplaint}
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: colors.ctaText, fontFamily: fonts.bold }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={feedbackOpen} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[typo.title, { fontSize: 18 }]}>Feedback</Text>
            <Text style={[typo.caption, { marginTop: spacing.sm }]}>
              Tell us what we can improve. We read every message.
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Your feedback…"
              placeholderTextColor={colors.textSecondary}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setFeedbackOpen(false)} style={styles.modalBtnGhost}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitFeedback}
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: colors.ctaText, fontFamily: fonts.bold }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: { marginRight: spacing.md },
  rowLabel: { flex: 1, fontSize: 16, fontFamily: fonts.regular },
  footerNote: { marginTop: spacing.md, paddingHorizontal: spacing.lg },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    borderRadius: radius.md,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  input: {
    marginTop: spacing.md,
    minHeight: 120,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: fonts.regular,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalBtnGhost: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  modalBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
});
