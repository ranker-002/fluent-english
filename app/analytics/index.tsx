import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

/**
 * AnalyticsScreen — beautiful insights into your learning progress
 * with charts, streaks, and achievement overview.
 */
export default function AnalyticsScreen() {
  const router = useRouter();
  const { progress, lessons, grammarLessons, flashcards, achievements } = useStore();

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

  const completedLessons = lessons.filter(l => l.completed).length;
  const completedGrammar = grammarLessons.filter(g => g.completed).length;
  const masteredWords = flashcards.filter(f => f.mastered).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  // Simulate weekly data (would come from backend in real app)
  const weeklyActivity = [
    { day: 'Mon', lessons: 3, words: 8 },
    { day: 'Tue', lessons: 2, words: 12 },
    { day: 'Wed', lessons: 5, words: 15 },
    { day: 'Thu', lessons: 1, words: 5 },
    { day: 'Fri', lessons: 4, words: 10 },
    { day: 'Sat', lessons: 0, words: 0 },
    { day: 'Sun', lessons: 2, words: 6 },
  ];

  const maxWeekly = Math.max(...weeklyActivity.map(d => d.lessons));

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Your learning journey</Text>
        </Animated.View>

        {/* Overview Cards */}
        <Animated.View style={[styles.overviewSection, { opacity: fadeAnim }]}>
          <View style={styles.overviewGrid}>
            <GlassCard style={styles.overviewCard} bordered>
              <Text style={[styles.overviewEmoji, { color: Theme.colors.primary }]}>📚</Text>
              <Text style={styles.overviewValue}>{completedLessons}</Text>
              <Text style={styles.overviewLabel}>Lessons</Text>
            </GlassCard>

            <GlassCard style={styles.overviewCard} bordered>
              <Text style={[styles.overviewEmoji, { color: Theme.colors.success }]}>📝</Text>
              <Text style={styles.overviewValue}>{masteredWords}</Text>
              <Text style={styles.overviewLabel}>Words</Text>
            </GlassCard>

            <GlassCard style={styles.overviewCard} bordered>
              <Text style={[styles.overviewEmoji, { color: Theme.colors.accent }]}>🎯</Text>
              <Text style={styles.overviewValue}>{unlockedAchievements}</Text>
              <Text style={styles.overviewLabel}>Badges</Text>
            </GlassCard>

            <GlassCard style={styles.overviewCard} bordered>
              <Text style={[styles.overviewEmoji, { color: Theme.colors.accentPink }]}>🔥</Text>
              <Text style={styles.overviewValue}>{progress.streak}</Text>
              <Text style={styles.overviewLabel}>Day Streak</Text>
            </GlassCard>
          </View>
        </Animated.View>

        {/* XP Progress */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Experience Points</Text>
          
          <GlassCard gradient style={styles.xpCard}>
            <View style={styles.xpRow}>
              <View style={styles.xpInfo}>
                <Text style={styles.xpValue}>{progress.xp.toLocaleString()}</Text>
                <Text style={styles.xpLabel}>Total XP</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level {progress.level}</Text>
              </View>
            </View>
            <View style={styles.xpProgress}>
              <Text style={styles.xpProgressText}>
                {(progress.xp % 500)} / 500 to next level
              </Text>
              <ProgressBar 
                progress={(progress.xp % 500) / 5} 
                variant="success"
                height={8}
                animated
                style={styles.xpBar}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Weekly Activity */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          
          <GlassCard style={styles.chartCard} bordered>
            <View style={styles.chartContainer}>
              {weeklyActivity.map((day, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBars}>
                    <View 
                      style={[
                        styles.chartBarLessons,
                        { 
                          height: (day.lessons / maxWeekly) * 120,
                          backgroundColor: Theme.colors.primary,
                        },
                      ]} 
                    />
                    <View 
                      style={[
                        styles.chartBarWords,
                        { 
                          height: (day.words / 30) * 120,
                          backgroundColor: Theme.colors.accentPink,
                        },
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>{day.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Theme.colors.primary }]} />
                <Text style={styles.legendText}>Lessons</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Theme.colors.accentPink }]} />
                <Text style={styles.legendText}>Words</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Progress by Category */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Progress Breakdown</Text>
          
          <View style={styles.breakdownList}>
            <GlassCard style={styles.breakdownCard} bordered>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownIcon}>📖</Text>
                <View style={styles.breakdownInfo}>
                  <Text style={styles.breakdownTitle}>General Lessons</Text>
                  <Text style={styles.breakdownValue}>
                    {completedLessons} / {lessons.length}
                  </Text>
                </View>
              </View>
              <ProgressBar 
                progress={lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0} 
                variant="primary"
                animated
                style={styles.breakdownBar}
              />
            </GlassCard>

            <GlassCard style={styles.breakdownCard} bordered>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownIcon}>📝</Text>
                <View style={styles.breakdownInfo}>
                  <Text style={styles.breakdownTitle}>Grammar Lessons</Text>
                  <Text style={styles.breakdownValue}>
                    {completedGrammar} / {grammarLessons.length}
                  </Text>
                </View>
              </View>
              <ProgressBar 
                progress={grammarLessons.length > 0 ? (completedGrammar / grammarLessons.length) * 100 : 0} 
                variant="accent"
                animated
                style={styles.breakdownBar}
              />
            </GlassCard>

            <GlassCard style={styles.breakdownCard} bordered>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownIcon}>🔤</Text>
                <View style={styles.breakdownInfo}>
                  <Text style={styles.breakdownTitle}>Vocabulary</Text>
                  <Text style={styles.breakdownValue}>
                    {masteredWords} / {flashcards.length}
                  </Text>
                </View>
              </View>
              <ProgressBar 
                progress={flashcards.length > 0 ? (masteredWords / flashcards.length) * 100 : 0} 
                variant="accent"
                animated
                style={styles.breakdownBar}
              />
            </GlassCard>
          </View>
        </Animated.View>

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
  overviewSection: {
    marginBottom: Theme.spacing.xxl,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  overviewCard: {
    width: (width - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  overviewEmoji: {
    fontSize: 28,
    marginBottom: Theme.spacing.sm,
  },
  overviewValue: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  overviewLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
  },
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  xpCard: {
    padding: Theme.spacing.xl,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  xpInfo: {
    flex: 1,
  },
  xpValue: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
  },
  xpLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  levelText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.primary,
    fontWeight: '600' as const,
  },
  xpProgress: {
    gap: Theme.spacing.sm,
  },
  xpProgressText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    textAlign: 'right',
  },
  xpBar: {
    width: '100%',
  },
  chartCard: {
    padding: Theme.spacing.xl,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 160,
    marginBottom: Theme.spacing.md,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Theme.spacing.sm,
    height: 140,
  },
  chartBarLessons: {
    width: 12,
    borderRadius: 6,
  },
  chartBarWords: {
    width: 12,
    borderRadius: 6,
  },
  chartLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.sm,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  breakdownList: {
    gap: Theme.spacing.md,
  },
  breakdownCard: {
    padding: Theme.spacing.lg,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  breakdownIcon: {
    fontSize: 28,
    marginRight: Theme.spacing.md,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  breakdownValue: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  breakdownBar: {
    marginTop: Theme.spacing.sm,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
