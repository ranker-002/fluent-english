import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

/**
 * AnimatedBackground — creates a rich, atmospheric background with moving gradient orbs.
 * Adds depth and a premium feel to any screen.
 */
export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const orb1Y = useRef(new Animated.Value(0)).current;
  const orb2Y = useRef(new Animated.Value(0)).current;
  const orb3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const anim1 = animate(orb1Y, 8000, 0);
    const anim2 = animate(orb2Y, 10000, 2000);
    const anim3 = animate(orb3Y, 12000, 4000);

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const orb1Style = {
    transform: [
      {
        translateY: orb1Y.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  };

  const orb2Style = {
    transform: [
      {
        translateY: orb2Y.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 120],
        }),
      },
    ],
  };

  const orb3Style = {
    transform: [
      {
        translateY: orb3Y.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Theme.gradients.mesh}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Subtle moving orbs for depth */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]} pointerEvents="none">
        <LinearGradient
          colors={[Theme.colors.primary + '40', Theme.colors.primary + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb2, orb2Style]} pointerEvents="none">
        <LinearGradient
          colors={[Theme.colors.secondary + '30', Theme.colors.secondary + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb3, orb3Style]} pointerEvents="none">
        <LinearGradient
          colors={[Theme.colors.accentPink + '30', Theme.colors.accentPink + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.orbGradient}
        />
      </Animated.View>

      {/* Subtle grain texture overlay */}
      <View style={styles.grain} pointerEvents="none" />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  orb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.6,
  },
  orb1: {
    top: -width * 0.3,
    left: -width * 0.2,
  },
  orb2: {
    bottom: -width * 0.4,
    right: -width * 0.15,
  },
  orb3: {
    top: '40%',
    left: '-10%',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
  },
  orbGradient: {
    flex: 1,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    // Note: RN doesn't support SVG data URIs in backgroundColor natively; this is a placeholder.
    // Actual grain would require an Image component with a base64 noise texture.
  },
});
