import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, colors } from '../constants/theme';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - spacing.md * 2;
const ITEM_HEIGHT = CAROUSEL_WIDTH / 1.6;

const IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&h=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&h=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1454165833767-02a9e406f06d?q=80&w=1200&h=800&auto=format&fit=crop',
];

export const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < IMAGES.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setActiveIndex(index);
    }
  };

  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.root}>
      {/* Previous Trigger */}
      <TouchableOpacity
        style={[styles.trigger, styles.prevTrigger, activeIndex === 0 && styles.disabled]}
        onPress={() => scrollToIndex(activeIndex - 1)}
        disabled={activeIndex === 0}
      >
        <Ionicons name="chevron-back" size={20} color="#667085" />
      </TouchableOpacity>

      {/* Next Trigger */}
      <TouchableOpacity
        style={[styles.trigger, styles.nextTrigger, activeIndex === IMAGES.length - 1 && styles.disabled]}
        onPress={() => scrollToIndex(activeIndex + 1)}
        disabled={activeIndex === IMAGES.length - 1}
      >
        <Ionicons name="chevron-forward" size={20} color="#667085" />
      </TouchableOpacity>

      {/* Indicators */}
      <View style={styles.indicatorContainer}>
        {IMAGES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={IMAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    height: ITEM_HEIGHT,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  item: {
    width: CAROUSEL_WIDTH,
    height: ITEM_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trigger: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  prevTrigger: {
    left: 16,
  },
  nextTrigger: {
    right: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 8,
  },
});
