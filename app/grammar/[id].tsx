import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function GrammarDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { grammarLessons, completeGrammarLesson, addXP } = useStore();
  
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const lesson = grammarLessons.find((l) => l.id === id);
  const exercise = lesson?.exercises[currentExercise];

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;

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

  const speakText = (text: string) => {
    Speech.speak(text, { language: 'en-US', rate: 0.8 });
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !exercise) return;
    
    const isCorrect = selectedAnswer.toLowerCase() === exercise.correctAnswer.toLowerCase();
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
      Animated.sequence([
        Animated.timing(resultAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(resultAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (!lesson) return;
    
    if (currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      if (lesson && !lesson.completed) {
        completeGrammarLesson(lesson.id);
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#6366F1';
      case 'advanced': return '#EC4899';
      default: return '#6366F1';
    }
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F0F23', '#1A1A2E']} style={styles.gradient}>
          <Animated.View style={[styles.completedContainer, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
            <Text style={styles.completedEmoji}>🎉</Text>
            <Text style={styles.completedTitle}>Lesson Complete!</Text>
            <Text style={styles.completedScore}>
              You scored {score}/{lesson.exercises.length}
            </Text>
            <Text style={styles.completedXP}>+{lesson.xp} XP</Text>
            
            <Pressable style={styles.doneButton} onPress={() => router.back()}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
                <Text style={styles.doneButtonText}>Continue</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F0F23', '#1A1A2E']} style={styles.gradient}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Exercise {currentExercise + 1} of {lesson.exercises.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentExercise + 1) / lesson.exercises.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreText}>⭐ {score}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View style={[styles.exerciseCard, { opacity: fadeAnim }]}>
            <View style={styles.exerciseHeader}>
              <View style={[styles.exerciseType, { backgroundColor: getLevelColor(lesson.level) + '20' }]}>
                <Text style={[styles.exerciseTypeText, { color: getLevelColor(lesson.level) }]}>
                  {exercise?.type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.questionText}>{exercise?.question}</Text>

            <View style={styles.optionsContainer}>
              {exercise?.options ? (
                exercise.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = showResult && option.toLowerCase() === exercise.correctAnswer.toLowerCase();
                  const isWrong = showResult && isSelected && !isCorrect;
                  
                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionSelected,
                        isCorrect && styles.optionCorrect,
                        isWrong && styles.optionWrong,
                      ]}
                      onPress={() => handleSelectAnswer(option)}
                      disabled={showResult}
                    >
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        isCorrect && styles.optionTextCorrect,
                      ]}>
                        {option}
                      </Text>
                      {isCorrect && <Text style={styles.checkMark}>✓</Text>}
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={styles.fillBlankText}>
                    {exercise?.question.split(exercise.correctAnswer)[0]}
                    <Text style={styles.blank}>_____</Text>
                    {exercise?.question.split(exercise.correctAnswer)[1]}
                  </Text>
                </View>
              )}
            </View>

            {showResult && exercise?.explanation && (
              <Animated.View style={[styles.explanation, { opacity: resultAnim }]}>
                <Text style={styles.explanationTitle}>💡 Explanation</Text>
                <Text style={styles.explanationText}>{exercise.explanation}</Text>
              </Animated.View>
            )}
          </Animated.View>

          <View style={styles.actionContainer}>
            {!showResult ? (
              <Pressable
                style={[
                  styles.checkButton,
                  !selectedAnswer && styles.checkButtonDisabled,
                ]}
                onPress={handleCheckAnswer}
                disabled={!selectedAnswer}
              >
                <LinearGradient
                  colors={selectedAnswer ? ['#6366F1', '#8B5CF6'] : ['#374151', '#4B5563']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.checkButtonText}>Check Answer</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
                  <Text style={styles.nextButtonText}>
                    {currentExercise < lesson.exercises.length - 1 ? 'Next Exercise →' : 'Finish'}
                  </Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
  progressInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2D2D44',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  scoreDisplay: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    color: '#FFD93D',
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    padding: 24,
  },
  exerciseHeader: {
    marginBottom: 20,
  },
  exerciseType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exerciseTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#10B981',
  },
  checkMark: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
  inputContainer: {
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 16,
  },
  fillBlankText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
  },
  blank: {
    color: '#6366F1',
    fontWeight: '700',
  },
  explanation: {
    marginTop: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  explanationTitle: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  explanationText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 24,
  },
  checkButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  completedEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  completedTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  completedScore: {
    color: '#9CA3AF',
    fontSize: 20,
    marginBottom: 8,
  },
  completedXP: {
    color: '#FFD93D',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 40,
  },
  doneButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
