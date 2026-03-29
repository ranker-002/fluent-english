import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

const categories = [
  { 
    id: 'basics', 
    name: 'Basics', 
    icon: '📖', 
    color: Theme.colors.primary, 
    lessons: 12, 
    screen: '/learning',
    gradient: [Theme.colors.primary, Theme.colors.primaryLight] as const,
  },
  { 
    id: 'grammar', 
    name: 'Grammar', 
    icon: '📝', 
    color: Theme.colors.accent, 
    lessons: 7, 
    screen: '/grammar',
    gradient: [Theme.colors.accent, Theme.colors.accent] as const,
  },
  { 
    id: 'vocabulary', 
    name: 'Vocabulary', 
    icon: '📚', 
    color: Theme.colors.accentPink, 
    lessons: 4, 
    screen: '/vocabulary',
    gradient: [Theme.colors.accentPink, '#F472B6'] as const,
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    icon: '✈️', 
    color: Theme.colors.success, 
    lessons: 8, 
    screen: '/learning',
    gradient: [Theme.colors.success, '#34D399'] as const,
  },
  { 
    id: 'conversation', 
    name: 'Conversation', 
    icon: '💬', 
    color: '#8B5CF6', 
    lessons: 3, 
    screen: '/conversation',
    gradient: ['#8B5CF6', '#A78BFA'] as const,
  },
  { 
    id: 'career', 
    name: 'Career', 
    icon: '💼', 
    color: Theme.colors.secondary, 
    lessons: 10, 
    screen: '/learning',
    gradient: [Theme.colors.secondary, '#22D3EE'] as const,
  },
];

const topics = [
  { id: 'us', name: 'American English', desc: 'Common expressions and slang', icon: '🇺🇸' },
  { id: 'uk', name: 'British English', desc: 'British accents and expressions', icon: '🇬🇧' },
  { id: 'movies', name: 'Movies & TV', desc: 'Learn from films and shows', icon: '🎬' },
  { id: 'music', name: 'Music & Lyrics', desc: 'Learn through songs', icon: '🎵' },
];

/**
 * ExploreScreen — discover new content with beautiful category cards,
 * recommendations, and topic explorations.
 */
export default function ExploreScreen() {
  const router = useRouter();
  const { lessons } = useStore();

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

  const recommendedLessons = lessons.slice(0, 4);

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover new content</Text>
        </Animated.View>

        {/* Search */}
        <Animated.View style={[styles.searchSection, { opacity: fadeAnim }]}>
          <GlassCard style={styles.searchCard} bordered>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search lessons, topics...</Text>
          </GlassCard>
        </Animated.View>

        {/* Categories */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => router.push(category.screen)}
                accessibilityRole="button"
                accessibilityLabel={`Browse ${category.name} category`}
                style={styles.categoryWrapper}
              >
                <GlassCard style={styles.categoryCard} gradient>
                  <LinearGradient
                    colors={category.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryGradient}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryLessons}>{category.lessons} lessons</Text>
                  </LinearGradient>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Recommended */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScroll}
            decelerationRate="fast"
          >
            {recommendedLessons.map((lesson, index) => (
              <Pressable
                key={lesson.id}
                onPress={() => router.push('/learning/flashcard')}
                accessibilityRole="button"
                accessibilityLabel={`Start ${lesson.title} lesson`}
                style={styles.recommendedWrapper}
              >
                <GlassCard 
                  gradient={index === 0} 
                  bordered={index !== 0}
                  style={styles.recommendedCard}
                >
                  <Text style={styles.recommendedEmoji}>
                    {index === 0 ? '🌟' : index === 1 ? '🍽️' : index === 2 ? '🛍️' : '🗺️'}
                  </Text>
                  <Text style={styles.recommendedTitle}>{lesson.title}</Text>
                  <Text style={styles.recommendedMeta}>
                    {lesson.duration} min • {lesson.level}
                  </Text>
                  {lesson.completed && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  )}
                </GlassCard>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Topics */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          
          <View style={styles.topicsList}>
            {topics.map((topic) => (
              <Pressable
                key={topic.id}
                accessibilityRole="button"
                accessibilityLabel={`Explore ${topic.name}`}
                style={styles.topicItem}
              >
                <GlassCard style={styles.topicCard} bordered>
                  <View style={styles.topicRow}>
                    <View style={styles.topicIconBox}>
                      <Text style={styles.topicEmoji}>{topic.icon}</Text>
                    </View>
                    <View style={styles.topicInfo}>
                      <Text style={styles.topicName}>{topic.name}</Text>
                      <Text style={styles.topicDesc}>{topic.desc}</Text>
                    </View>
                    <Text style={styles.topicArrow}>→</Text>
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
  searchSection: {
    marginBottom: Theme.spacing.xxl,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Theme.spacing.sm,
  },
  searchPlaceholder: {
    ...Theme.typography.body,
    color: Theme.colors.text.tertiary,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
  },
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  categoryWrapper: {
    width: (width - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
  },
  categoryCard: {
    padding: 0,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: Theme.spacing.lg,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  categoryName: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  categoryLessons: {
    ...Theme.typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  recommendedScroll: {
    paddingRight: Theme.spacing.xxl,
    gap: Theme.spacing.lg,
  },
  recommendedWrapper: {
    width: width * 0.75,
  },
  recommendedCard: {
    padding: Theme.spacing.lg,
  },
  recommendedEmoji: {
    fontSize: 36,
    marginBottom: Theme.spacing.md,
  },
  recommendedTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
    marginBottom: Theme.spacing.sm,
  },
  recommendedMeta: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  completedBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
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
    fontWeight: '700',
  },
  topicsList: {
    gap: Theme.spacing.md,
  },
  topicItem: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  topicCard: {
    padding: 0,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  topicIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  topicEmoji: {
    fontSize: 24,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  topicDesc: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  topicArrow: {
    fontSize: 20,
    color: Theme.colors.primary,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
});
