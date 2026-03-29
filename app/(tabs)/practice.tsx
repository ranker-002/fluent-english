import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Theme } from '../../theme';

/**
 * PracticeScreen — a focused dashboard for daily practice
 * with quick access to all practice modes and goal tracking.
 */
export default function PracticeScreen() {
  const router = useRouter();
  const { lessons, flashcards, progress, settings } = useStore();

  const completedLessons = lessons.filter(l => l.completed).length;
  const masteredWords = flashcards.filter(c => c.mastered).length;
  const totalWords = flashcards.length;

  const practiceModes = [
    {
      id: 'flashcards',
      title: 'Flashcard Review',
      description: 'Master vocabulary with spaced repetition',
      emoji: '🃏',
      accent: Theme.colors.primary,
      bg: 'rgba(99, 102, 241, 0.2)',
      route: '/learning/flashcard',
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      description: 'Practice speaking and get feedback',
      emoji: '🎤',
      accent: Theme.colors.accentPink,
      bg: 'rgba(236, 72, 153, 0.2)',
      route: '/pronunciation',
    },
    {
      id: 'conversation',
      title: 'Conversations',
      description: 'Practice real-world dialogues',
      emoji: '💬',
      accent: Theme.colors.success,
      bg: 'rgba(16, 185, 129, 0.2)',
      route: '/conversation',
    },
    {
      id: 'grammar',
      title: 'Grammar Lessons',
      description: 'Learn essential grammar rules',
      emoji: '📖',
      accent: Theme.colors.accent,
      bg: 'rgba(245, 158, 11, 0.2)',
      route: '/grammar',
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Expand your word bank',
      emoji: '📚',
      accent: Theme.colors.secondary,
      bg: 'rgba(6, 182, 212, 0.2)',
      route: '/vocabulary',
    },
  ];

  const todayIntention = settings.dailyGoal || 15;
  // Simulate daily goal progress (in real app, would track per-day)
  const lessonsToday = Math.min(completedLessons, todayIntention);
  const speakingDone = 1; // placeholder
  const streakGood = progress.streak > 0;

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Improve your skills</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <GlassCard style={styles.statsCard} bordered>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedLessons}</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{masteredWords}/{totalWords}</Text>
                <Text style={styles.statLabel}>Words</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Theme.colors.accent }]}>
                  {progress.streak}
                </Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Practice Modes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Modes</Text>
          
          <View style={styles.modesList}>
            {practiceModes.map((mode) => (
              <Pressable
                key={mode.id}
                onPress={() => router.push(mode.route)}
                accessibilityRole="button"
                accessibilityLabel={`Start ${mode.title}`}
                style={({ pressed }) => [
                  styles.modeWrapper,
                  pressed && styles.modeWrapperPressed,
                ]}
              >
                <GlassCard style={styles.modeCard} gradient>
                  <View style={styles.modeRow}>
                    <View style={[styles.modeIcon, { backgroundColor: mode.bg }]}>
                      <Text style={styles.modeEmoji}>{mode.emoji}</Text>
                    </View>
                    <View style={styles.modeInfo}>
                      <Text style={styles.modeTitle}>{mode.title}</Text>
                      <Text style={styles.modeDesc}>{mode.description}</Text>
                    </View>
                    <Text style={styles.modeArrow}>→</Text>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Daily Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          
          <GlassCard style={styles.goalsCard} bordered>
            <View style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                <Text style={styles.goalEmoji}>📚</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Complete Lessons</Text>
                <Text style={styles.goalSubtitle}>
                  {lessonsToday} of {todayIntention} lessons
                </Text>
                <ProgressBar 
                  progress={(lessonsToday / todayIntention) * 100} 
                  variant="primary"
                  height={4}
                  animated
                  style={styles.goalProgress}
                />
              </View>
              {lessonsToday >= todayIntention ? (
                <View style={styles.goalComplete}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              ) : (
                <View style={styles.goalPending}>
                  <Text style={styles.pendingText}>{todayIntention - lessonsToday} left</Text>
                </View>
              )}
            </View>

            <View style={styles.goalDivider} />

            <View style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={styles.goalEmoji}>🗣️</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Practice Speaking</Text>
                <Text style={styles.goalSubtitle}>
                  Record your voice today
                </Text>
              </View>
              {speakingDone > 0 ? (
                <View style={styles.goalComplete}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              ) : (
                <NeoButton
                  title="Start"
                  onPress={() => router.push('/pronunciation')}
                  variant="primary"
                  size="sm"
                />
              )}
            </View>

            <View style={styles.goalDivider} />

            <View style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={styles.goalEmoji}>🔥</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maintain Streak</Text>
                <Text style={styles.goalSubtitle}>
                  {progress.streak} consecutive days
                </Text>
              </View>
              {streakGood ? (
                <View style={styles.goalComplete}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              ) : (
                <View style={styles.goalPending}>
                  <Text style={styles.pendingText}>Practice now</Text>
                </View>
              )}
            </View>
          </GlassCard>
        </View>

        {/* CTA */}
        <NeoButton
          title="Quick Review Session"
          onPress={() => router.push('/learning/flashcard')}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.ctaButton}
          icon={<Text style={styles.ctaEmoji}>⚡</Text>}
          iconPosition="left"
        />

        <View style={styles.bottomSpacer} />
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
    marginBottom: Theme.spacing.xl,
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  statsSection: {
    marginBottom: Theme.spacing.xxl,
  },
  statsCard: {
    padding: Theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
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
  modesList: {
    gap: Theme.spacing.md,
  },
  modeWrapper: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  modeWrapperPressed: {
    opacity: 0.95,
  },
  modeCard: {
    padding: 0,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  modeEmoji: {
    fontSize: 26,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
    marginBottom: 4,
  },
  modeDesc: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  modeArrow: {
    fontSize: 24,
    color: Theme.colors.primary,
  },
  goalsCard: {
    padding: Theme.spacing.lg,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  goalDivider: {
    height: 1,
    backgroundColor: Theme.colors.surfaceBorder,
    marginVertical: Theme.spacing.sm,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  goalSubtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
  goalProgress: {
    width: '100%',
  },
  goalComplete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPending: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pendingText: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    fontSize: 10,
  },
  checkMark: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  ctaButton: {
    marginTop: Theme.spacing.md,
  },
  ctaEmoji: {
    fontSize: 20,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
});
