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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

/**
 * GrammarDetailScreen — displays a single grammar lesson with content,
 * examples, and completion tracking.
 */
export default function GrammarDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { grammarLessons, completeGrammarLesson } = useStore();

  const lesson = grammarLessons.find(l => l.id === id);

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

  if (!lesson) {
    return (
      <AnimatedBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <NeoButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </AnimatedBackground>
    );
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'beginner':
        return { 
          color: Theme.colors.success, 
          bg: 'rgba(16, 185, 129, 0.15)'
        };
      case 'intermediate':
        return { 
          color: Theme.colors.primary, 
          bg: 'rgba(99, 102, 241, 0.15)'
        };
      case 'advanced':
        return { 
          color: Theme.colors.accentPink, 
          bg: 'rgba(236, 72, 153, 0.15)'
        };
      default:
        return { 
          color: Theme.colors.primary, 
          bg: Theme.colors.surfaceHighlight
        };
    }
  };

  const levelConfig = getLevelConfig(lesson.level);

  const handleComplete = () => {
    completeGrammarLesson(lesson.id);
    router.back();
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
            <View style={[styles.levelBadge, { backgroundColor: levelConfig.bg }]}>
              <Text style={[styles.levelText, { color: levelConfig.color }]}>
                {lesson.level}
              </Text>
            </View>
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.description}>{lesson.description}</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{lesson.duration} min</Text>
              <Text style={styles.metaBullet}>•</Text>
              <Text style={styles.metaText}>{lesson.xp} XP</Text>
              {lesson.completed && (
                <>
                  <Text style={styles.metaBullet}>•</Text>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedCheck}>✓ Completed</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.contentSection, { opacity: fadeAnim }]}>
          <GlassCard style={styles.contentCard} bordered>
            <Text style={styles.sectionTitle}>Lesson Content</Text>
            <Text style={styles.contentText}>{lesson.content}</Text>
          </GlassCard>
        </Animated.View>

        {/* Examples */}
        <Animated.View style={[styles.examplesSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Examples</Text>
          {lesson.examples.map((example, index) => (
            <GlassCard key={index} style={styles.exampleCard} bordered>
              <View style={styles.exampleNumber}>
                <Text style={styles.exampleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.exampleText}>"{example}"</Text>
            </GlassCard>
          ))}
        </Animated.View>

        {/* Action */}
        {!lesson.completed && (
          <Animated.View style={[styles.actionSection, { opacity: fadeAnim }]}>
            <NeoButton
              title="Mark as Complete"
              onPress={handleComplete}
              variant="primary"
              size="lg"
              fullWidth
              icon={<Text style={styles.checkIcon}>✓</Text>}
              iconPosition="right"
            />
          </Animated.View>
        )}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  errorText: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xl,
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
  },
  backText: {
    color: Theme.colors.text.primary,
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  levelText: {
    ...Theme.typography.overline,
    fontWeight: '600' as const,
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  description: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: Theme.spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  metaText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  metaBullet: {
    color: Theme.colors.text.tertiary,
    fontSize: 6,
  },
  completedBadge: {
    backgroundColor: Theme.colors.success + '20',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  completedCheck: {
    ...Theme.typography.caption,
    color: Theme.colors.success,
    fontWeight: '600' as const,
  },
  contentSection: {
    marginBottom: Theme.spacing.xxl,
  },
  contentCard: {
    padding: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  contentText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    lineHeight: 26,
  },
  examplesSection: {
    marginBottom: Theme.spacing.huge,
  },
  exampleCard: {
    flexDirection: 'row',
    padding: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
  exampleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  exampleNumberText: {
    ...Theme.typography.caption,
    color: Theme.colors.primary,
    fontWeight: '600' as const,
  },
  exampleText: {
    flex: 1,
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  actionSection: {
    marginBottom: Theme.spacing.hugePlus,
  },
  checkIcon: {
    fontSize: 18,
  },
} as const);
