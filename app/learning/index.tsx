import { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Animated, 
  Dimensions 
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
 * LearningScreen — beautiful catalog of lessons with gradient cards,
 * smooth animations, and clear progress tracking.
 */
export default function LearningScreen() {
  const router = useRouter();
  const { lessons, progress } = useStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 150,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const completedCount = lessons.filter(l => l.completed).length;
  const inProgressCount = lessons.filter(l => !l.completed).length;

  const getLessonColors = (level: string) => {
    switch (level) {
      case 'beginner':
        return [Theme.colors.success, '#34D399'];
      case 'intermediate':
        return [Theme.colors.primary, Theme.colors.primaryLight];
      case 'advanced':
        return [Theme.colors.accentPink, '#F472B6'];
      default:
        return Theme.gradients.primary;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return Theme.colors.success;
      case 'intermediate':
        return Theme.colors.primary;
      case 'advanced':
        return Theme.colors.accentPink;
      default:
        return Theme.colors.primary;
    }
  };

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Learning Path</Text>
          <Text style={styles.subtitle}>
            {completedCount} of {lessons.length} lessons completed
          </Text>
        </Animated.View>

        {/* Overall Progress */}
        <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
          <GlassCard style={styles.progressCard} gradient>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressPercent}>
                {lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0}%
              </Text>
            </View>
            <ProgressBar 
              progress={lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0} 
              variant="success"
              height={10}
              animated
              style={styles.progressBar}
            />
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{completedCount}</Text>
                <Text style={styles.progressStatLabel}>Completed</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{inProgressCount}</Text>
                <Text style={styles.progressStatLabel}>Remaining</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{lessons.length}</Text>
                <Text style={styles.progressStatLabel}>Total</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Lessons List */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>All Lessons</Text>
          
          <View style={styles.lessonsList}>
            {lessons.map((lesson, index) => (
              <Pressable
                key={lesson.id}
                onPress={() => router.push('/learning/flashcard')}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title}, ${lesson.duration} minutes, ${lesson.xp} XP${lesson.completed ? ', completed' : ''}`}
                style={({ pressed }) => [
                  styles.lessonWrapper,
                  pressed && styles.lessonWrapperPressed,
                ]}
              >
                <GlassCard 
                  gradient={!lesson.completed} 
                  bordered={lesson.completed}
                  style={styles.lessonCard}
                >
                  <View style={styles.lessonRow}>
                    <View style={[styles.rankBadge, { backgroundColor: getLessonColors(lesson.level)[0] }]}>
                      <Text style={styles.rankNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.lessonContent}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonDescription} numberOfLines={2}>
                        {lesson.description}
                      </Text>
                      <View style={styles.lessonMeta}>
                        <View style={[styles.levelBadge, { backgroundColor: getLevelBadgeColor(lesson.level) + '20' }]}>
                          <Text style={[styles.levelText, { color: getLevelBadgeColor(lesson.level) }]}>
                            {lesson.level}
                          </Text>
                        </View>
                        <Text style={styles.durationText}>
                          {lesson.duration} min
                        </Text>
                        <View style={styles.xpBadge}>
                          <Text style={styles.xpText}>+{lesson.xp} XP</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.lessonAction}>
                      {lesson.completed ? (
                        <View style={styles.completedIcon}>
                          <Text style={styles.checkMark}>✓</Text>
                        </View>
                      ) : (
                        <View style={styles.playIconContainer}>
                          <Text style={styles.playIcon}>▶</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
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
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  progressSection: {
    marginBottom: Theme.spacing.xxl,
  },
  progressCard: {
    padding: Theme.spacing.xxl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  progressTitle: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
  },
  progressPercent: {
    ...Theme.typography.heading2,
    color: Theme.colors.primary,
  },
  progressBar: {
    marginBottom: Theme.spacing.lg,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
  },
  progressStatLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.xs,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: Theme.colors.surfaceBorder,
  },
  section: {
    marginBottom: Theme.spacing.xxxl,
  },
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  lessonsList: {
    gap: Theme.spacing.md,
  },
  lessonWrapper: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  lessonWrapperPressed: {
    opacity: 0.9,
  },
  lessonCard: {
    padding: Theme.spacing.lg,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.sm,
  },
  rankNumber: {
    color: '#fff',
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '700',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
    marginBottom: Theme.spacing.xs,
  },
  lessonDescription: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
    lineHeight: 20,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    flexWrap: 'wrap',
  },
  levelBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  levelText: {
    ...Theme.typography.overline,
    fontSize: 10,
  },
  durationText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    marginLeft: 'auto',
  },
  xpText: {
    ...Theme.typography.caption,
    color: Theme.colors.accent,
    fontWeight: '600',
  },
  lessonAction: {
    justifyContent: 'center',
  },
  completedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  playIcon: {
    color: Theme.colors.primary,
    fontSize: 12,
    marginLeft: 1,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
});
