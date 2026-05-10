import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { palette, fonts } from '../constants/theme';

export const AnimatedLogoText = ({ size = 42, color = palette.iceBlue }) => {
  const text = "Expertly";
  const letters = text.split("");
  
  // Create an array of animated values, one for each letter
  const animatedValues = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = letters.map((_, i) => {
      return Animated.spring(animatedValues[i], {
        toValue: 1,
        tension: 20,
        friction: 5,
        delay: i * 100, // Staggered delay
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {letters.map((letter, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.text,
            {
              fontSize: size,
              color: color,
              opacity: animatedValues[i],
              transform: [
                {
                  translateY: animatedValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
                {
                  scale: animatedValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                }
              ],
            },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.bold,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
});
