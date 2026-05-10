import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useExperts } from '../hooks/useExperts';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { ExpertCard } from '../components/ExpertCard';
import { Carousel } from '../components/Carousel';
import { ListSkeleton } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useAppTheme } from '../context/AppThemeContext';
import { fonts, spacing, typographyStyles } from '../constants/theme';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function ExpertListScreen({ navigation }) {
  const { colors } = useAppTheme();
  const typo = typographyStyles(colors);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    experts,
    category,
    setCategory,
    searchInput,
    setSearchInput,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
    page,
    totalPages,
  } = useExperts();

  const toggleFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFilterOpen(!isFilterOpen);
  };

  const topBar = (
    <View style={styles.topRow}>
      <SearchBar
        value={searchInput}
        onChangeText={setSearchInput}
        onSubmit={() => setSearchInput((s) => s.trim())}
        compact
        containerStyle={styles.searchFlex}
      />
      <TouchableOpacity
        onPress={toggleFilter}
        style={[styles.filterToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Ionicons 
          name={isFilterOpen ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={colors.primary} 
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={[styles.profileBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        hitSlop={8}
        accessibilityLabel="Open profile"
      >
        <Ionicons name="person-circle-outline" size={28} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  if (error && !loading && experts.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.topPad}>{topBar}</View>
        <ErrorState message={error} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.topPad}>{topBar}</View>
      
      {isFilterOpen && (
        <View style={[styles.filterTray, { backgroundColor: colors.surfaceElevated, borderBottomColor: colors.border }]}>
          <Text style={[typo.caption, styles.filterTitle]}>Select Category</Text>
          <FilterBar 
            selected={category} 
            onSelect={(cat) => {
              setCategory(cat);
              // Removed toggleFilter() so it stays open
            }} 
          />
        </View>
      )}

      {loading && experts.length === 0 ? (
        <ListSkeleton />
      ) : (
        <FlatList
          data={experts}
          keyExtractor={(item) => item._id}
          numColumns={1}
          contentContainerStyle={
            experts.length ? styles.listContent : styles.listContentEmpty
          }
          ListHeaderComponent={
            <View>
              <Carousel />
              <View style={styles.listHeaderTitle}>
                <Text style={[typo.title, { fontSize: 18 }]}>{experts.length} experts found</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={56} color={colors.textSecondary} />
              <Text style={[typo.title, styles.emptyTitle]}>No experts yet</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={loading && experts.length > 0}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cell}>
              <ExpertCard
                expert={item}
                onViewProfile={() =>
                  navigation.navigate('ExpertDetail', { expertId: item._id })
                }
              />
            </View>
          )}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={styles.footer}>
                <Text style={[typo.caption, styles.pageHint]}>
                  Page {page} of {totalPages}
                </Text>
                {page < totalPages ? (
                  <TouchableOpacity
                    style={[
                      styles.loadMore,
                      { backgroundColor: colors.surface, borderColor: colors.primary },
                    ]}
                    onPress={loadMore}
                    disabled={loadingMore}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.loadMoreText, { color: colors.primary, fontFamily: fonts.bold }]}>
                      {loadingMore ? 'Loading…' : 'Load more'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  topPad: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchFlex: { flex: 1, marginHorizontal: 0 },
  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTray: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  filterTitle: {
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listHeaderTitle: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  pageHint: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  listContent: { 
    // Removed alignItems: 'center' to allow cards to fill width
  },
  listContentEmpty: { flexGrow: 1, justifyContent: 'center' },
  empty: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: { marginTop: spacing.md, textAlign: 'center' },
  emptySub: {
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  footer: { 
    width: width,
    padding: spacing.lg, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMore: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
    alignItems: 'center',
  },
  loadMoreText: { fontSize: 16 },
});

