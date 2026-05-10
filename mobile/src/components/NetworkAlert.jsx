import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fonts } from '../constants/theme';

export const NetworkAlert = ({ visible }) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.alert}>
        <Ionicons name="warning" color="#DC2626" size={24} style={styles.icon} />
        <View style={styles.content}>
          <Text style={styles.title}>Network connection lost</Text>
          <Text style={styles.description}>
            Please connect to the internet to continue using the app or to confirm your booking.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
    elevation: 10,
  },
  alert: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#991B1B',
    fontFamily: fonts.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#B91C1C',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});
