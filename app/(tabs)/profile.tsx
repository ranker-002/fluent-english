import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Theme } from '../../theme';

/**
 * ProfileScreen — a beautiful, personal dashboard with stats,
 * achievements, and quick access to settings.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { progress, lessons, flashcards, achievements, currentStreak, resetProgress } = useStore();

  const completedLessons = lessons.filter(l => l.completed).length;
  const masteredWords = flashcards.filter(c => c.mastered).length;
  const totalLessons = lessons.length;
  const totalWords = flashcards.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
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

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <GlassCard gradient style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>FL</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lvl {progress.level}</Text>
            </View>
          </View>
          <Text style={styles.userName}>English Learner</Text>
          <Text style={styles.userSubtitle}>Keep learning every day!</Text>
          
          <View style={styles.streakPill}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{currentStreak} day streak</Text>
          </View>
        </GlassCard>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <GlassCard style={styles.statsCard} bordered>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.xp.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.level}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unlockedAchievements}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Learning Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          <View style={styles.progressGroup}>
            <GlassCard style={styles.progressCard} bordered>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressLabel}>Lessons Completed</Text>
                  <Text style={styles.progressCount}>
                    {completedLessons} / {totalLessons}
                  </Text>
                </View>
                <ProgressBar 
                  progress={totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0} 
                  variant="success"
                  height={6}
                  animated
                  style={styles.progressBar}
                />
              </View>
            </GlassCard>

            <GlassCard style={styles.progressCard} bordered>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressLabel}>Words Mastered</Text>
                  <Text style={styles.progressCount}>
                    {masteredWords} / {totalWords}
                  </Text>
                </View>
                <ProgressBar 
                  progress={totalWords > 0 ? (masteredWords / totalWords) * 100 : 0} 
                  variant="accent"
                  height={6}
                  animated
                  style={styles.progressBar}
                />
              </View>
            </GlassCard>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <GlassCard style={styles.achievementsCard} bordered>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View 
                  key={achievement.id} 
                  style={[
                    styles.achievementItem,
                    achievement.unlocked && styles.achievementItemUnlocked,
                  ]}
                >
                  <Text style={[
                    styles.achievementEmoji,
                    !achievement.unlocked && styles.achievementEmojiLocked,
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked && styles.achievementTitleUnlocked,
                  ]} numberOfLines={2}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDesc}>
                    {achievement.description}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          
          <View style={styles.linksGrid}>
            <Pressable
              style={styles.linkWrapper}
              onPress={() => router.push('/analytics')}
            >
              <GlassCard style={styles.linkCard}>
                <View style={[styles.linkIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                  <Text style={styles.linkEmoji}>📊</Text>
                </View>
                <Text style={styles.linkTitle}>Analytics</Text>
              </GlassCard>
            </Pressable>

            <Pressable
              style={styles.linkWrapper}
              onPress={() => router.push('/settings')}
            >
              <GlassCard style={styles.linkCard}>
                <View style={[styles.linkIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                  <Text style={styles.linkEmoji}>⚙️</Text>
                </View>
                <Text style={styles.linkTitle}>Settings</Text>
              </GlassCard>
            </Pressable>

            <Pressable
              style={styles.linkWrapper}
              onPress={() => router.push('/learning')}
            >
              <GlassCard style={styles.linkCard}>
                <View style={[styles.linkIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Text style={styles.linkEmoji}>📚</Text>
                </View>
                <Text style={styles.linkTitle}>All Lessons</Text>
              </GlassCard>
            </Pressable>

            <Pressable
              style={styles.linkWrapper}
              onPress={() => router.push('/conversation')}
            >
              <GlassCard style={styles.linkCard}>
                <View style={[styles.linkIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <Text style={styles.linkEmoji}>💬</Text>
                </View>
                <Text style={styles.linkTitle}>Conversation</Text>
              </GlassCard>
            </Pressable>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Theme.colors.error }]}>Danger Zone</Text>
          
          <NeoButton
            title="Reset All Progress"
            onPress={handleResetProgress}
            variant="ghost"
            fullWidth
            style={styles.resetButton}
            accessibilityLabel="Reset all progress permanently"
          />
        </View>

        <Text style={styles.version}>Fluent English v1.0.0</Text>
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
  profileCard: {
    alignItems: 'center',
    padding: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.gradients.primary[0],
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.lg,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.md,
  },
  levelText: {
    color: '#fff',
    fontSize: Theme.typography.overline.fontSize,
    fontWeight: '700',
  },
  userName: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  userSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.md,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    gap: Theme.spacing.sm,
  },
  streakEmoji: {
    fontSize: 18,
  },
  streakText: {
    color: Theme.colors.background,
    ...Theme.typography.bodyBold,
  },
  statsSection: {
    marginBottom: Theme.spacing.xxl,
  },
  statsCard: {
    padding: Theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Theme.colors.surfaceBorder,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
  },
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  progressGroup: {
    gap: Theme.spacing.md,
  },
  progressCard: {
    padding: Theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.lg,
  },
  progressLabel: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  progressCount: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
  },
  progressBar: {
    flex: 1,
  },
  achievementsCard: {
    padding: Theme.spacing.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  achievementItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.sm,
    opacity: 0.5,
  },
  achievementItemUnlocked: {
    opacity: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  achievementEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  achievementEmojiLocked: {
    opacity: 0.4,
  },
  achievementTitle: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    fontSize: 10,
    textAlign: 'center',
  },
  achievementTitleUnlocked: {
    color: Theme.colors.text.primary,
  },
  achievementDesc: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  linkWrapper: {
    width: '47%',
  },
  linkCard: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  linkIcon: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  linkEmoji: {
    fontSize: 28,
  },
  linkTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 15,
  },
  resetButton: {
    marginTop: Theme.spacing.sm,
  },
  version: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.lg,
  },
});
