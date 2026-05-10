import { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, radius, spacing, typographyStyles, cardShadow, palette } from '../constants/theme';

function initials(name) {
  return (
    String(name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || '?'
  );
}

const AVATAR_HUES = [palette.emerald, palette.royal, '#2A9D6F', '#248F5D', palette.darkEvergreen];

export const ExpertCard = memo(({ expert, onViewProfile }) => {
  const { colors, isDark } = useAppTheme();
  const typo = typographyStyles(colors);
  const shadow = useMemo(() => cardShadow(colors, isDark), [colors, isDark]);

  const hue = AVATAR_HUES[(expert.name || '').length % AVATAR_HUES.length];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, shadow]}>
      {/* Top Section: Avatar, Name, Category */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {expert.avatar ? (
            <Image source={{ uri: expert.avatar }} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: hue }]}>
              <Text style={styles.avatarText}>{initials(expert.name)}</Text>
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FF5722" />
          </View>
        </View>

        <View style={styles.headerMeta}>
          <Text style={[typo.title, styles.name]} numberOfLines={1}>
            {expert.name}
          </Text>
          <Text style={[typo.subtitle, styles.titleText]}>
            {expert.bio || 'Expert Consultant'}
          </Text>
        </View>

        <View style={[styles.categoryBadge, { backgroundColor: 'rgba(80, 200, 120, 0.15)' }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {expert.category}
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={[styles.statsRow, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
        <View style={styles.statItem}>
          <View style={styles.statIconRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{Number(expert.rating).toFixed(1)}</Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <View style={styles.statIconRow}>
            <Ionicons name="briefcase" size={14} color="#A0522D" />
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{expert.experience}y</Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Experience</Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <View style={styles.statIconRow}>
            <Ionicons name="cash" size={14} color="#FFD700" />
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>${expert.price || 50}</Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Per Hour</Text>
        </View>
      </View>

      {/* Skills Row */}
      <View style={styles.skillsRow}>
        {(expert.skills || []).slice(0, 3).map((skill, idx) => (
          <View key={idx} style={[styles.skillChip, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
            <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
          </View>
        ))}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.sessionCount}>
          <Ionicons name="locate" size={16} color="#FF5252" />
          <Text style={[styles.sessionText, { color: colors.textSecondary }]}>
            {expert.sessionsCount || 0} sessions
          </Text>
        </View>

        <TouchableOpacity onPress={onViewProfile} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF5722', '#F44336']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookBtn}
          >
            <Text style={[styles.bookBtnText, { color: '#fff' }]}>Book Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 1,
  },
  headerMeta: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  titleText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    opacity: 0.3,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionText: {
    fontSize: 14,
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  avatarText: { color: '#fff', fontFamily: fonts.bold, fontSize: 18 },
});

