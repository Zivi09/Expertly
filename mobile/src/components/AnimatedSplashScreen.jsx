import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { palette } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const AnimatedSplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Finish after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[palette.navy, '#010E3A', '#02185C']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative blurred circles for aesthetic */}
      <View style={[styles.circle, { top: -50, right: -50, width: 200, height: 200, opacity: 0.2 }]} />
      <View style={[styles.circle, { bottom: 100, left: -100, width: 300, height: 300, opacity: 0.1 }]} />

      <Animated.View style={[
        styles.logoContainer,
        { 
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim }
          ] 
        }
      ]}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.logoShadow} />
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.loadingBarContainer}>
          <Animated.View style={[
            styles.loadingBar, 
            { 
              transform: [
                { translateX: -width * 0.3 }, // Move to start (center is default)
                { scaleX: fadeAnim }, // Scale from 0 to 1
                { translateX: width * 0.3 }  // Move back
              ] 
            }
          ]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.navy,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
    zIndex: 2,
  },
  logoShadow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.sapphire,
    opacity: 0.3,
    bottom: -10,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: palette.sapphire,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    width: '60%',
    alignItems: 'center',
  },
  loadingBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    width: '100%',
    backgroundColor: palette.iceBlue,
  },
});
