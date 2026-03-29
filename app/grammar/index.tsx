import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { Theme } from '../../theme';

/**
 * GrammarScreen — elegant, card-based grammar lessons with
 * smooth entrance animations and clear visual hierarchy.
 */
export default function GrammarScreen() {
  const router = useRouter();
  const { grammarLessons, completeGrammarLesson } = useStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 150,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const speakContent = (text: string) => {
    // Speech.speak would be here if needed
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'beginner':
        return { 
          color: Theme.colors.success, 
          gradient: [Theme.colors.success, '#34D399'],
          bg: 'rgba(16, 185, 129, 0.15)'
        };
      case 'intermediate':
        return { 
          color: Theme.colors.primary, 
          gradient: [Theme.colors.primary, Theme.colors.primaryLight],
          bg: 'rgba(99, 102, 241, 0.15)'
        };
      case 'advanced':
        return { 
          color: Theme.colors.accentPink, 
          gradient: [Theme.colors.accentPink, '#F472B6'],
          bg: 'rgba(236, 72, 153, 0.15)'
        };
      default:
        return { 
          color: Theme.colors.primary, 
          gradient: Theme.gradients.primary,
          bg: Theme.colors.surfaceHighlight
        };
    }
  };

  const completedCount = grammarLessons.filter(l => l.completed).length;

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Grammar</Text>
            <Text style={styles.subtitle}>
              {completedCount} of {grammarLessons.length} completed
            </Text>
          </View>
        </Animated.View>

        {/* Progress Card */}
        <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
          <GlassCard gradient style={styles.progressCard}>
            <LinearGradient
              colors={Theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressHeader}
            >
              <View>
                <Text style={styles.progressTitle}>Grammar Mastery</Text>
                <Text style={styles.progressDesc}>
                  Build a solid foundation in English grammar
                </Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>
                  {grammarLessons.length > 0 ? Math.round((completedCount / grammarLessons.length) * 100) : 0}%
                </Text>
              </View>
            </LinearGradient>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${grammarLessons.length > 0 ? (completedCount / grammarLessons.length) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Lessons List */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          
          <View style={styles.lessonsList}>
            {grammarLessons.map((lesson, index) => {
              const levelConfig = getLevelConfig(lesson.level);
              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => {
                    if (!lesson.completed) {
                      completeGrammarLesson(lesson.id);
                    }
                    router.push(`/grammar/${lesson.id}`);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${lesson.title}, ${lesson.level} level${lesson.completed ? ', completed' : ''}`}
                  style={({ pressed }) => [
                    styles.lessonWrapper,
                    pressed ? styles.lessonWrapperPressed,
                  ]}
                >
                  <GlassCard 
                    gradient={!lesson.completed}
                    bordered={lesson.completed}
                    style={styles.lessonCard}
                  >
                    <View style={styles.lessonRow}>
                      <View style={[styles.lessonNumber, { backgroundColor: levelConfig.bg }]}>
                        <Text style={[styles.lessonNumberText, { color: levelConfig.color }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.lessonContent}>
                        <View style={styles.lessonHeader}>
                          <Text style={styles.lessonTitle}>{lesson.title}</Text>
                          {lesson.completed && (
                            <View style={[styles.completedBadge, { backgroundColor: Theme.colors.success }]}>
                              <Text style={styles.completedCheck}>✓</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.lessonDescription}>{lesson.description}</Text>
                        <View style={styles.lessonFooter}>
                          <View style={[styles.levelBadge, { backgroundColor: levelConfig.bg }]}>
                            <Text style={[styles.levelText, { color: levelConfig.color }]}>
                              {lesson.level}
                            </Text>
                          </View>
                          <View style={styles.xpBadge}>
                            <Text style={[styles.xpText, { color: Theme.colors.accent }]}>
                              +{lesson.xp} XP
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    {/* Examples preview (always visible, clickable) */}
                    <View style={styles.examplesPreview}>
                      <Text style={styles.examplesLabel}>Examples:</Text>
                      <Text style={styles.exampleText}>{lesson.examples[0]}</Text>
                      {lesson.examples.length > 1 && (
                        <Text style={styles.moreExamples}>+{lesson.examples.length - 1} more</Text>
                      )}
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Tips Section */}
        <Animated.View style={[styles.tipsSection, { opacity: fadeAnim }]}>
          <GlassCard style={styles.tipsCard} bordered>
            <View style={styles.tipHeader}>
              <Text style={styles.tipEmoji}>💡</Text>
              <Text style={styles.tipTitle}>Grammar Tips</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>
                <Text style={styles.tipBold}>Practice Daily:</Text> Spend 10 minutes each day reviewing grammar rules. Consistency is key to mastery.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>
                <Text style={styles.tipBold}>Use in Context:</Text> Practice using new structures in real sentences, not just memorizing.
              </Text>
            </View>
          </GlassCard>
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
    marginBottom: Theme.spacing.xs,
  },
  progressDesc: {
    ...Theme.typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    ...Theme.typography.heading2,
    color: '#fff',
  },
  progressBarContainer: {
    marginTop: Theme.spacing.sm,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
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
    opacity: 0.95,
  },
  lessonCard: {
    padding: Theme.spacing.lg,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.sm,
  },
  lessonNumberText: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '700',
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  lessonTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheck: {
    color: Theme.colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
  lessonDescription: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
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
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    marginLeft: 'auto',
  },
  xpText: {
    ...Theme.typography.caption,
    fontWeight: '600',
  },
  examplesPreview: {
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Theme.colors.surfaceBorder,
  },
  examplesLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
    fontSize: 10,
  },
  exampleText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  moreExamples: {
    ...Theme.typography.caption,
    color: Theme.colors.primary,
    marginTop: Theme.spacing.xs,
  },
  tipsSection: {
    marginBottom: Theme.spacing.xxxl,
  },
  tipsCard: {
    padding: Theme.spacing.xl,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
  },
  tipItem: {
    marginBottom: Theme.spacing.md,
  },
  tipText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    lineHeight: 24,
  },
  tipBold: {
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
});
