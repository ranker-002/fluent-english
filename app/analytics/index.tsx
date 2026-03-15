import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const { progress, lessons, grammarLessons, flashcards, achievements, dailyGoals } = useStore();
  
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

  const completedLessons = lessons.filter(l => l.completed).length;
  const completedGrammar = grammarLessons.filter(l => l.completed).length;
  const masteredWords = flashcards.filter(c => c.mastered).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completedDailyGoals = dailyGoals.filter(g => g.completed).length;

  const xpToNextLevel = 500 - (progress.xp % 500);
  const xpProgress = (progress.xp % 500) / 5;

  const getWeekdayProgress = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const weekData = [];
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today - 6 + i + 7) % 7;
      weekData.push({
        day: days[dayIndex],
        active: i <= progress.streak % 7,
      });
    }
    return weekData;
  };

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
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track your learning journey</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.levelCard, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            style={styles.levelGradient}
          >
            <View style={styles.levelHeader}>
              <View>
                <Text style={styles.levelLabel}>Current Level</Text>
                <Text style={styles.levelValue}>{progress.level}</Text>
              </View>
              <View style={styles.xpBadge}>
                <Text style={styles.xpValue}>{progress.xp} XP</Text>
              </View>
            </View>
            <View style={styles.xpProgressContainer}>
              <View style={styles.xpProgressBar}>
                <View style={[styles.xpProgressFill, { width: `${xpProgress}%` }]} />
              </View>
              <Text style={styles.xpToNext}>{xpToNextLevel} XP to Level {progress.level + 1}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
              <Text style={styles.statEmoji}>📚</Text>
            </View>
            <Text style={styles.statValue}>{completedLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
            <Text style={styles.statTotal}>/ {lessons.length}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
              <Text style={styles.statEmoji}>📖</Text>
            </View>
            <Text style={styles.statValue}>{completedGrammar}</Text>
            <Text style={styles.statLabel}>Grammar</Text>
            <Text style={styles.statTotal}>/ {grammarLessons.length}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Text style={styles.statEmoji}>📝</Text>
            </View>
            <Text style={styles.statValue}>{masteredWords}</Text>
            <Text style={styles.statLabel}>Words</Text>
            <Text style={styles.statTotal}>/ {flashcards.length}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Text style={styles.statEmoji}>💬</Text>
            </View>
            <Text style={styles.statValue}>{progress.conversationsCompleted}</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          
          <View style={styles.weekCard}>
            <View style={styles.weekGrid}>
              {getWeekdayProgress().map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <View 
                    style={[
                      styles.dayDot,
                      day.active && styles.dayDotActive,
                    ]}
                  />
                  <Text style={[styles.dayLabel, day.active && styles.dayLabelActive]}>
                    {day.day}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.streakInfo}>
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{progress.streak}</Text>
                <Text style={styles.streakLabel}>Current Streak</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{progress.longestStreak}</Text>
                <Text style={styles.streakLabel}>Longest Streak</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          
          <View style={styles.goalsCard}>
            {dailyGoals.map((goal) => (
              <View key={goal.id} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalType}>
                    {goal.type === 'lessons' ? '📚 Complete Lessons' : 
                     goal.type === 'practice' ? '🎯 Practice Minutes' : '🔥 Keep Streak'}
                  </Text>
                  <Text style={styles.goalProgress}>
                    {goal.progress}/{goal.target}
                  </Text>
                </View>
                <View style={styles.goalBar}>
                  <View 
                    style={[
                      styles.goalFill,
                      { 
                        width: `${Math.min((goal.progress / goal.target) * 100, 100)}%`,
                        backgroundColor: goal.completed ? '#10B981' : '#6366F1',
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
            
            <View style={styles.goalsSummary}>
              <Text style={styles.goalsSummaryText}>
                {completedDailyGoals}/{dailyGoals.length} goals completed today
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementsCard}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsCount}>
                {unlockedAchievements}/{achievements.length}
              </Text>
              <Text style={styles.achievementsLabel}>unlocked</Text>
            </View>
            
            <View style={styles.achievementsGrid}>
              {achievements.slice(0, 6).map((achievement) => (
                <View 
                  key={achievement.id}
                  style={[
                    styles.achievementItem,
                    !achievement.unlocked && styles.achievementLocked,
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Skills Breakdown</Text>
          
          <View style={styles.skillsCard}>
            <View style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>Speaking</Text>
                <Text style={styles.skillPercent}>65%</Text>
              </View>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: '65%', backgroundColor: '#EC4899' }]} />
              </View>
            </View>
            
            <View style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>Vocabulary</Text>
                <Text style={styles.skillPercent}>45%</Text>
              </View>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: '45%', backgroundColor: '#10B981' }]} />
              </View>
            </View>
            
            <View style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>Grammar</Text>
                <Text style={styles.skillPercent}>30%</Text>
              </View>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: '30%', backgroundColor: '#6366F1' }]} />
              </View>
            </View>
            
            <View style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>Listening</Text>
                <Text style={styles.skillPercent}>55%</Text>
              </View>
              <View style={styles.skillBar}>
                <View style={[styles.skillFill, { width: '55%', backgroundColor: '#F59E0B' }]} />
              </View>
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
    marginBottom: 24,
  },
  headerLeft: {},
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
  levelCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  levelGradient: {
    padding: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  levelLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  levelValue: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '800',
  },
  xpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  xpValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  xpProgressContainer: {},
  xpProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  xpToNext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  statTotal: {
    color: '#6B7280',
    fontSize: 12,
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
  weekCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D2D44',
    marginBottom: 8,
  },
  dayDotActive: {
    backgroundColor: '#6366F1',
  },
  dayLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  dayLabelActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  streakValue: {
    color: '#F59E0B',
    fontSize: 32,
    fontWeight: '800',
  },
  streakLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2D2D44',
  },
  goalsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalType: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  goalProgress: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  goalBar: {
    height: 8,
    backgroundColor: '#2D2D44',
    borderRadius: 4,
  },
  goalFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalsSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D2D44',
  },
  goalsSummaryText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  achievementsCount: {
    color: '#6366F1',
    fontSize: 28,
    fontWeight: '800',
    marginRight: 8,
  },
  achievementsLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementLocked: {
    opacity: 0.4,
    backgroundColor: '#2D2D44',
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  achievementTitle: {
    color: '#9CA3AF',
    fontSize: 10,
    textAlign: 'center',
  },
  skillsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
  },
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  skillPercent: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  skillBar: {
    height: 8,
    backgroundColor: '#2D2D44',
    borderRadius: 4,
  },
  skillFill: {
    height: '100%',
    borderRadius: 4,
  },
});
