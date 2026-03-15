import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

const practiceSentences = [
  { id: '1', text: 'Hello, how are you today?', translation: 'Bonjour, comment allez-vous aujourd\'hui?' },
  { id: '2', text: 'I would like a cup of coffee, please.', translation: 'Je voudrais une tasse de café, s\'il vous plaît.' },
  { id: '3', text: 'Could you tell me where the station is?', translation: 'Pourriez-vous me dire où est la gare?' },
  { id: '4', text: 'I am learning English because I want to travel.', translation: 'J\'apprends l\'anglais parce que je veux voyager.' },
  { id: '5', text: 'Thank you very much for your help.', translation: 'Merci beaucoup pour votre aide.' },
  { id: '6', text: 'What time does the movie start?', translation: 'À quelle heure commence le film?' },
];

export default function PronunciationScreen() {
  const router = useRouter();
  const { addXP, updateStreak } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [score, setScore] = useState<number | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const currentSentence = practiceSentences[currentIndex];

  const speakSentence = async () => {
    Speech.speak(currentSentence.text, {
      language: 'en-US',
      rate: 0.75,
      onDone: () => {
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          waveAnim.setValue(0);
        });
      },
    });
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setScore(null);
    } catch (error) {
      console.log('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      setRecording(null);

      const mockScore = Math.floor(Math.random() * 30) + 70;
      setScore(mockScore);
      
      if (mockScore >= 80) {
        addXP(15);
        updateStreak();
      }
    } catch (error) {
      console.log('Error stopping recording:', error);
    }
  };

  const nextSentence = () => {
    setCurrentIndex((prev) => (prev + 1) % practiceSentences.length);
    setScore(null);
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return '#10B981';
    if (s >= 80) return '#6366F1';
    if (s >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreMessage = (s: number) => {
    if (s >= 90) return 'Excellent!';
    if (s >= 80) return 'Great job!';
    if (s >= 70) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.title}>Pronunciation</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.sentenceCard}>
            <Text style={styles.instruction}>Listen and repeat</Text>
            <Text style={styles.sentence}>{currentSentence.text}</Text>
            <Text style={styles.translation}>{currentSentence.translation}</Text>
            
            <Pressable onPress={speakSentence} style={styles.listenButton}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.listenGradient}
              >
                <Text style={styles.listenEmoji}>🔊</Text>
                <Text style={styles.listenText}>Listen</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.recordSection}>
            {score !== null && (
              <Animated.View 
                style={[
                  styles.scoreCard,
                  { 
                    borderColor: getScoreColor(score),
                    transform: [{ scale: waveAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })}]
                  }
                ]}
              >
                <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                  {score}%
                </Text>
                <Text style={styles.scoreMessage}>{getScoreMessage(score)}</Text>
              </Animated.View>
            )}

            <Animated.View 
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
                { transform: [{ scale: isRecording ? pulseAnim : 1 }] },
              ]}
            >
              <Pressable 
                onPress={isRecording ? stopRecording : startRecording}
                style={styles.recordPressable}
              >
                <Text style={styles.recordEmoji}>
                  {isRecording ? '⏹️' : '🎤'}
                </Text>
              </Pressable>
            </Animated.View>

            <Text style={styles.recordHint}>
              {isRecording ? 'Tap to stop' : 'Tap to record'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={nextSentence} style={styles.nextButton}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextGradient}
            >
              <Text style={styles.nextText}>Next Sentence</Text>
              <Text style={styles.nextArrow}>→</Text>
            </LinearGradient>
          </Pressable>

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
    marginBottom: 30,
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
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sentenceCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  instruction: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
  },
  sentence: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  translation: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  listenButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  listenGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 10,
  },
  listenEmoji: {
    fontSize: 20,
  },
  listenText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  scoreCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    minWidth: 150,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreMessage: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 4,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  recordButtonActive: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  recordPressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordEmoji: {
    fontSize: 40,
  },
  recordHint: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextArrow: {
    color: '#fff',
    fontSize: 18,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressDotActive: {
    backgroundColor: '#6366F1',
    width: 24,
  },
});
