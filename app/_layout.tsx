import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AnimatedBackground } from '../components/effects/AnimatedBackground';
import { Theme } from '../theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      <ErrorBoundary>
        <SafeAreaProvider>
          <AnimatedBackground>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="index" options={{ animation: 'fade' }} />
              <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="learning" options={{ animation: 'fade' }} />
              <Stack.Screen name="grammar" options={{ animation: 'fade' }} />
              <Stack.Screen name="vocabulary" options={{ animation: 'fade' }} />
              <Stack.Screen name="achievements" options={{ animation: 'fade' }} />
              <Stack.Screen name="settings" options={{ animation: 'fade' }} />
              <Stack.Screen 
                name="learning/flashcard" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="pronunciation" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="conversation" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
            </Stack>
          </AnimatedBackground>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
} as const);
