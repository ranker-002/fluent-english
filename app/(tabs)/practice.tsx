import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function PracticeScreen() {
  const router = useRouter();
  const { lessons, flashcards, progress, getDueCards, grammarLessons, listeningExercises, conversationScenarios } = useStore();

  const completedLessons = lessons.filter(l => l.completed).length;
  const masteredWords = flashcards.filter(c => c.mastered).length;
  const totalWords = flashcards.length;
  const dueCards = getDueCards();
  const completedGrammar = grammarLessons.filter(l => l.completed).length;
  const completedListening = listeningExercises.filter(l => l.completed).length;
  const completedConversations = conversationScenarios.filter(s => s.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Improve your skills</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{masteredWords}/{totalWords}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dueCards.length}</Text>
            <Text style={styles.statLabel}>Due Today</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Paths</Text>
          
          <Pressable onPress={() => router.push('/learning/flashcard')}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>🃏</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Flashcard Review</Text>
                <Text style={styles.pathDescription}>Master vocabulary with spaced repetition</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/pronunciation')}>
            <LinearGradient
              colors={['#EC4899', '#F472B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>🎤</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Pronunciation</Text>
                <Text style={styles.pathDescription}>Practice speaking and get feedback</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/conversation')}>
            <LinearGradient
              colors={['#10B981', '#34D399']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>💬</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Conversations</Text>
                <Text style={styles.pathDescription}>Practice real-world dialogues</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/grammar')}>
            <LinearGradient
              colors={['#F59E0B', '#FBBF24']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>📖</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Grammar</Text>
                <Text style={styles.pathDescription}>Learn essential grammar rules</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/vocabulary')}>
            <LinearGradient
              colors={['#EC4899', '#F472B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>📚</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Vocabulary</Text>
                <Text style={styles.pathDescription}>Expand your word bank</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/listening')}>
            <LinearGradient
              colors={['#10B981', '#34D399']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>👂</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Listening</Text>
                <Text style={styles.pathDescription}>Train your ear with audio</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/daily-review')}>
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pathCard}
            >
              <View style={styles.pathIcon}>
                <Text style={styles.pathEmoji}>🔄</Text>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle}>Daily Review</Text>
                <Text style={styles.pathDescription}>{dueCards.length} cards due today</Text>
              </View>
              <Text style={styles.pathArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          
          <View style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                <Text style={styles.goalEmoji}>📚</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Complete 1 Lesson</Text>
                <Text style={styles.goalProgress}>{completedLessons}/1</Text>
              </View>
              <View style={styles.goalCheck}>
                {completedLessons >= 1 && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </View>

            <View style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={styles.goalEmoji}>🗣️</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Practice Speaking</Text>
                <Text style={styles.goalProgress}>0/1</Text>
              </View>
              <View style={styles.goalCheck}>
                <Text style={styles.checkPending}>○</Text>
              </View>
            </View>

            <View style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={styles.goalEmoji}>🔥</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maintain Streak</Text>
                <Text style={styles.goalProgress}>{progress.streak} days</Text>
              </View>
              <View style={styles.goalCheck}>
                {progress.streak > 0 && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    color: '#6366F1',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
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
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  pathIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pathEmoji: {
    fontSize: 26,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  pathDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  pathArrow: {
    color: '#fff',
    fontSize: 24,
  },
  goalsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  goalEmoji: {
    fontSize: 22,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  goalProgress: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  goalCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
  checkPending: {
    color: '#4B5563',
    fontSize: 18,
  },
});
