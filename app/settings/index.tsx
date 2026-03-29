import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { Theme } from '../../theme';

/**
 * SettingsScreen — beautifully organized settings sections
 * with smooth animations and clear visual hierarchy.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, resetProgress, progress } = useStore();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your progress, achievements, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgress();
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch',
    onPress,
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'action';
    onPress?: () => void;
  }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
        <Text style={styles.settingEmoji}>{icon}</Text>
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#2D2D44', true: Theme.colors.primary }}
          thumbColor="#fff"
          ios_backgroundColor="#2D2D44"
        />
      )}
      {type === 'action' && (
        <Text style={styles.settingArrow}>→</Text>
      )}
    </Pressable>
  );

  const AccentOption = ({
    value,
    label,
    flag,
    active,
    onSelect,
  }: {
    value: string;
    label: string;
    flag: string;
    active: boolean;
    onSelect: () => void;
  }) => (
    <Pressable
      style={[
        styles.accentOption,
        active && styles.accentOptionActive,
      ]}
      onPress={onSelect}
    >
      <Text style={[
        styles.accentFlag,
        active && styles.accentFlagActive,
      ]}>{flag}</Text>
      <Text style={[
        styles.accentLabel,
        active && styles.accentLabelActive,
      ]}>{label}</Text>
    </Pressable>
  );

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </Animated.View>

        {/* Learning */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Learning</Text>
          
          <GlassCard style={styles.settingsCard} bordered>
            <SettingItem
              icon="🎯"
              title="Daily Goal"
              subtitle={`${settings.dailyGoal} XP per day`}
              type="action"
              onPress={() => {/* TODO: show goal picker */}}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="🔔"
              title="Notifications"
              subtitle="Practice reminders"
              value={settings.notifications}
              onValueChange={(value) => updateSettings({ notifications: value })}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="🔊"
              title="Sound Effects"
              subtitle="Play sounds for actions"
              value={settings.soundEffects}
              onValueChange={(value) => updateSettings({ soundEffects: value })}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="📳"
              title="Haptic Feedback"
              subtitle="Vibration on interactions"
              value={settings.hapticFeedback}
              onValueChange={(value) => updateSettings({ hapticFeedback: value })}
            />
          </GlassCard>
        </Animated.View>

        {/* Speech */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Speech</Text>
          
          <GlassCard style={styles.settingsCard} bordered>
            <View style={styles.labelRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={styles.iconEmoji}>🗣️</Text>
              </View>
              <View style={styles.labelInfo}>
                <Text style={styles.labelTitle}>Preferred Accent</Text>
                <Text style={styles.labelSubtitle}>Text-to-speech voice</Text>
              </View>
            </View>
            <View style={styles.accentOptions}>
              <AccentOption
                value="us"
                label="American"
                flag="🇺🇸"
                active={settings.preferredAccent === 'us'}
                onSelect={() => updateSettings({ preferredAccent: 'us' })}
              />
              <AccentOption
                value="uk"
                label="British"
                flag="🇬🇧"
                active={settings.preferredAccent === 'uk'}
                onSelect={() => updateSettings({ preferredAccent: 'uk' })}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Account */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <GlassCard style={styles.accountCard} bordered>
            <View style={styles.accountInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>FL</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>English Learner</Text>
                <Text style={styles.accountLevel}>Level {progress.level}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.xp.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.lessonsCompleted}</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* About */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <GlassCard style={styles.linksCard} bordered>
            <Pressable style={styles.linkItem}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={styles.iconEmoji}>🔒</Text>
              </View>
              <Text style={styles.linkTitle}>Privacy Policy</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.linkItem}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                <Text style={styles.iconEmoji}>📄</Text>
              </View>
              <Text style={styles.linkTitle}>Terms of Service</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.linkItem}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Text style={styles.iconEmoji}>✉️</Text>
              </View>
              <Text style={styles.linkTitle}>Send Feedback</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.linkItem}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={styles.iconEmoji}>⭐</Text>
              </View>
              <Text style={styles.linkTitle}>Rate the App</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
          </GlassCard>
        </Animated.View>

        {/* Danger */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <GlassCard style={styles.dangerCard} bordered>
            <Pressable 
              style={styles.dangerButton}
              onPress={handleReset}
            >
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Text style={styles.iconEmoji}>🗑️</Text>
              </View>
              <View style={styles.dangerInfo}>
                <Text style={styles.dangerTitle}>Reset Progress</Text>
                <Text style={styles.dangerText}>
                  Delete all progress and start fresh
                </Text>
              </View>
            </Pressable>
          </GlassCard>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>Fluent English</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge + Theme.spacing.lg,
    paddingBottom: Theme.spacing.hugePlus,
  },
  header: {
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.xs,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
  },
  sectionTitle: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.md,
    marginLeft: Theme.spacing.xs,
  },
  settingsCard: {
    padding: Theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  settingItemPressed: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  settingEmoji: {
    fontSize: 22,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  settingArrow: {
    fontSize: 20,
    color: Theme.colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.surfaceBorder,
    marginVertical: 4,
  },
  accentOptions: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  accentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    gap: 6,
  },
  accentOptionActive: {
    backgroundColor: Theme.colors.primary,
  },
  accentFlag: {
    fontSize: 24,
  },
  accentFlagActive: {
    // same, but could add tint if needed
  },
  accentLabel: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontSize: 14,
  },
  accentLabelActive: {
    color: Theme.colors.text.primary,
  },
  accountCard: {
    padding: Theme.spacing.sm,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.gradients.primary[0],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
  },
  accountLevel: {
    ...Theme.typography.caption,
    color: Theme.colors.primary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: 4,
  },
  linksCard: {
    padding: Theme.spacing.sm,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  iconEmoji: {
    fontSize: 20,
  },
  linkTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.primary,
    flex: 1,
  },
  linkArrow: {
    color: Theme.colors.text.tertiary,
    fontSize: 18,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  labelInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  labelTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
  },
  labelSubtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  dangerCard: {
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  dangerInfo: {
    flex: 1,
  },
  dangerTitle: {
    color: Theme.colors.error,
    ...Theme.typography.bodyBold,
  },
  dangerText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  appName: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
  },
  version: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    marginTop: 4,
  },
});
