import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

interface OnboardingData {
  screen: number;
  title: string;
  subtitle: string;
  emoji: string;
  accent: string;
}

const screens: OnboardingData[] = [
  {
    screen: 0,
    title: 'Welcome to Fluent',
    subtitle: 'Your personal English learning journey starts here',
    emoji: '🌟',
    accent: Theme.colors.primary,
  },
  {
    screen: 1,
    title: 'Learn Your Way',
    subtitle: 'Interactive lessons, voice training, and real conversations',
    emoji: '📚',
    accent: Theme.colors.accentPink,
  },
  {
    screen: 2,
    title: 'Track Progress',
    subtitle: 'See your improvement with detailed analytics and streaks',
    emoji: '📊',
    accent: Theme.colors.success,
  },
  {
    screen: 3,
    title: 'Join the Community',
    subtitle: 'Learn alongside millions of students worldwide',
    emoji: '🌍',
    accent: Theme.colors.accent,
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
    { useNativeDriver: false } // scrollX used for interpolation, can be false
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
      <AnimatedBackground>
        <Animated.View 
          style={[
            styles.levelContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.levelContent}>
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
                <GlassCard gradient style={styles.levelCard}>
                  <LinearGradient
                    colors={[Theme.colors.success, '#34D399']}
                    style={styles.levelIconBox}
                  >
                    <Text style={styles.levelEmoji}>🌱</Text>
                  </LinearGradient>
                  <Text style={styles.levelName}>Beginner</Text>
                  <Text style={styles.levelDesc}>Just starting out</Text>
                </GlassCard>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.levelOption,
                  pressed && styles.levelOptionPressed,
                ]}
                onPress={() => handleSelectLevel('intermediate')}
              >
                <GlassCard gradient style={styles.levelCard}>
                  <LinearGradient
                    colors={[Theme.colors.primary, Theme.colors.primaryLight]}
                    style={styles.levelIconBox}
                  >
                    <Text style={styles.levelEmoji}>🌿</Text>
                  </LinearGradient>
                  <Text style={styles.levelName}>Intermediate</Text>
                  <Text style={styles.levelDesc}>Can hold conversations</Text>
                </GlassCard>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [
                  styles.levelOption,
                  pressed && styles.levelOptionPressed,
                ]}
                onPress={() => handleSelectLevel('advanced')}
              >
                <GlassCard gradient style={styles.levelCard}>
                  <LinearGradient
                    colors={[Theme.colors.accentPink, '#F472B6']}
                    style={styles.levelIconBox}
                  >
                    <Text style={styles.levelEmoji}>🌳</Text>
                  </LinearGradient>
                  <Text style={styles.levelName}>Advanced</Text>
                  <Text style={styles.levelDesc}>Fluent speaker</Text>
                </GlassCard>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </AnimatedBackground>
    );
  }

  const currentData = screens[currentScreen];

  return (
    <AnimatedBackground>
      <View style={styles.container}>
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
                  <GlassCard style={styles.illustrationCard} gradient glow>
                    <Text style={styles.illustrationEmoji}>{screen.emoji}</Text>
                  </GlassCard>
                  <View style={[styles.illustrationGlow, { backgroundColor: screen.accent }]} />
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
                    outputRange: [Theme.colors.surfaceBorder, Theme.colors.primary, Theme.colors.surfaceBorder],
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
          <NeoButton
            title={currentScreen === screens.length - 1 ? 'Get Started' : 'Continue'}
            onPress={handleNext}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Text style={styles.buttonArrow}>→</Text>}
            iconPosition="right"
          />
        </Animated.View>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: Theme.spacing.huge,
    right: Theme.spacing.xl,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
  },
  skipText: {
    color: Theme.colors.text.secondary,
    ...Theme.typography.body,
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xxl,
    paddingTop: Theme.spacing.hugePlus,
  },
  illustrationContainer: {
    marginBottom: Theme.spacing.xxxl,
  },
  illustration: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationCard: {
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
    opacity: 0.3,
    zIndex: -1,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Theme.spacing.xl,
    gap: Theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.hugePlus,
  },
  buttonArrow: {
    fontSize: 20,
  },
  levelContainer: {
    flex: 1,
  },
  levelContent: {
    flex: 1,
    justifyContent: 'center',
  },
  levelTitle: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  levelSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xxxl,
  },
  levelOptions: {
    gap: Theme.spacing.md,
  },
  levelOption: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  levelOptionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  levelCard: {
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIconBox: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.lg,
  },
  levelEmoji: {
    fontSize: 32,
  },
  levelName: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 20,
    marginBottom: Theme.spacing.xs,
  },
  levelDesc: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
});
