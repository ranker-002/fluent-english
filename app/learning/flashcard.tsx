import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

const { width, height } = Dimensions.get('window');

export default function FlashcardScreen() {
  const router = useRouter();
  const { flashcards, completeFlashcard, addXP } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  
  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const nextCardAnim = useRef(new Animated.Value(width)).current;

  const currentCard = flashcards[currentIndex];

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      tension: 10,
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
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardAnim, {
        toValue: 0,
        duration: 300,
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
      nextCardAnim.setValue(width);
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
        <Text style={styles.emptyText}>No flashcards available</Text>
      </View>
    );
  }

  const masteredCount = flashcards.filter(c => c.mastered).length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {flashcards.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentIndex + 1) / flashcards.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.cardContainer}>
          <Pressable onPress={flipCard} style={styles.cardWrapper}>
            <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <Text style={styles.tapHint}>Tap to flip</Text>
                <Text style={styles.word}>{currentCard.word}</Text>
                <Pressable onPress={speakWord} style={styles.speakButton}>
                  <Text style={styles.speakEmoji}>🔊</Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>

            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
              <LinearGradient
                colors={['#1A1A2E', '#2D2D44']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <Text style={styles.translation}>{currentCard.translation}</Text>
                <View style={styles.divider} />
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.example}>{currentCard.example}</Text>
                <Text style={styles.pronunciation}>{currentCard.pronunciation}</Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>

        <View style={styles.swipeHints}>
          <Pressable 
            style={[styles.swipeButton, styles.swipeLeft]}
            onPress={() => handleSwipe('left')}
          >
            <Text style={styles.swipeLeftText}>✕</Text>
            <Text style={styles.swipeLabel}>Skip</Text>
          </Pressable>
          
          <View style={styles.actionButtons}>
            <Pressable onPress={flipCard} style={styles.actionButton}>
              <Text style={styles.actionEmoji}>🔄</Text>
            </Pressable>
            <Pressable onPress={speakWord} style={styles.actionButton}>
              <Text style={styles.actionEmoji}>🔊</Text>
            </Pressable>
          </View>

          <Pressable 
            style={[styles.swipeButton, styles.swipeRight]}
            onPress={() => handleSwipe('right')}
          >
            <Text style={styles.swipeRightText}>✓</Text>
            <Text style={styles.swipeLabel}>Mastered</Text>
          </Pressable>
        </View>

        <View style={styles.masteredInfo}>
          <Text style={styles.masteredText}>
            {masteredCount} words mastered
          </Text>
        </View>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  progressInfo: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: 150,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  placeholder: {
    width: 40,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: width - 40,
    height: 400,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
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
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  tapHint: {
    position: 'absolute',
    top: 20,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  word: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  speakButton: {
    position: 'absolute',
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakEmoji: {
    fontSize: 28,
  },
  translation: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  exampleLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  example: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  pronunciation: {
    color: '#A5B4FC',
    fontSize: 16,
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  swipeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  swipeLeft: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  swipeRight: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  swipeLeftText: {
    color: '#EF4444',
    fontSize: 28,
    fontWeight: '700',
  },
  swipeRightText: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: '700',
  },
  swipeLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 24,
  },
  masteredInfo: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  masteredText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
