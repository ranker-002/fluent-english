import { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Animated, 
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

/**
 * HomeScreen — a beautifully redesigned dashboard with glassmorphism,
 * staggered animations, and a premium dark aesthetic.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { progress, lessons, currentStreak, flashcards, achievements } = useStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered entrance animation for sections
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: 100,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const masteredCards = flashcards.filter(c => c.mastered).length;
  const completedLessons = lessons.filter(l => l.completed).length;
  const xpProgress = (progress.xp % 500) / 5; // percent to next level

  // Quick practice items
  const practiceItems = [
    {
      id: 'flashcards',
      title: 'Flashcards',
      subtitle: 'Review vocabulary',
      emoji: '🃏',
      color: Theme.colors.primary,
      route: '/learning/flashcard',
      iconBg: 'rgba(99, 102, 241, 0.2)',
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      subtitle: 'Practice speaking',
      emoji: '🎤',
      color: Theme.colors.accentPink,
      route: '/pronunciation',
      iconBg: 'rgba(236, 72, 153, 0.2)',
    },
    {
      id: 'conversation',
      title: 'Conversation',
      subtitle: 'Chat with AI',
      emoji: '💬',
      color: Theme.colors.success,
      route: '/conversation',
      iconBg: 'rgba(16, 185, 129, 0.2)',
    },
    {
      id: 'learn',
      title: 'All Lessons',
      subtitle: 'Browse topics',
      emoji: '📚',
      color: Theme.colors.secondary,
      route: '/learning',
      iconBg: 'rgba(6, 182, 212, 0.2)',
    },
  ];

  // Render a single lesson card with gradient and hover effect
  const LessonCard = ({ lesson, index }: { lesson: any; index: number }) => {
    const emojis = ['👋', '🍽️', '🛍️', '🗺️', '💼', '✈️', '📞', '🎓'];
    const colors = [
      [Theme.colors.primary, Theme.colors.primaryLight],
      [Theme.colors.accentPink, '#F472B6'],
      [Theme.colors.success, '#34D399'],
      [Theme.colors.secondary, '#22D3EE'],
    ];
    const colorPair = colors[index % colors.length];
    const emoji = emojis[index % emojis.length];

    return (
      <Pressable
        onPress={() => router.push('/learning/flashcard')}
        accessibilityRole="button"
        accessibilityLabel={`${lesson.title}, ${lesson.duration} minutes, ${lesson.xp} XP${lesson.completed ? ', completed' : ''}`}
      >
        <GlassCard gradient style={styles.lessonCard}>
          <View style={styles.lessonHeader}>
            <View style={[styles.lessonIcon, { backgroundColor: colorPair[0] + '20' }]}>
              <Text style={styles.lessonEmoji}>{emoji}</Text>
            </View>
            {lesson.completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDescription} numberOfLines={2}>
            {lesson.description}
          </Text>
          <View style={styles.lessonFooter}>
            <View style={styles.lessonMeta}>
              <Text style={styles.lessonDuration}>{lesson.duration} min</Text>
              <Text style={styles.lessonBullet}>•</Text>
              <Text style={styles.lessonLevel}>{lesson.level}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{lesson.xp} XP</Text>
            </View>
          </View>
        </GlassCard>
      </Pressable>
    );
  };

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.title}>Your Learning Journey</Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Profile and streak"
          >
            <GlassCard style={styles.streakBadge} bordered glow>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakCount}>{currentStreak}</Text>
            </GlassCard>
          </Pressable>
        </Animated.View>

        {/* XP Card */}
        <Animated.View
          style={[
            styles.xpSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <GlassCard gradient style={styles.xpCard}>
            <View style={styles.xpHeader}>
              <View style={styles.xpTitleGroup}>
                <Text style={Theme.typography.overline}>Total XP</Text>
                <Text style={styles.xpValue}>{progress.xp.toLocaleString()}</Text>
              </View>
              <View style={[styles.levelBadge, Theme.shadows.sm]}>
                <Text style={styles.levelText}>Level {progress.level}</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar 
                progress={xpProgress} 
                variant="default" 
                height={6} 
                animated 
                style={styles.xpProgressBar}
              />
              <Text style={styles.xpToNext}>
                {500 - (progress.xp % 500)} XP to next level
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View
          style={[
            styles.statsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard} bordered>
              <Text style={[styles.statEmoji, { color: Theme.colors.primary }]}>📚</Text>
              <Text style={styles.statValue}>{completedLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </GlassCard>
            <GlassCard style={styles.statCard} bordered>
              <Text style={[styles.statEmoji, { color: Theme.colors.success }]}>📝</Text>
              <Text style={styles.statValue}>{masteredCards}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </GlassCard>
            <GlassCard style={styles.statCard} bordered>
              <Text style={[styles.statEmoji, { color: Theme.colors.accent }]}>💬</Text>
              <Text style={styles.statValue}>{achievements.filter(a => a.unlocked).length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </GlassCard>
          </View>
        </Animated.View>

        {/* Continue Learning */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <Pressable onPress={() => router.push('/learning')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lessonsScroll}
            decelerationRate="fast"
          >
            {lessons.slice(0, 4).map((lesson, index) => (
              <View key={lesson.id} style={{ width: width * 0.75, marginRight: Theme.spacing.lg }}>
                <LessonCard lesson={lesson} index={index} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Practice */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <View style={styles.practiceGrid}>
            {practiceItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(item.route as any)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}: ${item.subtitle}`}
                style={styles.practiceCardWrapper}
              >
                <GlassCard style={styles.practiceCard} bordered>
                  <View style={[styles.practiceIcon, { backgroundColor: item.iconBg }]}>
                    <Text style={styles.practiceEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.practiceTitle}>{item.title}</Text>
                  <Text style={styles.practiceSubtitle}>{item.subtitle}</Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge + Theme.spacing.xl,
    paddingBottom: Theme.spacing.hugePlus + 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xxl,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: Theme.spacing.xs,
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
  },
  streakBadge: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakCount: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.accent,
    marginTop: 2,
  },
  xpSection: {
    marginBottom: Theme.spacing.xl,
  },
  xpCard: {
    padding: Theme.spacing.xxl,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
  },
  xpTitleGroup: {
    flex: 1,
  },
  xpValue: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginTop: Theme.spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  levelText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.primary,
    fontWeight: '600' as const,
  },
  progressContainer: {
    marginTop: Theme.spacing.sm,
  },
  xpProgressBar: {
    marginBottom: Theme.spacing.sm,
  },
  xpToNext: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    textAlign: 'right',
  },
  statsSection: {
    marginBottom: Theme.spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: Theme.spacing.sm,
  },
  statValue: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
  },
  seeAll: {
    ...Theme.typography.body,
    color: Theme.colors.primary,
    fontWeight: '600' as const,
  },
  lessonsScroll: {
    paddingRight: Theme.spacing.xxxl - Theme.spacing.lg,
    gap: Theme.spacing.lg,
  },
  lessonCard: {
    padding: Theme.spacing.lg,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmoji: {
    fontSize: 24,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: Theme.colors.background,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  lessonTitle: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  lessonDescription: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.md,
    lineHeight: 22,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  lessonDuration: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  lessonBullet: {
    color: Theme.colors.text.tertiary,
    fontSize: 8,
  },
  lessonLevel: {
    ...Theme.typography.caption,
    color: Theme.colors.primary,
    textTransform: 'capitalize' as const,
  },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  xpText: {
    ...Theme.typography.caption,
    color: Theme.colors.accent,
    fontWeight: '600' as const,
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  practiceCardWrapper: {
    width: (width - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
  },
  practiceCard: {
    padding: Theme.spacing.lg,
  },
  practiceIcon: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  practiceEmoji: {
    fontSize: 28,
  },
  practiceTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  practiceSubtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
