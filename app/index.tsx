import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { Theme } from '../theme';

/**
 * Index screen — entry point that checks onboarding status
 * and redirects accordingly.
 */
export default function IndexScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding, maybeResetDailyGoals } = useStore();

  useEffect(() => {
    // Small delay to ensure store hydration (if using MMKV)
    const timeout = setTimeout(() => {
      maybeResetDailyGoals(); // Reset goals if new day
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [hasCompletedOnboarding, maybeResetDailyGoals]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const);
