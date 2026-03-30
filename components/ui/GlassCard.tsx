import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gradient?: boolean;
  bordered?: boolean;
  glow?: boolean;
}

/**
 * GlassCard — a beautiful, frosted glass surface with optional gradient border and glow.
 * Uses a subtle gradient background and a thin border for depth without blur.
 */
export function GlassCard({ 
  children, 
  style, 
  gradient = false, 
  bordered = true,
  glow = false 
}: GlassCardProps) {
  const cardStyle = [
    styles.base,
    bordered && styles.bordered,
    glow && styles.glow,
    style,
  ] as StyleProp<ViewStyle>[];

  if (gradient) {
    return (
      <LinearGradient
        colors={Theme.gradients.surface}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyle}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: Theme.colors.surfaceBorder,
    // Subtle inner shadow effect via gradient overlay would be nice but we avoid extra layers
  },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.colors.surfaceBorder,
  },
  glow: {
    ...Theme.shadows.glow,
  },
} as const);
