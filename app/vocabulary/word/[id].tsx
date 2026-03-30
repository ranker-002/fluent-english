import { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Animated, 
  Dimensions,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore, VocabularyCategory, FlashCard } from '../../../store/useStore';
import { AnimatedBackground } from '../../../components/effects/AnimatedBackground';
import { GlassCard } from '../../../components/ui/GlassCard';
import { NeoButton } from '../../../components/ui/NeoButton';
import { Theme } from '../../../theme';

const { width } = Dimensions.get('window');

/**
 * VocabularyDetailScreen — shows details for a single vocabulary word
 * including definition, example, and pronunciation.
 */
export default function VocabularyDetailScreen() {
  const router = useRouter();
  const { wordId, categoryId } = useLocalSearchParams<{ wordId: string; categoryId: string }>();
  const { vocabularyCategories, flashcards, addXP } = useStore();

  const [showTranslation, setShowTranslation] = useState(false);

  const category = vocabularyCategories.find((c: VocabularyCategory) => c.id === categoryId);
  const wordData = category?.words.find((w: { word: string; translation: string; example: string }) => w.word === wordId);
  const flashcard = flashcards.find((f: FlashCard) => f.word === wordId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!wordData || !category) {
    return (
      <AnimatedBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Word not found</Text>
          <NeoButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </AnimatedBackground>
    );
  }

  const isMastered = flashcard?.mastered || false;

  const handleSpeak = () => {
    // Use expo-speech to pronounce the word
    // (Import dynamically to avoid issues if not installed)
    if (typeof Speech !== 'undefined') {
      Speech.speak(wordData.word, {
        language: 'en-US',
        rate: 0.8,
      });
    }
  };

  const handleAddToFlashcards = () => {
    // In a real app, this would add to flashcards if not already present
    // Since we already have flashcards linked by word, just show a message
    Alert.alert('Already in Flashcards', 'This word is already in your flashcard deck.');
  };

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            },
          ]}
        >
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          
          <View style={styles.headerContent}>
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text style={[styles.categoryName, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
            
            <Text style={styles.word}>{wordData.word}</Text>
            
            <View style={styles.pronunciationRow}>
              <Text style={styles.pronunciation}>{flashcard?.pronunciation || 'N/A'}</Text>
              <Pressable 
                onPress={handleSpeak}
                style={styles.speakButton}
                accessibilityRole="button"
                accessibilityLabel="Listen to pronunciation"
              >
                <Text style={styles.speakEmoji}>🔊</Text>
              </Pressable>
            </View>

            {isMastered && (
              <View style={styles.masteredBadge}>
                <Text style={styles.masteredText}>✓ Mastered</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Translation Card */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Pressable onPress={() => setShowTranslation(!showTranslation)}>
            <GlassCard style={styles.translationCard} gradient>
              <Text style={styles.cardLabel}>Translation</Text>
              <Text style={showTranslation ? styles.translationVisible : styles.translationHidden}>
                {wordData.translation}
              </Text>
              <Text style={styles.tapToReveal}>
                {showTranslation ? 'Tap to hide' : 'Tap to reveal'}
              </Text>
            </GlassCard>
          </Pressable>
        </Animated.View>

        {/* Example Card */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <GlassCard style={styles.exampleCard} bordered>
            <View style={styles.exampleHeader}>
              <Text style={styles.exampleLabel}>Example Sentence</Text>
            </View>
            <Text style={styles.exampleText}>"{wordData.example}"</Text>
          </GlassCard>
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actionSection, { opacity: fadeAnim }]}>
          <NeoButton
            title={isMastered ? 'Review in Flashcards' : 'Add to Flashcards'}
            onPress={handleAddToFlashcards}
            variant={isMastered ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            icon={<Text style={styles.actionIcon}>{isMastered ? '🔄' : '➕'}</Text>}
            iconPosition="left"
          />
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge + Theme.spacing.lg,
    paddingBottom: Theme.spacing.hugePlus,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  errorText: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xl,
  },
  header: {
    marginBottom: Theme.spacing.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
  },
  backText: {
    color: Theme.colors.text.primary,
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryName: {
    ...Theme.typography.overline,
    fontWeight: '600' as const,
  },
  word: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  pronunciation: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontFamily: 'monospace',
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  speakEmoji: {
    fontSize: 16,
  },
  masteredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.success + '20',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginTop: Theme.spacing.sm,
  },
  masteredText: {
    ...Theme.typography.caption,
    color: Theme.colors.success,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  translationCard: {
    padding: Theme.spacing.lg,
  },
  cardLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
  translationVisible: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  translationHidden: {
    ...Theme.typography.heading3,
    color: 'transparent',
    marginBottom: Theme.spacing.sm,
  },
  tapToReveal: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: Theme.spacing.xs,
  },
  exampleCard: {
    padding: Theme.spacing.lg,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  exampleLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
  },
  exampleText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  actionSection: {
    marginTop: Theme.spacing.xl,
  },
  actionIcon: {
    fontSize: 18,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
