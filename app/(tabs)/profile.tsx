import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { progress, lessons, flashcards, resetProgress } = useStore();

  const completedLessons = lessons.filter(l => l.completed).length;
  const masteredWords = flashcards.filter(c => c.mastered).length;
  const totalLessons = lessons.length;
  const totalWords = flashcards.length;

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetProgress();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>FL</Text>
            </LinearGradient>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lvl {progress.level}</Text>
            </View>
          </View>
          <Text style={styles.userName}>English Learner</Text>
          <Text style={styles.userSubtitle}>Keep learning every day!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Pressable 
            style={styles.quickAction}
            onPress={() => router.push('/analytics')}
          >
            <View style={[styles.quickIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
              <Text style={styles.quickEmoji}>📊</Text>
            </View>
            <Text style={styles.quickLabel}>Analytics</Text>
          </Pressable>
          
          <Pressable 
            style={styles.quickAction}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.quickIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
              <Text style={styles.quickEmoji}>⚙️</Text>
            </View>
            <Text style={styles.quickLabel}>Settings</Text>
          </Pressable>
          
          <Pressable 
            style={styles.quickAction}
            onPress={() => router.push('/grammar')}
          >
            <View style={[styles.quickIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Text style={styles.quickEmoji}>📖</Text>
            </View>
            <Text style={styles.quickLabel}>Grammar</Text>
          </Pressable>
          
          <Pressable 
            style={styles.quickAction}
            onPress={() => router.push('/vocabulary')}
          >
            <View style={[styles.quickIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Text style={styles.quickEmoji}>📚</Text>
            </View>
            <Text style={styles.quickLabel}>Vocabulary</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Lessons Completed</Text>
              <Text style={styles.progressValue}>{completedLessons}/{totalLessons}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedLessons / totalLessons) * 100}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Words Mastered</Text>
              <Text style={styles.progressValue}>{masteredWords}/{totalWords}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(masteredWords / totalWords) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            <View style={[styles.achievementCard, progress.lessonsCompleted >= 1 && styles.achievementUnlocked]}>
              <Text style={styles.achievementEmoji}>🎯</Text>
              <Text style={styles.achievementTitle}>First Lesson</Text>
            </View>
            <View style={[styles.achievementCard, progress.streak >= 3 && styles.achievementUnlocked]}>
              <Text style={styles.achievementEmoji}>🔥</Text>
              <Text style={styles.achievementTitle}>3 Day Streak</Text>
            </View>
            <View style={[styles.achievementCard, masteredWords >= 5 && styles.achievementUnlocked]}>
              <Text style={styles.achievementEmoji}>📚</Text>
              <Text style={styles.achievementTitle}>5 Words</Text>
            </View>
            <View style={[styles.achievementCard, progress.level >= 3 && styles.achievementUnlocked]}>
              <Text style={styles.achievementEmoji}>⭐</Text>
              <Text style={styles.achievementTitle}>Level 3</Text>
            </View>
            <View style={[styles.achievementCard, completedLessons >= 5 && styles.achievementUnlocked]}>
              <Text style={styles.achievementEmoji}>🎓</Text>
              <Text style={styles.achievementTitle}>5 Lessons</Text>
            </View>
            <View style={[styles.achievementCard, progress.streak >= 7 && styles.achievementUnlocked]}>
              <Text style={styles.achievementEmoji}>💎</Text>
              <Text style={styles.achievementTitle}>Week Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsList}>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingArrow}>→</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingIcon}>🎨</Text>
              <Text style={styles.settingText}>Appearance</Text>
              <Text style={styles.settingArrow}>→</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingText}>Sound & Speech</Text>
              <Text style={styles.settingArrow}>→</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingIcon}>📖</Text>
              <Text style={styles.settingText}>Learning Goals</Text>
              <Text style={styles.settingArrow}>→</Text>
            </Pressable>

            <Pressable 
              style={[styles.settingItem, styles.settingDanger]}
              onPress={handleResetProgress}
            >
              <Text style={styles.settingIcon}>🗑️</Text>
              <Text style={[styles.settingText, styles.settingDangerText]}>Reset Progress</Text>
              <Text style={styles.settingArrow}>→</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.version}>Fluent English v1.0.0</Text>
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
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#6366F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userSubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  statsContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
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
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 16,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickEmoji: {
    fontSize: 24,
  },
  quickLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  progressValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  achievementEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  achievementTitle: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
  },
  settingsList: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  settingDanger: {
    marginTop: 8,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  settingText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  settingDangerText: {
    color: '#EF4444',
  },
  settingArrow: {
    color: '#6B7280',
    fontSize: 18,
  },
  version: {
    color: '#4B5563',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
