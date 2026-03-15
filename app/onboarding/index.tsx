import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width, height } = Dimensions.get('window');

interface OnboardingData {
  screen: number;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: [string, string];
}

const screens: OnboardingData[] = [
  {
    screen: 0,
    title: 'Welcome to Fluent',
    subtitle: 'Your personal English learning journey starts here',
    emoji: '🌟',
    gradient: ['#6366F1', '#8B5CF6'],
  },
  {
    screen: 1,
    title: 'Learn Your Way',
    subtitle: 'Interactive lessons, voice training, and real conversations',
    emoji: '📚',
    gradient: ['#EC4899', '#F472B6'],
  },
  {
    screen: 2,
    title: 'Track Progress',
    subtitle: 'See your improvement with detailed analytics',
    emoji: '📊',
    gradient: ['#10B981', '#34D399'],
  },
  {
    screen: 3,
    title: 'Join the Community',
    subtitle: 'Learn alongside millions of students worldwide',
    emoji: '🌍',
    gradient: ['#F59E0B', '#FBBF24'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding, setUserLevel } = useStore();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(buttonAnim, {
      toValue: 1,
      delay: 300,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      setShowLevelPicker(true);
    }
  };

  const handleSkip = () => {
    setShowLevelPicker(true);
  };

  const handleSelectLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setUserLevel(level);
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  };

  if (showLevelPicker) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        >
          <Animated.View 
            style={[
              styles.levelContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.levelTitle}>What's your English level?</Text>
            <Text style={styles.levelSubtitle}>
              We'll personalize your learning experience
            </Text>

            <View style={styles.levelOptions}>
              <Pressable 
                style={({ pressed }) => [
                  styles.levelOption,
                  pressed && styles.levelOptionPressed,
                ]}
                onPress={() => handleSelectLevel('beginner')}
              >
                <LinearGradient
                  colors={['#10B981', '#34D399']}
                  style={styles.levelGradient}
                >
                  <Text style={styles.levelEmoji}>🌱</Text>
                  <Text style={styles.levelName}>Beginner</Text>
                  <Text style={styles.levelDesc}>Just starting out</Text>
                </LinearGradient>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.levelOption,
                  pressed && styles.levelOptionPressed,
                ]}
                onPress={() => handleSelectLevel('intermediate')}
              >
                <LinearGradient
                  colors:['#6366F1', '#8B5CF6']}
                  style={styles.levelGradient}
                >
                  <Text style={styles.levelEmoji}>🌿</Text>
                  <Text style={styles.levelName}>Intermediate</Text>
                  <Text style={styles.levelDesc}>Can hold conversations</Text>
                </LinearGradient>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.levelOption,
                  pressed && styles.levelOptionPressed,
                ]}
                onPress={() => handleSelectLevel('advanced')}
              >
                <LinearGradient
                  colors={['#EC4899', '#F472B6']}
                  style={styles.levelGradient}
                >
                  <Text style={styles.levelEmoji}>🌳</Text>
                  <Text style={styles.levelName}>Advanced</Text>
                  <Text style={styles.levelDesc}>Fluent speaker</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  const currentData = screens[currentScreen];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.skipContainer, { opacity: fadeAnim }]}>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </Animated.View>

        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {screens.map((screen, index) => (
            <View key={screen.screen} style={styles.screen}>
              <Animated.View 
                style={[
                  styles.illustrationContainer,
                  {
                    transform: [
                      {
                        scale: scrollX.interpolate({
                          inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                          ],
                          outputRange: [0.8, 1, 0.8],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.illustration}>
                  <LinearGradient
                    colors={screen.gradient}
                    style={styles.illustrationGradient}
                  >
                    <Text style={styles.illustrationEmoji}>{screen.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.illustrationGlow} />
                </View>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.textContainer,
                  {
                    opacity: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                      ],
                      outputRange: [0.3, 1, 0.3],
                      extrapolate: 'clamp',
                    }),
                    transform: [
                      {
                        translateY: scrollX.interpolate({
                          inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                          ],
                          outputRange: [30, 0, 30],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.title}>{screen.title}</Text>
                <Text style={styles.subtitle}>{screen.subtitle}</Text>
              </Animated.View>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.pagination}>
          {screens.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: scrollX.interpolate({
                    inputRange: [
                      (index - 1) * width,
                      index * width,
                      (index + 1) * width,
                    ],
                    outputRange: ['#374151', '#6366F1', '#374151'],
                    extrapolate: 'clamp',
                  }),
                  width: scrollX.interpolate({
                    inputRange: [
                      (index - 1) * width,
                      index * width,
                      (index + 1) * width,
                    ],
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={[styles.buttonContainer, { opacity: buttonAnim }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleNext}
          >
            <LinearGradient
              colors={currentData.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {currentScreen === screens.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  gradient: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  illustrationContainer: {
    marginBottom: 50,
  },
  illustration: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  illustrationGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6366F1',
    opacity: 0.3,
    zIndex: -1,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 28,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  levelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  levelTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  levelSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
  },
  levelOptions: {
    width: '100%',
    gap: 16,
  },
  levelOption: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  levelOptionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  levelGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  levelEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  levelName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  levelDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});
