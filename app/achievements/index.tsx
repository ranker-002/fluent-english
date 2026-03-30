import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

/**
 * AchievementsScreen — full-screen gallery of all achievements
 * showing locked/unlocked states, progress, and descriptions.
 */
export default function AchievementsScreen() {
  const router = useRouter();
  const { achievements, progress } = useStore();

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

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lessons': return '📚';
      case 'words': return '📝';
      case 'streak': return '🔥';
      case 'xp': return '⭐';
      case 'conversations': return '💬';
      default: return '🏆';
    }
  };

  const categories = [
    { id: 'all', label: 'All', filter: () => true },
    { id: 'lessons', label: 'Lessons', filter: (a: any) => a.type === 'lessons' },
    { id: 'words', label: 'Words', filter: (a: any) => a.type === 'words' },
    { id: 'streak', label: 'Streaks', filter: (a: any) => a.type === 'streak' },
    { id: 'xp', label: 'XP', filter: (a: any) => a.type === 'xp' },
    { id: 'conversations', label: 'Chat', filter: (a: any) => a.type === 'conversations' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAchievements = achievements.filter(categories.find(c => c.id === selectedCategory)?.filter || (() => true));

  const getProgressValue = (type: string) => {
    switch (type) {
      case 'lessons':
        return progress.lessonsCompleted;
      case 'streak':
        return progress.streak;
      case 'words':
        return progress.wordsLearned;
      case 'xp':
        return progress.xp;
      case 'conversations':
        return progress.conversationsCompleted;
      default:
        return 0;
    }
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
              transform: [{ translateY: slideAnim }] 
            },
          ]}
        >
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>Achievements</Text>
            <Text style={styles.subtitle}>
              {unlockedCount} of {achievements.length} unlocked
            </Text>
            
            {/* Progress ring or bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(unlockedCount / achievements.length) * 100}%` }]} />
              </View>
              <Text style={styles.progressPercent}>
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Category Pills */}
        <Animated.View style={[styles.categoriesSection, { opacity: fadeAnim }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat.id && styles.categoryPillActive,
                ]}
              >
                <Text style={[
                  styles.categoryPillText,
                  selectedCategory === cat.id && styles.categoryPillTextActive,
                ]}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Achievements Grid */}
        <Animated.View style={[styles.gridSection, { opacity: fadeAnim }]}>
          <View style={styles.achievementsGrid}>
            {filteredAchievements.map((achievement) => (
              <Pressable
                key={achievement.id}
                accessibilityRole="button"
                accessibilityLabel={`${achievement.title}${achievement.unlocked ? ', unlocked' : ', locked'}`}
                style={styles.achievementWrapper}
              >
                <GlassCard 
                  gradient={achievement.unlocked}
                  bordered={!achievement.unlocked}
                  style={[
                    styles.achievementCard,
                    !achievement.unlocked && styles.achievementCardLocked,
                  ]}
                >
                  <View style={styles.achievementIconWrapper}>
                    <Text style={[
                      styles.achievementIcon,
                      !achievement.unlocked && styles.achievementIconLocked,
                    ]}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </Text>
                  </View>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked && styles.achievementTitleUnlocked,
                  ]} numberOfLines={2}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDesc} numberOfLines={2}>
                    {achievement.description}
                  </Text>
                  <View style={styles.achievementProgress}>
                    <Text style={styles.progressText}>
                      {achievement.unlocked ? 'Unlocked!' : `${getProgressValue(achievement.type)} / ${achievement.requirement}`}
                    </Text>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {filteredAchievements.length === 0 && (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>No achievements in this category</Text>
          </Animated.View>
        )}

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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    color: Theme.colors.text.primary,
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
  },
  progressPercent: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  categoriesSection: {
    marginBottom: Theme.spacing.xl,
  },
  categoriesScroll: {
    gap: Theme.spacing.sm,
    paddingRight: Theme.spacing.xl,
  },
  categoryPill: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.surfaceBorder,
  },
  categoryPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  categoryPillText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontWeight: '500' as const,
  },
  categoryPillTextActive: {
    color: '#fff',
  },
  gridSection: {
    marginBottom: Theme.spacing.xxl,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  achievementWrapper: {
    width: (width - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
  },
  achievementCard: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    minHeight: 160,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
    fontSize: 15,
  },
  achievementTitleUnlocked: {
    color: Theme.colors.primary,
  },
  achievementDesc: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    fontSize: 12,
  },
  achievementProgress: {
    marginTop: 'auto',
    paddingTop: Theme.spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    fontSize: 11,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    opacity: 0.5,
    marginBottom: Theme.spacing.lg,
  },
  emptyText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
