import { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Animated, 
  Dimensions, 
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

/**
 * VocabularyScreen — a beautiful, searchable vocabulary explorer
 * with category cards, word reviews, and smooth animations.
 */
export default function VocabularyScreen() {
  const router = useRouter();
  const { vocabularyCategories, flashcards } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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

  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: 'en-US',
      rate: 0.8,
    });
  };

  const masteredWords = flashcards.filter(c => c.mastered).length;
  const totalWords = flashcards.length + vocabularyCategories.reduce((acc, c) => acc + c.words.length, 0);

  const filteredCategories = searchQuery
    ? vocabularyCategories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : vocabularyCategories;

  if (selectedCategory) {
    const category = vocabularyCategories.find(c => c.id === selectedCategory);
    if (!category) return null;

    return (
      <AnimatedBackground>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wordsContent}
        >
          {/* Header */}
          <View style={styles.categoryHeader}>
            <Pressable 
              onPress={() => setSelectedCategory(null)} 
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to categories"
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <View style={styles.categoryTitleRow}>
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
            <Text style={styles.categoryCount}>{category.words.length} words</Text>
          </View>

          {/* Words List */}
          <View style={styles.wordsList}>
            {category.words.map((word, index) => (
              <Pressable 
                key={index}
                onPress={() => router.push({
                  pathname: '/vocabulary/word/[id]',
                  params: { 
                    id: word.word, 
                    categoryId: category.id 
                  },
                })}
                accessibilityRole="button"
                accessibilityLabel={`View ${word.word} details`}
                style={({ pressed }) => [
                  styles.wordCard,
                  pressed && styles.wordCardPressed,
                ]}
              >
                <GlassCard style={styles.wordCardInner} bordered>
                  <View style={styles.wordHeader}>
                    <View>
                      <Text style={styles.word}>{word.word}</Text>
                      <Text style={styles.translation}>{word.translation}</Text>
                    </View>
                    <Pressable 
                      onPress={() => speakWord(word.word)} 
                      style={styles.speakButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Listen to ${word.word}`}
                    >
                      <Text style={styles.speakEmoji}>🔊</Text>
                    </Pressable>
                  </View>
                  <View style={styles.exampleContainer}>
                    <Text style={styles.exampleLabel}>Example</Text>
                    <Text style={styles.example}>"{word.example}"</Text>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Vocabulary</Text>
          <Text style={styles.subtitle}>
            {masteredWords} / {totalWords} words mastered
          </Text>
        </Animated.View>

        {/* Search */}
        <Animated.View style={[styles.searchSection, { opacity: fadeAnim }]}>
          <GlassCard style={styles.searchCard} bordered>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor={Theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              accessibilityLabel="Search vocabulary categories"
            />
          </GlassCard>
        </Animated.View>

        {/* Overall Progress */}
        <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
          <GlassCard gradient style={styles.progressCard}>
            <Text style={styles.progressTitle}>Build Your Vocabulary</Text>
            <Text style={styles.progressDesc}>
              Learn new words in different contexts
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{masteredWords}</Text>
                <Text style={styles.progressStatLabel}>Mastered</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{filteredCategories.length}</Text>
                <Text style={styles.progressStatLabel}>Categories</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>
                  {filteredCategories.reduce((sum, c) => sum + c.words.length, 0)}
                </Text>
                <Text style={styles.progressStatLabel}>Total Words</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Categories Grid */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                accessibilityRole="button"
                accessibilityLabel={`${category.name} category, ${category.words.length} words`}
                style={styles.categoryWrapper}
              >
                <GlassCard style={styles.categoryCard} gradient>
                  <LinearGradient
                    colors={[category.color, category.color + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryGradient}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.selectedCategoryCount}>{category.words.length} words</Text>
                  </LinearGradient>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Quick Review */}
        {flashcards.length > 0 && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Quick Review</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewScroll}
            >
              {flashcards.slice(0, 5).map((card) => (
                <Pressable
                  key={card.id}
                  onPress={() => speakWord(card.word)}
                  accessibilityRole="button"
                  accessibilityLabel={`Review ${card.word}`}
                  style={styles.reviewWrapper}
                >
                  <GlassCard style={styles.reviewCard} bordered>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewWord}>{card.word}</Text>
                      <Pressable onPress={() => speakWord(card.word)}>
                        <Text style={styles.reviewSpeak}>🔊</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.reviewTranslation}>{card.translation}</Text>
                    {card.mastered && (
                      <View style={styles.masteredBadge}>
                        <Text style={styles.masteredText}>✓</Text>
                      </View>
                    )}
                  </GlassCard>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}

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
  header: {
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  searchSection: {
    marginBottom: Theme.spacing.xl,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.text.primary,
    ...Theme.typography.body,
  },
  progressSection: {
    marginBottom: Theme.spacing.xxl,
  },
  progressCard: {
    padding: Theme.spacing.xl,
  },
  progressTitle: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  progressDesc: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.lg,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
  },
  progressStatLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.xs,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: Theme.colors.surfaceBorder,
  },
  section: {
    marginBottom: Theme.spacing.xxl,
  },
  sectionTitle: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  categoryWrapper: {
    width: (width - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
  },
  categoryCard: {
    padding: 0,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: Theme.spacing.lg,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  categoryName: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  categoryCount: {
    ...Theme.typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  reviewScroll: {
    paddingRight: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  reviewWrapper: {
    width: width * 0.6,
  },
  reviewCard: {
    padding: Theme.spacing.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  reviewWord: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
  },
  reviewSpeak: {
    fontSize: 18,
  },
  reviewTranslation: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  masteredBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masteredText: {
    color: Theme.colors.background,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  wordsContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge,
    paddingBottom: Theme.spacing.hugePlus,
  },
  categoryHeader: {
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
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  categoryEmoji: {
    fontSize: 36,
  },
  categoryTitle: {
    ...Theme.typography.heading1,
    color: Theme.colors.text.primary,
  },
  selectedCategoryCount: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
  },
  wordsList: {
    gap: Theme.spacing.md,
  },
  wordCard: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  wordCardPressed: {
    opacity: 0.95,
  },
  wordCardInner: {
    padding: Theme.spacing.lg,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  word: {
    ...Theme.typography.heading3,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  translation: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.primary,
  },
  speakButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  speakEmoji: {
    fontSize: 18,
  },
  exampleContainer: {
    marginTop: Theme.spacing.sm,
  },
  exampleLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
    fontSize: 10,
  },
  example: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
