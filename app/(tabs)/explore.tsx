import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'basics', name: 'Basics', icon: '📖', color: '#6366F1', lessons: 12, screen: '/learning' },
  { id: 'grammar', name: 'Grammar', icon: '📝', color: '#F59E0B', lessons: 7, screen: '/grammar' },
  { id: 'vocabulary', name: 'Vocabulary', icon: '📚', color: '#EC4899', lessons: 4, screen: '/vocabulary' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#10B981', lessons: 8, screen: '/learning' },
  { id: 'conversation', name: 'Conversation', icon: '💬', color: '#8B5CF6', lessons: 3, screen: '/conversation' },
  { id: 'career', name: 'Career', icon: '💼', color: '#06B6D4', lessons: 10, screen: '/learning' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { lessons } = useStore();

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover new content</Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search lessons, topics...</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable 
                key={category.id} 
                onPress={() => router.push(category.screen as any)}
                style={styles.categoryCard}
              >
                <LinearGradient
                  colors={[category.color, category.color + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryLessons}>{category.lessons} lessons</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScroll}
          >
            {lessons.slice(0, 4).map((lesson, index) => (
              <Pressable 
                key={lesson.id}
                onPress={() => router.push('/learning/flashcard')}
              >
                <LinearGradient
                  colors={[
                    index === 0 ? '#6366F1' : '#1A1A2E',
                    index === 0 ? '#8B5CF6' : '#2D2D44',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
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
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          
          <View style={styles.topicsList}>
            <Pressable style={styles.topicItem}>
              <View style={styles.topicIcon}>
                <Text style={styles.topicEmoji}>🇺🇸</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>American English</Text>
                <Text style={styles.topicDesc}>Common expressions and slang</Text>
              </View>
              <Text style={styles.topicArrow}>→</Text>
            </Pressable>

            <Pressable style={styles.topicItem}>
              <View style={styles.topicIcon}>
                <Text style={styles.topicEmoji}>🇬🇧</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>British English</Text>
                <Text style={styles.topicDesc}>British accents and expressions</Text>
              </View>
              <Text style={styles.topicArrow}>→</Text>
            </Pressable>

            <Pressable style={styles.topicItem}>
              <View style={styles.topicIcon}>
                <Text style={styles.topicEmoji}>🎬</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>Movies & TV</Text>
                <Text style={styles.topicDesc}>Learn from films and shows</Text>
              </View>
              <Text style={styles.topicArrow}>→</Text>
            </Pressable>

            <Pressable style={styles.topicItem}>
              <View style={styles.topicIcon}>
                <Text style={styles.topicEmoji}>🎵</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>Music & Lyrics</Text>
                <Text style={styles.topicDesc}>Learn through songs</Text>
              </View>
              <Text style={styles.topicArrow}>→</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 30,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    color: '#6B7280',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    aspectRatio: 1.2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryLessons: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  recommendedScroll: {
    paddingRight: 20,
    gap: 16,
  },
  recommendedCard: {
    width: width * 0.65,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
  },
  recommendedEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  recommendedTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendedMeta: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  completedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  topicsList: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 8,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  topicEmoji: {
    fontSize: 24,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topicDesc: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  topicArrow: {
    color: '#6366F1',
    fontSize: 20,
  },
});
