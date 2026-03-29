import { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  Dimensions,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as SpeechRecognition from 'expo-speech-recognition';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');

const practiceSentences = [
  { 
    id: '1', 
    text: 'Hello, how are you today?', 
    translation: 'Bonjour, comment allez-vous aujourd\'hui?' 
  },
  { 
    id: '2', 
    text: 'I would like a cup of coffee, please.', 
    translation: 'Je voudrais une tasse de café, s\'il vous plaît.' 
  },
  { 
    id: '3', 
    text: 'Could you tell me where the station is?', 
    translation: 'Pourriez-vous me dire où est la gare?' 
  },
  { 
    id: '4', 
    text: 'I am learning English because I want to travel.', 
    translation: 'J\'apprends l\'anglais parce que je veux voyager.' 
  },
  { 
    id: '5', 
    text: 'Thank you very much for your help.', 
    translation: 'Merci beaucoup pour votre aide.' 
  },
  { 
    id: '6', 
    text: 'What time does the movie start?', 
    translation: 'À quelle heure commence le film?' 
  },
];

/**
 * PronunciationScreen — practice speaking with real speech recognition.
 * Records user's voice, transcribes, and compares to target sentence.
 * Beautiful glass cards, smooth animations, clear visual feedback.
 */
export default function PronunciationScreen() {
  const router = useRouter();
  const { addXP, updateStreak } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const currentSentence = practiceSentences[currentIndex];

  useEffect(() => {
    // Check permissions on mount
    const checkPermission = async () => {
      const { status } = await SpeechRecognition.getPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    checkPermission();

    // Pulse animation for record button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const requestPermission = async () => {
    const { status } = await SpeechRecognition.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Microphone access is needed for pronunciation practice.');
    }
  };

  const speakSentence = async () => {
    Speech.speak(currentSentence.text, {
      language: 'en-US',
      rate: 0.75,
    });
  };

  const startListening = async () => {
    if (!hasPermission) {
      await requestPermission();
      return;
    }

    setTranscript('');
    setErrorMsg(null);
    setScore(null);

    try {
      await SpeechRecognition.startAsync({
        lang: 'en-US',
        continuous: false,
        interimResults: true,
        maxAlternatives: 3,
      });
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition error:', error);
      setErrorMsg('Failed to start speech recognition. Please try again.');
    }
  };

  const stopListening = async () => {
    try {
      const result = await SpeechRecognition.stopAsync();
      setIsListening(false);
      
      if (result?.transcribed) {
        const spokenText = result[0].transcription.toLowerCase().trim();
        setTranscript(spokenText);
        calculateScore(spokenText, currentSentence.text.toLowerCase());
      } else {
        setErrorMsg('No speech detected. Try again.');
      }
    } catch (error) {
      console.error('Stop error:', error);
      setErrorMsg('Error processing speech. Please try again.');
      setIsListening(false);
    }
  };

  const calculateScore = (spoken: string, target: string) => {
    // Simple similarity scoring (can be improved with Levenshtein or phoneme matching)
    const spokenWords = spoken.split(/\s+/);
    const targetWords = target.split(/\s+/);
    
    // Word-level matching
    const matchedWords = spokenWords.filter(word => targetWords.includes(word)).length;
    const wordScore = (matchedWords / targetWords.length) * 100;
    
    // Exact match bonus
    const exactMatch = spoken === target ? 30 : 0;
    
    // Length penalty/bonus
    const lengthDiff = Math.abs(spokenWords.length - targetWords.length);
    const lengthScore = lengthDiff === 0 ? 20 : lengthDiff <= 1 ? 10 : -10;
    
    let finalScore = Math.round(wordScore + exactMatch + lengthScore);
    finalScore = Math.max(0, Math.min(100, finalScore)); // Clamp to 0-100
    
    setScore(finalScore);
    
    if (finalScore >= 80) {
      addXP(15);
      updateStreak();
    }
  };

  const nextSentence = () => {
    setCurrentIndex((prev) => (prev + 1) % practiceSentences.length);
    setTranscript('');
    setScore(null);
    setErrorMsg(null);
    setIsListening(false);
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return Theme.colors.success;
    if (s >= 80) return Theme.colors.primary;
    if (s >= 70) return Theme.colors.accent;
    return Theme.colors.error;
  };

  const getScoreMessage = (s: number) => {
    if (s >= 90) return 'Excellent!';
    if (s >= 80) return 'Great job!';
    if (s >= 70) return 'Good effort!';
    return 'Keep practicing!';
  };

  const getScoreFeedback = (s: number) => {
    if (s >= 90) return "Perfect pronunciation! You're nailing it!";
    if (s >= 80) return "Very good! Almost there!";
    if (s >= 70) return "Not bad! Keep practicing.";
    return "Don't give up! Try listening to the native speaker again.";
  };

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Pronunciation</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Sentence Card */}
          <GlassCard gradient style={styles.sentenceCard}>
            <Text style={styles.instruction}>Listen and repeat</Text>
            <Text style={styles.sentence}>{currentSentence.text}</Text>
            <Text style={styles.translation}>{currentSentence.translation}</Text>
            
            <Pressable onPress={speakSentence} style={styles.listenButton}>
              <LinearGradient
                colors={Theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.listenGradient}
              >
                <Text style={styles.listenEmoji}>🔊</Text>
                <Text style={styles.listenText}>Listen</Text>
              </LinearGradient>
            </Pressable>
          </GlassCard>

          {/* Recording Section */}
          <View style={styles.recordSection}>
            {score !== null && (
              <Animated.View 
                style={[
                  styles.scoreCard,
                  { 
                    borderColor: getScoreColor(score),
                  },
                ]}
              >
                <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                  {score}%
                </Text>
                <Text style={styles.scoreMessage}>{getScoreMessage(score)}</Text>
                <Text style={styles.scoreFeedback}>{getScoreFeedback(score)}</Text>
                {transcript ? (
                  <View style={styles.transcriptBox}>
                    <Text style={styles.transcriptLabel}>You said:</Text>
                    <Text style={styles.transcriptText}>"{transcript}"</Text>
                  </View>
                ) : null}
              </Animated.View>
            )}

            {errorMsg && (
              <GlassCard style={styles.errorCard} bordered>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </GlassCard>
            )}

            {!hasPermission && (
              <GlassCard style={styles.permissionCard} bordered>
                <Text style={styles.permissionText}>Microphone permission is required.</Text>
                <NeoButton
                  title="Grant Permission"
                  onPress={requestPermission}
                  variant="primary"
                  size="sm"
                  style={styles.permissionButton}
                />
              </GlassCard>
            )}

            <Animated.View 
              style={[
                styles.recordButton,
                isListening && styles.recordButtonActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Pressable 
                onPressIn={isListening ? stopListening : startListening}
                onPressOut={() => {}} // Don't stop on release, use explicit stop
                style={styles.recordPressable}
                accessibilityRole="button"
                accessibilityLabel={isListening ? 'Stop recording' : 'Start recording'}
                accessibilityHint="Press and hold to record your voice"
              >
                <Text style={styles.recordEmoji}>
                  {isListening ? '⏹️' : '🎤'}
                </Text>
              </Pressable>
            </Animated.View>

            <Text style={styles.recordHint}>
              {isListening ? 'Release to stop' : 'Press and hold to speak'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <NeoButton
            title="Next Sentence"
            onPress={nextSentence}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Text style={styles.nextArrow}>→</Text>}
            iconPosition="right"
            disabled={!score && !errorMsg} // Only allow next after scoring attempt
          />

          <View style={styles.progress}>
            {practiceSentences.map((_, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.progressDot,
                  idx === currentIndex && styles.progressDotActive,
                ]} 
              />
            ))}
          </View>

          <Text style={styles.progressLabel}>
            Sentence {currentIndex + 1} of {practiceSentences.length}
          </Text>
        </View>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge,
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
  title: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 17,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.xl,
  },
  sentenceCard: {
    padding: Theme.spacing.xxl,
    alignItems: 'center',
  },
  instruction: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.lg,
  },
  sentence: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    lineHeight: 36,
  },
  translation: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Theme.spacing.xl,
  },
  listenButton: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  listenGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xxxl,
    paddingVertical: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  listenEmoji: {
    fontSize: 20,
  },
  listenText: {
    color: Theme.colors.text.primary,
    ...Theme.typography.bodyBold,
  },
  recordSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.xxl,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.primary,
    marginBottom: Theme.spacing.lg,
  },
  recordButtonActive: {
    borderColor: Theme.colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  recordPressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordEmoji: {
    fontSize: 48,
  },
  recordHint: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  scoreCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xxl,
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
    borderWidth: 2,
    minWidth: 180,
  },
  scoreValue: {
    ...Theme.typography.heading1,
    marginBottom: Theme.spacing.xs,
  },
  scoreMessage: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.secondary,
  },
  scoreFeedback: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  transcriptBox: {
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.md,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: Theme.borderRadius.md,
    width: '100%',
  },
  transcriptLabel: {
    ...Theme.typography.overline,
    color: Theme.colors.text.secondary,
    marginBottom: 4,
  },
  transcriptText: {
    ...Theme.typography.body,
    color: Theme.colors.text.primary,
    fontStyle: 'italic',
  },
  errorCard: {
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderColor: Theme.colors.error,
  },
  errorText: {
    ...Theme.typography.body,
    color: Theme.colors.error,
    textAlign: 'center',
  },
  permissionCard: {
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
  },
  permissionText: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  permissionButton: {
    width: 180,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.hugePlus,
    paddingTop: Theme.spacing.xl,
    alignItems: 'center',
  },
  nextArrow: {
    fontSize: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.surfaceBorder,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: Theme.colors.primary,
  },
  progressLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.sm,
  },
});
