import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const scenarios = [
  {
    id: 'restaurant',
    title: 'At the Restaurant',
    context: 'You are at a restaurant and want to order food',
    icon: '🍽️',
    initialMessage: 'Good evening! Welcome to our restaurant. Do you have a reservation?',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    context: 'You are at a clothing store looking for a jacket',
    icon: '🛍️',
    initialMessage: 'Hello! Can I help you find something today?',
  },
  {
    id: 'directions',
    title: 'Asking Directions',
    context: 'You are lost and need to find the nearest metro station',
    icon: '🗺️',
    initialMessage: 'Excuse me, do you need help finding somewhere?',
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
  const inputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const startScenario = (scenario: typeof scenarios[0]) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: scenario.initialMessage,
      },
    ]);
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
    }, 1000 + Math.random() * 1000);
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
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A2E']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
            <Text style={styles.title}>Conversation</Text>
            <View style={styles.placeholder} />
          </View>

          <Animated.View style={[styles.scenarioList, { opacity: fadeAnim }]}>
            <Text style={styles.subtitle}>Choose a scenario to practice</Text>
            
            {scenarios.map((scenario) => (
              <Pressable
                key={scenario.id}
                onPress={() => startScenario(scenario)}
                style={styles.scenarioCard}
              >
                <LinearGradient
                  colors={['#1A1A2E', '#2D2D44']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scenarioGradient}
                >
                  <View style={styles.scenarioIcon}>
                    <Text style={styles.scenarioEmoji}>{scenario.icon}</Text>
                  </View>
                  <View style={styles.scenarioInfo}>
                    <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                    <Text style={styles.scenarioContext}>{scenario.context}</Text>
                  </View>
                  <Text style={styles.scenarioArrow}>→</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E']}
        style={styles.gradient}
      >
        <View style={styles.chatHeader}>
          <Pressable onPress={resetToMenu} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatTitle}>{selectedScenario.title}</Text>
            <Text style={styles.chatSubtitle}>{selectedScenario.context}</Text>
          </View>
        </View>

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
              ]}
            >
              {message.role === 'assistant' && (
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>🎓</Text>
                </View>
              )}
              <View 
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
                  <Pressable 
                    onPress={() => speakMessage(message.content)}
                    style={styles.speakButton}
                  >
                    <Text style={styles.speakButtonText}>🔊</Text>
                  </Pressable>
                )}
              </View>
            </Animated.View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageWrapper, styles.typingWrapper]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>🎓</Text>
              </View>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <Animated.View style={[styles.inputContainer, { opacity: inputAnim }]}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#6B7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable 
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.sendButtonPressed,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
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
    marginBottom: 20,
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
  scenarioList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  scenarioCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scenarioGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  scenarioIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scenarioEmoji: {
    fontSize: 28,
  },
  scenarioInfo: {
    flex: 1,
  },
  scenarioTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  scenarioContext: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  scenarioArrow: {
    color: '#6366F1',
    fontSize: 24,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 16,
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
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '75%',
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    padding: 16,
  },
  userBubble: {
    backgroundColor: '#6366F1',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 6,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  speakButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakButtonText: {
    fontSize: 14,
  },
  typingWrapper: {
    opacity: 0.7,
  },
  typingBubble: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  typingText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#0F0F23',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  sendButtonDisabled: {
    backgroundColor: '#2D2D44',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
