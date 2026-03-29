import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../theme';

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary — catches unexpected errors and shows a fallback UI
 * with a button to restart the app.
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console (in production, send to crash reporting)
    console.error('Unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // In a real app, you might reload the app or navigate home
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😢</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Pressable onPress={this.handleReset} style={styles.button}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    ...Theme.typography.heading2,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  message: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.xxxl,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  buttonText: {
    color: '#fff',
    ...Theme.typography.bodyBold,
  },
});
