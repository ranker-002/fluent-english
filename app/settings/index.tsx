import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, resetProgress, progress } = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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
            setShowResetConfirm(false);
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
    options,
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'select' | 'action';
    options?: { label: string; value: string }[];
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
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
          trackColor={{ false: '#2D2D44', true: '#6366F1' }}
          thumbColor="#fff"
        />
      )}
      {type === 'select' && options && (
        <View style={styles.selectContainer}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              style={[
                styles.selectOption,
                settings.preferredAccent === opt.value && styles.selectOptionActive,
              ]}
            >
              <Text style={[
                styles.selectText,
                settings.preferredAccent === opt.value && styles.selectTextActive,
              ]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Learning</Text>
          
          <View style={styles.settingsCard}>
            <SettingItem
              icon="🎯"
              title="Daily Goal"
              subtitle={`${settings.dailyGoal} XP per day`}
              type="action"
            />
            <SettingItem
              icon="🔔"
              title="Notifications"
              subtitle="Practice reminders"
              value={settings.notifications}
              onValueChange={(value) => updateSettings({ notifications: value })}
            />
            <SettingItem
              icon="🔊"
              title="Sound Effects"
              subtitle="Play sounds for actions"
              value={settings.soundEffects}
              onValueChange={(value) => updateSettings({ soundEffects: value })}
            />
            <SettingItem
              icon="📳"
              title="Haptic Feedback"
              subtitle="Vibration on interactions"
              value={settings.hapticFeedback}
              onValueChange={(value) => updateSettings({ hapticFeedback: value })}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Speech</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🗣️</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Preferred Accent</Text>
                <Text style={styles.settingSubtitle}>Text-to-speech voice</Text>
              </View>
            </View>
            <View style={styles.accentOptions}>
              <Pressable
                style={[
                  styles.accentOption,
                  settings.preferredAccent === 'us' && styles.accentOptionActive,
                ]}
                onPress={() => updateSettings({ preferredAccent: 'us' })}
              >
                <Text style={[
                  styles.accentFlag,
                  settings.preferredAccent === 'us' && styles.accentTextActive,
                ]}>🇺🇸</Text>
                <Text style={[
                  styles.accentLabel,
                  settings.preferredAccent === 'us' && styles.accentTextActive,
                ]}>American</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.accentOption,
                  settings.preferredAccent === 'uk' && styles.accentOptionActive,
                ]}
                onPress={() => updateSettings({ preferredAccent: 'uk' })}
              >
                <Text style={[
                  styles.accentFlag,
                  settings.preferredAccent === 'uk' && styles.accentTextActive,
                ]}>🇬🇧</Text>
                <Text style={[
                  styles.accentLabel,
                  settings.preferredAccent === 'uk' && styles.accentTextActive,
                ]}>British</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.accountInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>FL</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>English Learner</Text>
                <Text style={styles.accountLevel}>Level {progress.level}</Text>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.xp}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.lessonsCompleted}</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingsCard}>
            <Pressable style={styles.linkItem}>
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
            <Pressable style={styles.linkItem}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
            <Pressable style={styles.linkItem}>
              <Text style={styles.linkText}>Send Feedback</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
            <Pressable style={styles.linkItem}>
              <Text style={styles.linkText}>Rate the App</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <View style={[styles.settingsCard, styles.dangerCard]}>
            <Pressable 
              style={styles.dangerButton}
              onPress={handleReset}
            >
              <Text style={styles.dangerIcon}>🗑️</Text>
              <View style={styles.dangerInfo}>
                <Text style={styles.dangerTitle}>Reset Progress</Text>
                <Text style={styles.dangerText}>
                  Delete all progress and start fresh
                </Text>
              </View>
              <Text style={styles.dangerArrow}>→</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.version}>Fluent English</Text>
          <Text style={styles.versionNumber}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingEmoji: {
    fontSize: 22,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#2D2D44',
  },
  selectOptionActive: {
    backgroundColor: '#6366F1',
  },
  selectText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  selectTextActive: {
    color: '#fff',
  },
  accentOptions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  accentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#2D2D44',
    gap: 8,
  },
  accentOptionActive: {
    backgroundColor: '#6366F1',
  },
  accentFlag: {
    fontSize: 24,
  },
  accentLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  accentTextActive: {
    color: '#fff',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D44',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  accountLevel: {
    color: '#6366F1',
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
  linkArrow: {
    color: '#6B7280',
    fontSize: 18,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  dangerIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  dangerInfo: {
    flex: 1,
  },
  dangerTitle: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  dangerArrow: {
    color: '#EF4444',
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  version: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionNumber: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
});
