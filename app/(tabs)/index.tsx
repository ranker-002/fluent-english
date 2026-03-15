import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { progress, lessons, currentStreak, flashcards } = useStore();
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const masteredCards = flashcards.filter(c => c.mastered).length;
  const completedLessons = lessons.filter(l => l.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.title}>Continue Learning</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{currentStreak}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.xpCard}
          >
            <View style={styles.xpContent}>
              <View>
                <Text style={styles.xpLabel}>Total XP</Text>
                <Text style={styles.xpValue}>{progress.xp}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level {progress.level}</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(progress.xp % 500) / 5}%` }
                ]} 
              />
            </View>
            <Text style={styles.xpToNext}>
              {(500 - (progress.xp % 500))} XP to next level
            </Text>
          </LinearGradient>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📚</Text>
              <Text style={styles.statValue}>{completedLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📝</Text>
              <Text style={styles.statValue}>{masteredCards}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statValue}>{progress.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lessonsScroll}
          >
            {lessons.slice(0, 4).map((lesson, index) => (
              <Pressable
                key={lesson.id}
                onPress={() => router.push('/learning/flashcard')}
              >
                <LinearGradient
                  colors={[
                    index === 0 ? '#6366F1' : index === 1 ? '#EC4899' : '#10B981',
                    index === 0 ? '#8B5CF6' : index === 1 ? '#F472B6' : '#34D399',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.lessonCard}
                >
                  <View style={styles.lessonHeader}>
                    <View style={styles.lessonIcon}>
                      <Text style={styles.lessonEmoji}>
                        {index === 0 ? '👋' : index === 1 ? '🍽️' : index === 2 ? '🛍️' : '🗺️'}
                      </Text>
                    </View>
                    {lesson.completed && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDescription}>{lesson.description}</Text>
                  <View style={styles.lessonFooter}>
                    <Text style={styles.lessonDuration}>{lesson.duration} min</Text>
                    <Text style={styles.lessonXP}>+{lesson.xp} XP</Text>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <View style={styles.practiceGrid}>
            <Pressable
              style={styles.practiceCard}
              onPress={() => router.push('/learning/flashcard')}
            >
              <View style={[styles.practiceIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                <Text style={styles.practiceEmoji}>🃏</Text>
              </View>
              <Text style={styles.practiceTitle}>Flashcards</Text>
              <Text style={styles.practiceSubtitle}>Review vocabulary</Text>
            </Pressable>

            <Pressable
              style={styles.practiceCard}
              onPress={() => router.push('/pronunciation')}
            >
              <View style={[styles.practiceIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={styles.practiceEmoji}>🎤</Text>
              </View>
              <Text style={styles.practiceTitle}>Pronunciation</Text>
              <Text style={styles.practiceSubtitle}>Practice speaking</Text>
            </Pressable>

            <Pressable
              style={styles.practiceCard}
              onPress={() => router.push('/conversation')}
            >
              <View style={[styles.practiceIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={styles.practiceEmoji}>💬</Text>
              </View>
              <Text style={styles.practiceTitle}>Conversation</Text>
              <Text style={styles.practiceSubtitle}>Chat with AI</Text>
            </Pressable>

            <Pressable
              style={styles.practiceCard}
              onPress={() => router.push('/learning')}
            >
              <View style={[styles.practiceIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Text style={styles.practiceEmoji}>📊</Text>
              </View>
              <Text style={styles.practiceTitle}>Progress</Text>
              <Text style={styles.practiceSubtitle}>View stats</Text>
            </Pressable>
          </View>
        </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakEmoji: {
    fontSize: 18,
  },
  streakCount: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 16,
  },
  statsContainer: {
    marginBottom: 30,
  },
  xpCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  xpContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  xpLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  xpValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  xpToNext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
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
  lessonsScroll: {
    paddingRight: 20,
    gap: 16,
  },
  lessonCard: {
    width: width * 0.65,
    borderRadius: 20,
    padding: 20,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmoji: {
    fontSize: 22,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 14,
  },
  lessonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  lessonDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 12,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lessonDuration: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  lessonXP: {
    color: '#FFD93D',
    fontWeight: '600',
    fontSize: 13,
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  practiceCard: {
    width: (width - 52) / 2,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 16,
  },
  practiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  practiceEmoji: {
    fontSize: 24,
  },
  practiceTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  practiceSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});
