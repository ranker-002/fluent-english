import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'success' | 'accent';
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/**
 * ProgressBar — a gorgeous gradient progress indicator with smooth animations.
 */
export function ProgressBar({
  progress,
  variant = 'default',
  height = 8,
  animated = true,
  showLabel = false,
  style,
  accessibilityLabel,
}: ProgressBarProps) {
  const animProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.spring(animProgress, {
        toValue: progress,
        ...Theme.animation.spring,
      }).start();
    } else {
      animProgress.setValue(progress);
    }
  }, [progress]);

  const animatedStyle = {
    width: animProgress.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  const getColors = () => {
    switch (variant) {
      case 'success':
        return Theme.gradients.success;
      case 'accent':
        return [Theme.colors.accent, Theme.colors.accent];
      default:
        return Theme.gradients.primary;
    }
  };

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }}
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2, backgroundColor: Theme.colors.surfaceBorder },
        ]}
      >
        <Animated.View style={[styles.fill, { height, borderRadius: height / 2 }, animatedStyle]}>
          <LinearGradient
            colors={getColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradientFill, { height }]}
          />
        </Animated.View>
      </View>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    maxWidth: '100%',
  },
  gradientFill: {
    width: '100%',
  },
  labelContainer: {
    marginTop: 6,
    alignItems: 'flex-end',
  },
  label: {
    color: Theme.colors.text.secondary,
    fontSize: Theme.typography.caption.fontSize,
    fontWeight: '500',
  },
});
