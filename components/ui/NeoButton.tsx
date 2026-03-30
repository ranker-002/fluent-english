import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ViewStyle,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../theme';
import { useStore } from '../../store/useStore';

interface NeoButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/**
 * NeoButton — a premium button with gradient, press animation, and haptic feedback.
 * Uses spring animations and gradient fills for a tactile feel.
 */
export function NeoButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  accessibilityLabel,
}: NeoButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { settings } = useStore();

  const handlePressIn = () => {
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...Theme.animation.spring,
    }).start();
  };

  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: Theme.borderRadius.lg,
      overflow: 'hidden',
      opacity: isDisabled ? 0.5 : 1,
    };

    if (fullWidth) {
      base.width = '100%';
    }

    return base;
  };

  const getContentStyle = () => {
    const paddingMap = { sm: 10, md: 16, lg: 20 };
    return {
      paddingVertical: paddingMap[size],
      paddingHorizontal: size === 'lg' ? 28 : 20,
      minHeight: size === 'lg' ? 56 : size === 'sm' ? 36 : 44,
    };
  };

  const getTextColor = () => {
    if (variant === 'ghost') return Theme.colors.text.primary;
    return '#ffffff';
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return Theme.gradients.primary;
      case 'secondary':
        return Theme.gradients.accent;
      case 'accent':
        return [Theme.colors.accent, Theme.colors.accent] as const;
      case 'ghost':
        return ['transparent', 'transparent'] as const;
      default:
        return Theme.gradients.primary;
    }
  };

  const content = (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, getContentStyle()]}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.text, { fontSize: Theme.typography.body.fontSize, color: getTextColor() }]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Animated.View>
  );

  const buttonWrapper = (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.9}
      style={[getButtonStyle(), style]}
      accessibilityLabel={accessibilityLabel}
    >
      {variant === 'ghost' ? (
        <View style={[styles.ghostBg, getContentStyle()]}>
          {content}
        </View>
      ) : (
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getContentStyle()}
        >
          {content}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );

  return buttonWrapper;
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  ghostBg: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
} as const);
