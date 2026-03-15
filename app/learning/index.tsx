import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function LearningScreen() {
  const router = useRouter();
  const { lessons, progress } = useStore();

  const completedCount = lessons.filter(l => l.completed).length;
  const inProgressCount = lessons.filter(l => !l.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Learning</Text>
          <Text style={styles.subtitle}>Your personalized path</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{lessons.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Lessons</Text>
          
          {lessons.map((lesson, index) => (
            <Pressable 
              key={lesson.id}
              onPress={() => router.push('/learning/flashcard')}
            >
              <LinearGradient
                colors={[
                  index % 3 === 0 ? '#6366F1' : index % 3 === 1 ? '#EC4899' : '#10B981',
                  index % 3 === 0 ? '#8B5CF6' : index % 3 === 1 ? '#F472B6' : '#34D399',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lessonCard}
              >
                <View style={styles.lessonContent}>
                  <View style={styles.lessonNumber}>
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonDescription}>{lesson.description}</Text>
                    <View style={styles.lessonMeta}>
                      <Text style={styles.lessonDuration}>⏱️ {lesson.duration} min</Text>
                      <Text style={styles.lessonXP}>+{lesson.xp} XP</Text>
                    </View>
                  </View>
                  {lesson.completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedIcon}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.playButton}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Pressable>
          ))}
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#6366F1',
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 13,
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
  lessonCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lessonNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  lessonDuration: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
  lessonXP: {
    color: '#FFD93D',
    fontSize: 13,
    fontWeight: '600',
  },
  completedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 2,
  },
});
