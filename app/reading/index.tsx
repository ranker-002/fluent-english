import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function ReadingScreen() {
  const router = useRouter();
  const { readingExercises, completeReadingExercise } = useStore();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const exercise = readingExercises[currentExercise];

  const speakContent = () => {
    if (exercise) {
      Speech.speak(exercise.content, { language: 'en-US', rate: 0.8 });
    }
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (showResult) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleCheckAnswers = () => {
    if (!exercise) return;
    
    let correctCount = 0;
    exercise.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResult(true);
    
    if (correctCount >= exercise.questions.length / 2) {
      completeReadingExercise(exercise.id);
    }
  };

  const handleNext = () => {
    if (currentExercise < readingExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswers({});
      setShowResult(false);
      setScore(0);
    } else {
      router.back();
    }
  };

  const completedCount = readingExercises.filter(e => e.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Reading</Text>
            <Text style={styles.subtitle}>{completedCount}/{readingExercises.length} completed</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <LinearGradient colors={['#EC4899', '#F472B6']} style={styles.progressGradient}>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Reading Comprehension</Text>
              <Text style={styles.progressDesc}>Read passages and answer questions</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(completedCount / readingExercises.length) * 100}%` }]} />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {exercise && (
          <Animated.View style={[styles.exerciseCard, { opacity: fadeAnim }]}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.levelBadge}>{exercise.level}</Text>
                <Text style={styles.duration}>⏱️ {exercise.duration} min</Text>
              </View>
            </View>

            <Pressable style={styles.listenButton} onPress={speakContent}>
              <Text style={styles.listenEmoji}>🔊</Text>
              <Text style={styles.listenText}>Listen</Text>
            </Pressable>

            <View style={styles.passageCard}>
              <Text style={styles.passageLabel}>📖 Passage</Text>
              <Text style={styles.passageContent}>{exercise.content}</Text>
              <Text style={styles.translationText}>{exercise.translation}</Text>
            </View>

            <View style={styles.questionsSection}>
              <Text style={styles.questionTitle}>Comprehension Questions</Text>
              
              {exercise.questions.map((q) => (
                <View key={q.id} style={styles.questionCard}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <View style={styles.optionsContainer}>
                    {q.options.map((option) => {
                      const isSelected = selectedAnswers[q.id] === option;
                      const isCorrect = showResult && option === q.correctAnswer;
                      const isWrong = showResult && isSelected && !isCorrect;
                      
                      return (
                        <Pressable
                          key={option}
                          style={[
                            styles.optionButton,
                            isSelected && styles.optionSelected,
                            isCorrect && styles.optionCorrect,
                            isWrong && styles.optionWrong,
                          ]}
                          onPress={() => handleSelectAnswer(q.id, option)}
                          disabled={showResult}
                        >
                          <Text style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}>{option}</Text>
                          {isCorrect && <Text style={styles.checkMark}>✓</Text>}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.actionContainer}>
              {!showResult ? (
                <Pressable
                  style={[styles.checkButton, Object.keys(selectedAnswers).length < exercise.questions.length && styles.checkButtonDisabled]}
                  onPress={handleCheckAnswers}
                  disabled={Object.keys(selectedAnswers).length < exercise.questions.length}
                >
                  <LinearGradient 
                    colors={Object.keys(selectedAnswers).length >= exercise.questions.length ? ['#6366F1', '#8B5CF6'] : ['#374151', '#4B5563']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.checkButtonText}>Check Answers</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>
                    You scored {score}/{exercise.questions.length}
                  </Text>
                  <Pressable style={styles.nextButton} onPress={handleNext}>
                    <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
                      <Text style={styles.nextButtonText}>
                        {currentExercise < readingExercises.length - 1 ? 'Next →' : 'Finish'}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 16 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 22 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  progressCard: { marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  progressGradient: { padding: 20 },
  progressTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  progressDesc: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginBottom: 12 },
  progressBar: { height: 6, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  exerciseCard: { backgroundColor: '#1A1A2E', borderRadius: 24, padding: 20 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  exerciseTitle: { color: '#fff', fontSize: 18, fontWeight: '700', flex: 1 },
  exerciseMeta: { flexDirection: 'row', gap: 10 },
  levelBadge: { backgroundColor: '#6366F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: '600' },
  duration: { color: '#9CA3AF', fontSize: 13 },
  listenButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(236, 72, 153, 0.2)', paddingVertical: 10, borderRadius: 12, marginBottom: 16, gap: 8 },
  listenEmoji: { fontSize: 18 },
  listenText: { color: '#EC4899', fontWeight: '600 },
  passageCard: { backgroundColor: '#2D2D44', borderRadius: 16, padding: 16, marginBottom: 20 },
  passageLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 10 },
  passageContent: { color: '#fff', fontSize: 15, lineHeight: 24 },
  translationText: { color: '#6B7280', fontSize: 13, marginTop: 12, fontStyle: 'italic' },
  questionsSection: {},
  questionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  questionCard: { marginBottom: 20 },
  questionText: { color: '#fff', fontSize: 15, marginBottom: 12 },
  optionsContainer: { gap: 8 },
  optionButton: { backgroundColor: '#2D2D44', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 2, borderColor: 'transparent' },
  optionSelected: { borderColor: '#EC4899', backgroundColor: 'rgba(236, 72, 153, 0.1)' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  optionText: { color: '#fff', fontSize: 14 },
  optionTextSelected: { fontWeight: '600' },
  checkMark: { color: '#10B981', fontSize: 16, fontWeight: '700' },
  actionContainer: { marginTop: 20 },
  checkButton: { borderRadius: 14, overflow: 'hidden' },
  checkButtonDisabled: { opacity: 0.5 },
  buttonGradient: { paddingVertical: 14, alignItems: 'center' },
  checkButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultContainer: { alignItems: 'center' },
  resultText: { color: '#10B981', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  nextButton: { borderRadius: 14, overflow: 'hidden' },
});
