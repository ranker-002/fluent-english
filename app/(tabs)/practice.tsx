import { View, Text, StyleSheet, ScrollView, Pressable, TextStyle, ViewStyle } from 'react-native';
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
        contentContainerStyle={viewStyles.scrollContent}
      >
        {/* Header */}
        <View style={viewStyles.header}>
          <Text style={textStyles.title}>Practice</Text>
          <Text style={textStyles.subtitle}>Improve your skills</Text>
        </View>

        {/* Quick Stats */}
        <View style={viewStyles.statsSection}>
          <GlassCard style={viewStyles.statsCard} bordered>
            <View style={viewStyles.statsRow}>
              <View style={viewStyles.statItem}>
                <Text style={textStyles.statValue}>{completedLessons}</Text>
                <Text style={textStyles.statLabel}>Lessons</Text>
              </View>
              <View style={viewStyles.statDivider} />
              <View style={viewStyles.statItem}>
                <Text style={textStyles.statValue}>{masteredWords}/{totalWords}</Text>
                <Text style={textStyles.statLabel}>Words</Text>
              </View>
              <View style={viewStyles.statDivider} />
              <View style={viewStyles.statItem}>
                <Text style={[textStyles.statValue, { color: Theme.colors.accent }]}>
                  {progress.streak}
                </Text>
                <Text style={textStyles.statLabel}>Streak</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Practice Modes */}
        <View style={viewStyles.section}>
          <Text style={textStyles.sectionTitle}>Practice Modes</Text>

          <View style={viewStyles.modesList}>
            {practiceModes.map((mode) => (
              <Pressable
                key={mode.id}
                onPress={() => router.push(mode.route as any)}
                accessibilityRole="button"
                accessibilityLabel={`Start ${mode.title}`}
                style={({ pressed }) => [
                  viewStyles.modeWrapper,
                  pressed && viewStyles.modeWrapperPressed,
                ]}
              >
                <GlassCard style={viewStyles.modeCard} gradient>
                  <View style={viewStyles.modeRow}>
                    <View style={[viewStyles.modeIcon, { backgroundColor: mode.bg }]}>
                      <Text style={textStyles.modeEmoji}>{mode.emoji}</Text>
                    </View>
                    <View style={viewStyles.modeInfo}>
                      <Text style={textStyles.modeTitle}>{mode.title}</Text>
                      <Text style={textStyles.modeDesc}>{mode.description}</Text>
                    </View>
                    <Text style={textStyles.modeArrow}>→</Text>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Daily Goals */}
        <View style={viewStyles.section}>
          <Text style={textStyles.sectionTitle}>Today's Goals</Text>

          <GlassCard style={viewStyles.goalsCard} bordered>
            <View style={viewStyles.goalItem}>
              <View style={[viewStyles.goalIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                <Text style={textStyles.goalEmoji}>📚</Text>
              </View>
              <View style={viewStyles.goalInfo}>
                <Text style={textStyles.goalTitle}>Complete Lessons</Text>
                <Text style={textStyles.goalSubtitle}>
                  {lessonsToday} of {todayIntention} lessons
                </Text>
                <ProgressBar
                  progress={(lessonsToday / todayIntention) * 100}
                  variant="primary"
                  height={4}
                  animated
                  style={viewStyles.goalProgress}
                />
              </View>
              {lessonsToday >= todayIntention ? (
                <View style={viewStyles.goalComplete}>
                  <Text style={textStyles.checkMark}>✓</Text>
                </View>
              ) : (
                <View style={viewStyles.goalPending}>
                  <Text style={textStyles.pendingText}>{todayIntention - lessonsToday} left</Text>
                </View>
              )}
            </View>

            <View style={viewStyles.goalDivider} />

            <View style={viewStyles.goalItem}>
              <View style={[viewStyles.goalIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={textStyles.goalEmoji}>🗣️</Text>
              </View>
              <View style={viewStyles.goalInfo}>
                <Text style={textStyles.goalTitle}>Practice Speaking</Text>
                <Text style={textStyles.goalSubtitle}>
                  Record your voice today
                </Text>
              </View>
              {speakingDone > 0 ? (
                <View style={viewStyles.goalComplete}>
                  <Text style={textStyles.checkMark}>✓</Text>
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

            <View style={viewStyles.goalDivider} />

            <View style={viewStyles.goalItem}>
              <View style={[viewStyles.goalIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={textStyles.goalEmoji}>🔥</Text>
              </View>
              <View style={viewStyles.goalInfo}>
                <Text style={textStyles.goalTitle}>Maintain Streak</Text>
                <Text style={textStyles.goalSubtitle}>
                  {progress.streak} consecutive days
                </Text>
              </View>
              {streakGood ? (
                <View style={viewStyles.goalComplete}>
                  <Text style={textStyles.checkMark}>✓</Text>
                </View>
              ) : (
                <View style={viewStyles.goalPending}>
                  <Text style={textStyles.pendingText}>Practice now</Text>
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
          style={viewStyles.ctaButton}
          icon={<Text style={textStyles.ctaEmoji}>⚡</Text>}
          iconPosition="left"
        />

        <View style={viewStyles.bottomSpacer} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const textStyles = StyleSheet.create({
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
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
  modeEmoji: {
    fontSize: 26,
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
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  goalEmoji: {
    fontSize: 24,
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
  pendingText: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    fontSize: 10,
  },
  checkMark: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  ctaEmoji: {
    fontSize: 20,
  },
} as const);

const viewStyles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge + Theme.spacing.lg,
    paddingBottom: Theme.spacing.hugePlus,
  },
  header: {
    marginBottom: Theme.spacing.xl,
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
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Theme.colors.surfaceBorder,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
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
  modeInfo: {
    flex: 1,
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
  goalInfo: {
    flex: 1,
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
  ctaButton: {
    marginTop: Theme.spacing.md,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
