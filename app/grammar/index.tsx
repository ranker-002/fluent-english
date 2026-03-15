import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function GrammarScreen() {
  const router = useRouter();
  const { grammarLessons, completeGrammarLesson } = useStore();
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

  const speakContent = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.8,
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#6366F1';
      case 'advanced': return '#EC4899';
      default: return '#6366F1';
    }
  };

  const completedCount = grammarLessons.filter(l => l.completed).length;

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
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Grammar</Text>
            <Text style={styles.subtitle}>{completedCount}/{grammarLessons.length} completed</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.progressGradient}
          >
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Master English Grammar</Text>
              <Text style={styles.progressDesc}>
                Learn essential grammar rules with practical examples
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(completedCount / grammarLessons.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          
          {grammarLessons.map((lesson, index) => (
            <Pressable
              key={lesson.id}
              onPress={() => router.push('/grammar/' + lesson.id)}
            >
              <View style={styles.lessonCard}>
                <View style={styles.lessonHeader}>
                  <View style={[styles.lessonNumber, { backgroundColor: getLevelColor(lesson.level) + '20' }]}>
                    <Text style={[styles.lessonNumberText, { color: getLevelColor(lesson.level) }]}>
                      {index + 1}
                    </Text>
                  </View>
                  {lesson.completed && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedIcon}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDescription}>{lesson.description}</Text>
                <View style={styles.lessonFooter}>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(lesson.level) + '20' }]}>
                    <Text style={[styles.levelText, { color: getLevelColor(lesson.level) }]}>
                      {lesson.level}
                    </Text>
                  </View>
                  <Text style={styles.lessonXP}>+{lesson.xp} XP</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View style={[styles.tipsSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Grammar Tips</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Practice Daily</Text>
              <Text style={styles.tipText}>
                Spend 10 minutes each day reviewing grammar rules. Consistency is key to mastery.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>🎯</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Use in Context</Text>
              <Text style={styles.tipText}>
                Don't just memorize rules - practice using them in real sentences.
              </Text>
            </View>
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
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  progressCard: {
    marginBottom: 30,
    borderRadius: 24,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 24,
  },
  progressContent: {},
  progressTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
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
  lessonCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    fontSize: 16,
    fontWeight: '700',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  lessonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 12,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  lessonXP: {
    color: '#FFD93D',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tipEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
});
