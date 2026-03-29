import { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  Dimensions, 
  PanResponder,
  AccessibilityInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';
import { Theme } from '../../theme';

const { width, height } = Dimensions.get('window');

/**
 * FlashcardScreen — a gorgeous, interactive card experience
 * with smooth 3D flip, swipe gestures, and beautiful gradients.
 */
export default function FlashcardScreen() {
  const router = useRouter();
  const { flashcards, completeFlashcard } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const nextCardAnim = useRef(new Animated.Value(0)).current;

  const currentCard = flashcards[currentIndex];

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      tension: 20,
      friction: 8,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentCard) return;
    
    setDirection(dir);
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: dir === 'right' ? width : -width,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (dir === 'right') {
        completeFlashcard(currentCard.id);
      }
      
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      setIsFlipped(false);
      flipAnim.setValue(0);
      slideAnim.setValue(0);
      nextCardAnim.setValue(0);
      setDirection(null);
    });
  };

  const speakWord = () => {
    if (currentCard) {
      Speech.speak(currentCard.word, {
        language: 'en-US',
        rate: 0.8,
      });
    }
  };

  const frontAnimatedStyle = {
    transform: [
      { translateX: slideAnim },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0],
    }),
  };

  const backAnimatedStyle = {
    transform: [
      { translateX: slideAnim },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    }),
  };

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={Theme.gradients.mesh} style={StyleSheet.absoluteFillObject} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>No flashcards yet</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.emptyLink}>Add some words first</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const masteredCount = flashcards.filter(c => c.mastered).length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={Theme.gradients.mesh} style={StyleSheet.absoluteFillObject} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>✕</Text>
        </Pressable>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {flashcards.length}
          </Text>
          <ProgressBar 
            progress={((currentIndex + 1) / flashcards.length) * 100} 
            variant="primary"
            height={4}
            animated
            style={styles.progressBar}
          />
        </View>

        <View style={styles.masteredBadge}>
          <Text style={styles.masteredCount}>{masteredCount} mastered</Text>
        </View>
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <Pressable onPress={flipCard} style={styles.cardWrapper}>
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
            <LinearGradient
              colors={[Theme.colors.primary, Theme.colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <Text style={styles.tapHint}>Tap to reveal translation</Text>
              <Text style={styles.word}>{currentCard.word}</Text>
              <Text style={styles.pronunciation}>{currentCard.pronunciation}</Text>
              
              <View style={styles.speakButton}>
                <Text style={styles.speakEmoji}>🔊</Text>
                <Text style={styles.speakLabel}>Listen</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <LinearGradient
              colors={[Theme.colors.surface, Theme.colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <Text style={styles.translationLabel}>Translation</Text>
              <Text style={styles.translation}>{currentCard.translation}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.exampleLabel}>Example</Text>
              <Text style={styles.example}>"{currentCard.example}"</Text>
              
              <View style={styles.tipBadge}>
                <Text style={styles.tipText}>💡 Tap word to hear pronunciation</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable 
          onPress={() => handleSwipe('left')}
          accessibilityRole="button"
          accessibilityLabel="Skip this card"
          style={styles.actionBtn}
        >
          <View style={styles.skipButton}>
            <Text style={styles.skipIcon}>✕</Text>
            <Text style={styles.actionLabel}>Skip</Text>
          </View>
        </Pressable>

        <Pressable onPress={flipCard} accessibilityRole="button" accessibilityLabel="Flip card">
          <View style={styles.flipButton}>
            <Text style={styles.flipIcon}>↻</Text>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => handleSwipe('right')}
          accessibilityRole="button"
          accessibilityLabel="Mark as mastered"
          style={styles.actionBtn}
        >
          <View style={styles.masterButton}>
            <Text style={styles.masterIcon}>✓</Text>
            <Text style={styles.actionLabel}>Master</Text>
          </View>
        </Pressable>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe right if you know it • Swipe left to skip • Tap to flip
        </Text>
      </View>
    </View>
  );
}

const progressBarStyles = StyleSheet.create({
  container: { width: '100%' },
  track: { width: '100%', overflow: 'hidden' },
  fill: { maxWidth: '100%' },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.md,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.5,
  },
  emptyText: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.secondary,
  },
  emptyLink: {
    ...Theme.typography.body,
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge + Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: Theme.colors.text.primary,
    fontSize: 20,
  },
  progressInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Theme.spacing.lg,
  },
  progressText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  progressBar: {
    width: 120,
  },
  masteredBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  masteredCount: {
    ...Theme.typography.overline,
    color: Theme.colors.success,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  cardWrapper: {
    width: width - 40,
    height: height * 0.5,
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.xxl,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 0,
  },
  cardGradient: {
    flex: 1,
    borderRadius: Theme.borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xxl,
    ...Theme.shadows.lg,
  },
  tapHint: {
    position: 'absolute',
    top: Theme.spacing.xl,
    ...Theme.typography.overline,
    color: 'rgba(255,255,255,0.6)',
  },
  word: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  pronunciation: {
    ...Theme.typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Theme.spacing.xxl,
  },
  speakButton: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },
  speakEmoji: {
    fontSize: 20,
  },
  speakLabel: {
    ...Theme.typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  translationLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.md,
  },
  translation: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Theme.colors.surfaceBorder,
    marginVertical: Theme.spacing.md,
  },
  exampleLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
  example: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Theme.spacing.lg,
  },
  tipBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  tipText: {
    ...Theme.typography.caption,
    color: Theme.colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
  },
  actionBtn: {
    width: 100,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
  },
  skipIcon: {
    fontSize: 20,
    color: Theme.colors.error,
    fontWeight: '700',
  },
  actionLabel: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.secondary,
  },
  flipButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.md,
  },
  flipIcon: {
    fontSize: 28,
    color: Theme.colors.primary,
  },
  masterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.success,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.md,
  },
  masterIcon: {
    fontSize: 20,
    color: Theme.colors.background,
    fontWeight: '700',
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: Theme.spacing.huge,
  },
  instructionText: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
