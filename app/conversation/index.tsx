import { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput, 
  Animated, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';
import { AnimatedBackground } from '../../components/effects/AnimatedBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { Theme } from '../../theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const scenarios = [
  {
    id: 'restaurant',
    title: 'At the Restaurant',
    context: 'Practice ordering food and making requests',
    icon: '🍽️',
    accent: Theme.colors.primary,
  },
  {
    id: 'shopping',
    title: 'Shopping',
    context: 'Ask for sizes, prices, and make purchases',
    icon: '🛍️',
    accent: Theme.colors.accentPink,
  },
  {
    id: 'directions',
    title: 'Asking Directions',
    context: 'Find your way around the city',
    icon: '🗺️',
    accent: Theme.colors.success,
  },
];

export default function ConversationScreen() {
  const router = useRouter();
  const { addXP, updateStreak } = useStore();
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const startScenario = (scenario: typeof scenarios[0]) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: scenario.context + '\n\nLet\'s start! ' + scenario.icon + '\n\n' + getScenarioWelcome(scenario.id),
      },
    ]);
  };

  const getScenarioWelcome = (id: string) => {
    switch (id) {
      case 'restaurant':
        return "Good evening! Welcome to our restaurant. Do you have a reservation?";
      case 'shopping':
        return "Hello! Can I help you find something today?";
      case 'directions':
        return "Excuse me, do you need help finding somewhere?";
      default:
        return "Hello! How can I help you practice English today?";
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
      addXP(10);
      updateStreak();
    }, 800 + Math.random() * 700);
  };

  const generateResponse = (userInput: string): Message => {
    const responses = [
      "That's interesting! Could you tell me more about that?",
      'I see. Let me help you with that.',
      'Absolutely! Is there anything else you\'d like to know?',
      'Great question! Here\'s what I think...',
      'Thanks for sharing! How long have you been learning English?',
    ];
    
    return {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
    };
  };

  const speakMessage = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.85,
    });
  };

  const resetToMenu = () => {
    setSelectedScenario(null);
    setMessages([]);
  };

  if (!selectedScenario) {
    return (
      <AnimatedBackground>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scenarioContent}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Conversation</Text>
            <Text style={styles.subtitle}>Choose a scenario to practice</Text>
          </Animated.View>

          <View style={styles.scenariosList}>
            {scenarios.map((scenario) => (
              <Pressable
                key={scenario.id}
                onPress={() => startScenario(scenario)}
                accessibilityRole="button"
                accessibilityLabel={`Start ${scenario.title} conversation practice`}
                style={({ pressed }) => [
                  styles.scenarioCard,
                  pressed && styles.scenarioCardPressed,
                ]}
              >
                <GlassCard style={styles.scenarioCardInner} gradient>
                  <View style={styles.scenarioIconBox}>
                    <Text style={styles.scenarioEmoji}>{scenario.icon}</Text>
                  </View>
                  <View style={styles.scenarioInfo}>
                    <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                    <Text style={styles.scenarioContext}>{scenario.context}</Text>
                  </View>
                  <Text style={styles.scenarioArrow}>→</Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <Pressable 
            onPress={resetToMenu} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back to scenarios"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatTitle}>{selectedScenario.title}</Text>
            <Text style={styles.chatSubtitle}>{selectedScenario.context}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <Animated.View 
              key={message.id}
              style={[
                styles.messageWrapper,
                message.role === 'user' && styles.userMessageWrapper,
                { opacity: fadeAnim }
              ]}
            >
              {message.role === 'assistant' && (
                <View style={[styles.avatar, { backgroundColor: selectedScenario.accent + '20' }]}>
                  <Text style={styles.avatarEmoji}>🎓</Text>
                </View>
              )}
              <Pressable
                onPress={() => message.role === 'assistant' && speakMessage(message.content)}
                accessibilityRole="button"
                accessibilityLabel={message.role === 'assistant' ? 'Listen to message' : undefined}
                style={[
                  styles.messageBubble,
                  message.role === 'user' && styles.userBubble,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.role === 'user' && styles.userMessageText,
                ]}>
                  {message.content}
                </Text>
                {message.role === 'assistant' && (
                  <View style={styles.speakButton}>
                    <Text style={styles.speakButtonText}>🔊</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          ))}
          
          {isTyping && (
            <View style={styles.typingWrapper}>
              <View style={[styles.avatar, { backgroundColor: selectedScenario.accent + '20' }]}>
                <Text style={styles.avatarEmoji}>🎓</Text>
              </View>
              <GlassCard style={styles.typingBubble} bordered>
                <View style={styles.typingDots}>
                  <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
                  <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
                  <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
                </View>
              </GlassCard>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputArea}>
          <GlassCard style={styles.inputCard} bordered>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={Theme.colors.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              autoCapitalize="sentences"
              autoCorrect={true}
              spellCheck={true}
              returnKeyType="send"
              accessibilityLabel="Message input"
            />
            <NeoButton
              title=""
              onPress={handleSend}
              variant="primary"
              size="sm"
              disabled={!inputText.trim()}
              loading={false}
              icon={<Text style={styles.sendIcon}>➤</Text>}
              style={styles.sendButton}
              accessibilityLabel="Send message"
            />
          </GlassCard>
          <Text style={styles.inputHint}>
            AI conversation • Use full sentences
          </Text>
        </View>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scenarioContent: {
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
  scenariosList: {
    gap: Theme.spacing.md,
  },
  scenarioCard: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  scenarioCardPressed: {
    opacity: 0.95,
  },
  scenarioCardInner: {
    padding: 0,
  },
  scenarioIconBox: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  scenarioEmoji: {
    fontSize: 28,
  },
  scenarioInfo: {
    flex: 1,
  },
  scenarioTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
    fontSize: 18,
    marginBottom: 4,
  },
  scenarioContext: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  scenarioArrow: {
    fontSize: 24,
    color: Theme.colors.primary,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.huge,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.surfaceBorder,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  backText: {
    color: Theme.colors.text.primary,
    fontSize: 20,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatTitle: {
    ...Theme.typography.bodyBold,
    color: Theme.colors.text.primary,
  },
  chatSubtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.text.secondary,
  },
  headerSpacer: {
    width: 44,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: Theme.borderRadius.xl,
    borderBottomLeftRadius: 8,
    padding: Theme.spacing.md,
  },
  userBubble: {
    borderBottomLeftRadius: Theme.borderRadius.xl,
    borderBottomRightRadius: 8,
  },
  messageText: {
    ...Theme.typography.body,
    color: Theme.colors.text.primary,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  speakButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakButtonText: {
    fontSize: 12,
  },
  typingWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  typingBubble: {
    borderRadius: Theme.borderRadius.xl,
    borderBottomLeftRadius: 8,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.text.secondary,
  },
  inputArea: {
    padding: Theme.spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Theme.colors.surfaceBorder,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: Theme.colors.text.primary,
    maxHeight: 100,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    ...Theme.typography.body,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: Theme.spacing.sm,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
  },
  inputHint: {
    ...Theme.typography.caption,
    color: Theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  bottomSpacer: {
    height: Theme.spacing.huge,
  },
} as const);
