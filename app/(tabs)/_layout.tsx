import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';
import { Theme } from '../../theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, { emoji: string; label: string }> = {
    home: { emoji: '🏠', label: 'Home' },
    practice: { emoji: '🎯', label: 'Practice' },
    explore: { emoji: '🔍', label: 'Explore' },
    profile: { emoji: '👤', label: 'Profile' },
  };

  const icon = icons[name] || { emoji: '•', label: '' };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconEmoji, focused && styles.iconEmojiFocused]}>
        {icon.emoji}
      </Text>
    </View>
  );
}

/**
 * TabLayout — gorgeous glass tab bar with animated indicator.
 */
export default function TabLayout() {
  const pathname = usePathname();
  const { currentStreak } = useStore();

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes('(tabs)')) {
      const tab = pathname.split('/').pop();
      return tab || 'index';
    }
    return 'index';
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: Theme.colors.text.tertiary,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Practice',
            tabBarIcon: ({ focused }) => <TabIcon name="practice" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
          }}
        />
      </Tabs>
      
      {/* Streak indicator as floating pill above tab bar */}
      {currentStreak > 0 && (
        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    height: 85,
    paddingTop: 8,
    paddingBottom: 24,
    backdropFilter: 'blur(20px)', // iOS only; Android solid color fallback
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  iconEmoji: {
    fontSize: 22,
    opacity: 0.7,
  },
  iconEmojiFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  streakPill: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    gap: 4,
    ...Theme.shadows.md,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakNumber: {
    color: Theme.colors.background,
    fontSize: Theme.typography.caption.fontSize,
    fontWeight: '700',
  },
});
