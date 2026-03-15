import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function WritingScreen() {
  const router = useRouter();
  const { writingExercises, completeWritingExercise } = useStore();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const exercise = writingExercises[currentExercise];

  const handleSubmit = () => {
    if (!exercise || !answer.trim()) return;
    completeWritingExercise(exercise.id);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentExercise < writingExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setAnswer('');
      setSubmitted(false);
      setShowHint(false);
      setShowSample(false);
    } else {
      router.back();
    }
  };

  const completedCount = writingExercises.filter(e => e.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Writing</Text>
            <Text style={styles.subtitle}>{completedCount}/{writingExercises.length} completed</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.progressGradient}>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Practice Writing</Text>
              <Text style={styles.progressDesc}>Improve your written English</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(completedCount / writingExercises.length) * 100}%` }]} />
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
                <Text style={styles.xpBadge}>+{exercise.xp} XP</Text>
              </View>
            </View>

            <View style={styles.promptCard}>
              <Text style={styles.promptLabel}>📝 Writing Prompt</Text>
              <Text style={styles.promptText}>{exercise.prompt}</Text>
            </View>

            <Pressable 
              style={styles.helpButton}
              onPress={() => setShowHint(!showHint)}
            >
              <Text style={styles.helpButtonText}>
                {showHint ? '💡 Hide Hint' : '💡 Show Hint'}
              </Text>
            </Pressable>

            {showHint && (
              <View style={styles.hintCard}>
                <Text style={styles.hintText}>{exercise.hint}</Text>
              </View>
            )}

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Your Answer</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Write your answer here..."
                placeholderTextColor="#6B7280"
                value={answer}
                onChangeText={setAnswer}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{answer.length} characters</Text>
            </View>

            {!submitted ? (
              <Pressable
                style={[styles.submitButton, !answer.trim() && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!answer.trim()}
              >
                <LinearGradient 
                  colors={answer.trim() ? ['#8B5CF6', '#A855F7'] : ['#374151', '#4B5563']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.submitButtonText}>Submit Answer</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <View style={styles.submittedContainer}>
                <View style={styles.successBanner}>
                  <Text style={styles.successText}>✓ Submitted</Text>
                </View>

                <Pressable 
                  style={styles.sampleButton}
                  onPress={() => setShowSample(!showSample)}
                >
                  <Text style={styles.sampleButtonText}>
                    {showSample ? '👁️ Hide Sample Answer' : '👁️ Show Sample Answer'}
                  </Text>
                </Pressable>

                {showSample && (
                  <View style={styles.sampleCard}>
                    <Text style={styles.sampleLabel}>Sample Answer</Text>
                    <Text style={styles.sampleText}>{exercise.sampleAnswer}</Text>
                  </View>
                )}

                <Pressable style={styles.nextButton} onPress={handleNext}>
                  <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.buttonGradient}>
                    <Text style={styles.nextButtonText}>
                      {currentExercise < writingExercises.length - 1 ? 'Next Exercise →' : 'Finish'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}
          </Animated.View>
        )}

        <Animated.View style={[styles.tipsSection, { opacity: fadeAnim }]}>
          <Text style={styles.tipsTitle}>Writing Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>📖</Text>
            <Text style={styles.tipText}>Read English books and articles to improve your writing style.</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>✍️</Text>
            <Text style={styles.tipText}>Practice writing every day, even just a few sentences.</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>🔄</Text>
            <Text style={styles.tipText}>Try to use new vocabulary and grammar structures you've learned.</Text>
          </View>
        </Animated.View>
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
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  exerciseTitle: { color: '#fff', fontSize: 20, fontWeight: '700', flex: 1 },
  exerciseMeta: { flexDirection: 'row', gap: 10 },
  levelBadge: { backgroundColor: '#6366F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: '600' },
  xpBadge: { backgroundColor: '#FFD93D', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, color: '#000', fontSize: 12, fontWeight: '700' },
  promptCard: { backgroundColor: '#2D2D44', borderRadius: 16, padding: 16, marginBottom: 16 },
  promptLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 10 },
  promptText: { color: '#fff', fontSize: 16, lineHeight: 24 },
  helpButton: { alignSelf: 'flex-start', paddingVertical: 8 },
  helpButtonText: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
  hintCard: { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#8B5CF6' },
  hintText: { color: '#A5B4FC', fontSize: 14, fontStyle: 'italic' },
  inputSection: { marginBottom: 20 },
  inputLabel: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  textInput: { backgroundColor: '#2D2D44', borderRadius: 16, padding: 16, color: '#fff', fontSize: 15, minHeight: 150, lineHeight: 24 },
  charCount: { color: '#6B7280', fontSize: 12, textAlign: 'right', marginTop: 8 },
  submitButton: { borderRadius: 14, overflow: 'hidden' },
  submitButtonDisabled: { opacity: 0.5 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  submittedContainer: { marginTop: 10 },
  successBanner: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  successText: { color: '#10B981', fontSize: 16, fontWeight: '700' },
  sampleButton: { alignSelf: 'center', paddingVertical: 10 },
  sampleButtonText: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
  sampleCard: { backgroundColor: '#2D2D44', borderRadius: 16, padding: 16, marginTop: 12 },
  sampleLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 10 },
  sampleText: { color: '#fff', fontSize: 14, fontStyle: 'italic', lineHeight: 22 },
  nextButton: { borderRadius: 14, overflow: 'hidden', marginTop: 20 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', paddingVertical: 16, textAlign: 'center' },
  tipsSection: { marginTop: 30 },
  tipsTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  tipCard: { flexDirection: 'row', backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 10, alignItems: 'center' },
  tipEmoji: { fontSize: 24, marginRight: 12 },
  tipText: { color: '#9CA3AF', fontSize: 14, flex: 1, lineHeight: 20 },
});
