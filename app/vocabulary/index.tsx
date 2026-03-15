import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function VocabularyScreen() {
  const router = useRouter();
  const { vocabularyCategories, flashcards } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A2E']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Pressable onPress={() => setSelectedCategory(null)} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <View style={styles.headerInfo}>
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.wordsContent}
          >
            {category.words.map((word, index) => (
              <Pressable 
                key={index}
                onPress={() => speakWord(word.word)}
                style={({ pressed }) => [
                  styles.wordCard,
                  pressed && styles.wordCardPressed,
                ]}
              >
                <View style={styles.wordHeader}>
                  <Text style={styles.word}>{word.word}</Text>
                  <Pressable onPress={() => speakWord(word.word)} style={styles.speakButton}>
                    <Text style={styles.speakEmoji}>🔊</Text>
                  </Pressable>
                </View>
                <Text style={styles.translation}>{word.translation}</Text>
                <Text style={styles.example}>"{word.example}"</Text>
              </Pressable>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

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
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Vocabulary</Text>
            <Text style={styles.subtitle}>{masteredWords}/{totalWords} words mastered</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#EC4899', '#F472B6']}
            style={styles.progressGradient}
          >
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Build Your Vocabulary</Text>
              <Text style={styles.progressDesc}>
                Learn new words in different contexts
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(masteredWords / totalWords) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
              >
                <LinearGradient
                  colors={[category.color, category.color + 'CC']}
                  style={styles.categoryCard}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.words.length} words</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Quick Review</Text>
          
          <View style={styles.reviewCards}>
            {flashcards.slice(0, 5).map((card) => (
              <Pressable
                key={card.id}
                onPress={() => speakWord(card.word)}
                style={styles.reviewCard}
              >
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
              </Pressable>
            ))}
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
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 22,
  },
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  progressCard: {
    marginBottom: 30,
    borderRadius: 24,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 24,
  },
  progressContent: {},
  progressTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    padding: 20,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  reviewCards: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewWord: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reviewSpeak: {
    fontSize: 18,
  },
  reviewTranslation: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  masteredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  masteredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  wordsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  wordCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  wordCardPressed: {
    opacity: 0.8,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  word: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  speakButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakEmoji: {
    fontSize: 18,
  },
  translation: {
    color: '#6366F1',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  example: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
