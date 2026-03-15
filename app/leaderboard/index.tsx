import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Sarah M.', avatar: '👩', xp: 15420, level: 32, streak: 45 },
  { id: '2', name: 'John D.', avatar: '👨', xp: 12350, level: 25, streak: 30 },
  { id: '3', name: 'Emma W.', avatar: '👩‍🦰', xp: 10890, level: 22, streak: 28 },
  { id: '4', name: 'Mike T.', avatar: '👨‍🦲', xp: 8750, level: 18, streak: 15 },
  { id: '5', name: 'Lisa K.', avatar: '👩‍🦱', xp: 7200, level: 15, streak: 21 },
  { id: '6', name: 'David R.', avatar: '👨', xp: 6500, level: 14, streak: 12 },
  { id: '7', name: 'Anna P.', avatar: '👩', xp: 5800, level: 12, streak: 8 },
  { id: '8', name: 'Tom H.', avatar: '👨', xp: 4200, level: 9, streak: 5 },
  { id: '9', name: 'Julia S.', avatar: '👩‍🦰', xp: 3100, level: 7, streak: 3 },
  { id: '10', name: 'Chris B.', avatar: '👨', xp: 2500, level: 6, streak: 2 },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const { progress } = useStore();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const currentUserRank = mockLeaderboard.findIndex((u) => u.xp < progress.xp) + 1 || mockLeaderboard.length + 1;
  
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Leaderboard</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <Animated.View style={[styles.topThree, { opacity: fadeAnim }]}>
          {mockLeaderboard.slice(0, 3).map((user, index) => {
            const actualIndex = index;
            const isFirst = actualIndex === 0;
            
            return (
              <View key={user.id} style={[styles.topUserCard, isFirst && styles.firstPlace]}>
                <View style={[styles.topAvatar, isFirst && styles.firstAvatar]}>
                  <Text style={styles.topAvatarEmoji}>{user.avatar}</Text>
                  {isFirst && <View style={styles.crown}><Text style={styles.crownEmoji}>👑</Text></View>}
                </View>
                <Text style={styles.topName}>{user.name}</Text>
                <Text style={[styles.topXP, isFirst && styles.firstXP]}>{user.xp.toLocaleString()} XP</Text>
                <View style={styles.topStreak}>
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <Text style={styles.streakText}>{user.streak}</Text>
                </View>
              </View>
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.filterContainer, { opacity: fadeAnim }]}>
          {(['week', 'month', 'all'] as const).map((filter) => (
            <Pressable
              key={filter}
              style={[styles.filterButton, timeFilter === filter && styles.filterButtonActive]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text style={[styles.filterText, timeFilter === filter && styles.filterTextActive]}>
                {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View style={[styles.leaderboardList, { opacity: fadeAnim }]}>
          {mockLeaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = rank === currentUserRank;
            
            return (
              <View key={user.id} style={[styles.userCard, isCurrentUser && styles.currentUserCard]}>
                <Text style={[styles.rankText, rank <= 3 && styles.topRank]}>
                  {getRankEmoji(rank)}
                </Text>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarEmoji}>{user.avatar}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userLevel}>Level {user.level}</Text>
                </View>
                <View style={styles.userStats}>
                  <Text style={styles.userXP}>{user.xp.toLocaleString()} XP</Text>
                  <View style={styles.userStreak}>
                    <Text style={styles.userStreakEmoji}>🔥</Text>
                    <Text style={styles.userStreakText}>{user.streak}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.yourRank, { opacity: fadeAnim }]}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.yourRankGradient}>
            <Text style={styles.yourRankLabel}>Your Rank</Text>
            <View style={styles.yourRankContent}>
              <View style={styles.yourRankAvatar}>
                <Text style={styles.yourRankAvatarEmoji}>🇫🇷</Text>
              </View>
              <View style={styles.yourRankInfo}>
                <Text style={styles.yourRankName}>You</Text>
                <Text style={styles.yourRankLevel}>Level {progress.level}</Text>
              </View>
              <View style={styles.yourRankStats}>
                <Text style={styles.yourRankXP}>{progress.xp.toLocaleString()} XP</Text>
                <View style={styles.yourRankStreak}>
                  <Text style={styles.yourRankStreakEmoji}>🔥</Text>
                  <Text style={styles.yourRankStreakText}>{progress.streak} days</Text>
                </View>
              </View>
              <View style={styles.yourRankPosition}>
                <Text style={styles.yourRankPositionText}>#{currentUserRank}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 22 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  placeholder: { width: 44 },
  topThree: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 30, gap: 10 },
  topUserCard: { alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 20, padding: 16, width: width * 0.28 },
  firstPlace: { backgroundColor: '#1A1A2E', paddingBottom: 24, width: width * 0.32 },
  topAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2D2D44', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  firstAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFD93D', borderWidth: 3, borderColor: '#FFD93D' },
  topAvatarEmoji: { fontSize: 28 },
  crown: { position: 'absolute', top: -15 },
  crownEmoji: { fontSize: 20 },
  topName: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  topXP: { color: '#9CA3AF', fontSize: 12 },
  firstXP: { color: '#FFD93D', fontSize: 14, fontWeight: '700 },
  topStreak: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  streakEmoji: { fontSize: 12 },
  streakText: { color: '#9CA3AF', fontSize: 12 },
  filterContainer: { flexDirection: 'row', backgroundColor: '#1A1A2E', borderRadius: 14, padding: 4, marginBottom: 20 },
  filterButton: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  filterButtonActive: { backgroundColor: '#6366F1' },
  filterText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  leaderboardList: { marginBottom: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 16, padding: 14, marginBottom: 10 },
  currentUserCard: { borderWidth: 2, borderColor: '#6366F1' },
  rankText: { width: 40, color: '#9CA3AF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  topRank: { fontSize: 20 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2D2D44', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  userAvatarEmoji: { fontSize: 20 },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  userLevel: { color: '#6B7280', fontSize: 12 },
  userStats: { alignItems: 'flex-end' },
  userXP: { color: '#fff', fontSize: 14, fontWeight: '700' },
  userStreak: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  userStreakEmoji: { fontSize: 10 },
  userStreakText: { color: '#6B7280', fontSize: 11 },
  yourRank: { borderRadius: 20, overflow: 'hidden' },
  yourRankGradient: { padding: 20 },
  yourRankLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600', marginBottom: 12 },
  yourRankContent: { flexDirection: 'row', alignItems: 'center' },
  yourRankAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  yourRankAvatarEmoji: { fontSize: 24 },
  yourRankInfo: { flex: 1 },
  yourRankName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  yourRankLevel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 13 },
  yourRankStats: { alignItems: 'flex-end', marginRight: 16 },
  yourRankXP: { color: '#fff', fontSize: 16, fontWeight: '700' },
  yourRankStreak: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  yourRankStreakEmoji: { fontSize: 12 },
  yourRankStreakText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 },
  yourRankPosition: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  yourRankPositionText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
