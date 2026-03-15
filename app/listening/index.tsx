import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function ListeningScreen() {
  const router = useRouter();
  const { listeningExercises, completeListeningExercise } = useStore();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const playAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const exercise = listeningExercises[currentExercise];

  const playAudio = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    const sentences = exercise.transcript.split('. ').map((s, i) => 
      i < exercise.transcript.split('. ').length - 1 ? s + '.' : s
    );
    
    let index = 0;
    const speakNext = () => {
      if (index < sentences.length) {
        Speech.speak(sentences[index].trim(), {
          language: 'en-US',
          rate: 0.85,
          onDone: () => {
            index++;
            setTimeout(speakNext, 300);
          },
          onComplete: () => {
            setIsPlaying(false);
          }
        });
      }
    };
    speakNext();
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !exercise) return;
    
    const isCorrect = selectedAnswer === exercise.questions[0].correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentExercise < listeningExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = score + (selectedAnswer === exercise?.questions[0].correctAnswer ? 1 : 0);
      if (exercise && !exercise.completed) {
        completeListeningExercise(exercise.id);
      }
      router.back();
    }
  };

  const completedCount = listeningExercises.filter(e => e.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Listening</Text>
            <Text style={styles.subtitle}>{completedCount}/{listeningExercises.length} completed</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.progressGradient}>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Train Your Ear</Text>
              <Text style={styles.progressDesc}>Listen and understand spoken English</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(completedCount / listeningExercises.length) * 100}%` }]} />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {listeningExercises.map((ex, index) => (
            <Pressable key={ex.id} onPress={() => {
              setCurrentExercise(index);
              setShowTranscript(false);
              setSelectedAnswer(null);
              setShowResult(false);
            }}>
              <View style={[styles.exerciseCard, currentExercise === index && styles.exerciseCardActive]}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseIcon}>
                    <Text style={styles.exerciseEmoji}>👂</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseTitle}>{ex.title}</Text>
                    <View style={styles.exerciseMeta}>
                      <Text style={styles.exerciseDuration}>⏱️ {ex.duration} min</Text>
                      <View style={[styles.levelBadge, { 
                        backgroundColor: ex.level === 'beginner' ? '#10B981' : ex.level === 'intermediate' ? '#6366F1' : '#EC4899' 
                      }]}>
                        <Text style={styles.levelText}>{ex.level}</Text>
                      </View>
                    </View>
                  </View>
                  {ex.completed && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedIcon}>✓</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </Animated.View>

        {exercise && (
          <Animated.View style={[styles.activeExercise, { opacity: fadeAnim }]}>
            <Text style={styles.activeTitle}>{exercise.title}</Text>
            
            <Pressable 
              style={[styles.playButton, isPlaying && styles.playButtonActive]}
              onPress={playAudio}
              disabled={isPlaying}
            >
              <LinearGradient 
                colors={isPlaying ? ['#6B7280', '#4B5563'] : ['#F59E0B', '#FBBF24']}
                style={styles.playGradient}
              >
                <Animated.Text style={[styles.playEmoji, { transform: [{ scale: playAnim }] }]}>
                  {isPlaying ? '🔊' : '▶️'}
                </Animated.Text>
                <Text style={styles.playText}>
                  {isPlaying ? 'Playing...' : 'Listen'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable 
              style={styles.transcriptButton}
              onPress={() => setShowTranscript(!showTranscript)}
            >
              <Text style={styles.transcriptText}>
                {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
              </Text>
            </Pressable>

            {showTranscript && (
              <View style={styles.transcriptCard}>
                <Text style={styles.transcriptContent}>{exercise.transcript}</Text>
                <Text style={styles.translationText}>{exercise.translation}</Text>
              </View>
            )}

            <View style={styles.questionsSection}>
              <Text style={styles.questionTitle}>Comprehension Questions</Text>
              
              {exercise.questions.map((q, idx) => (
                <View key={q.id} style={styles.questionCard}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <View style={styles.optionsContainer}>
                    {q.options.map((option) => {
                      const isSelected = selectedAnswer === option;
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
                          onPress={() => handleSelectAnswer(option)}
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
                  style={[styles.checkButton, !selectedAnswer && styles.checkButtonDisabled]}
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
                      {currentExercise < listeningExercises.length - 1 ? 'Next →' : 'Finish'}
                    </Text>
                  </LinearGradient>
                </Pressable>
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
  progressCard: { marginBottom: 30, borderRadius: 24, overflow: 'hidden' },
  progressGradient: { padding: 24 },
  progressContent: {},
  progressTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  progressDesc: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  exerciseCard: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 16, marginBottom: 12 },
  exerciseCardActive: { borderWidth: 2, borderColor: '#6366F1' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center' },
  exerciseIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(245, 158, 11, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  exerciseEmoji: { fontSize: 24 },
  exerciseInfo: { flex: 1 },
  exerciseTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  exerciseDuration: { color: '#9CA3AF', fontSize: 13 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  levelText: { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  completedBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  completedIcon: { color: '#fff', fontSize: 14, fontWeight: '700' },
  activeExercise: { backgroundColor: '#1A1A2E', borderRadius: 24, padding: 20 },
  activeTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  playButton: { borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  playButtonActive: { opacity: 0.7 },
  playGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 12 },
  playEmoji: { fontSize: 32 },
  playText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  transcriptButton: { alignSelf: 'center', paddingVertical: 10 },
  transcriptText: { color: '#6366F1', fontSize: 14, fontWeight: '600' },
  transcriptCard: { backgroundColor: '#2D2D44', borderRadius: 16, padding: 16, marginTop: 12 },
  transcriptContent: { color: '#fff', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  translationText: { color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' },
  questionsSection: { marginTop: 24 },
  questionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  questionCard: { marginBottom: 20 },
  questionText: { color: '#fff', fontSize: 16, marginBottom: 12 },
  optionsContainer: { gap: 10 },
  optionButton: { backgroundColor: '#2D2D44', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 2, borderColor: 'transparent' },
  optionSelected: { borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  optionText: { color: '#fff', fontSize: 15 },
  optionTextSelected: { fontWeight: '600' },
  checkMark: { color: '#10B981', fontSize: 16, fontWeight: '700' },
  actionContainer: { marginTop: 24 },
  checkButton: { borderRadius: 16, overflow: 'hidden' },
  checkButtonDisabled: { opacity: 0.5 },
  nextButton: { borderRadius: 16, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  checkButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
