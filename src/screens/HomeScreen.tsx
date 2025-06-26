import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, Typography } from '../constants/Colors';
import { NavigationProps } from '../types';

const HomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const handleNavigateToProfile = () => {
    navigation.navigate('Profile', { userId: '123' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to MSWT Mobile</Text>
        <Text style={styles.subtitle}>
          Your React Native TypeScript app is ready!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToProfile}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    minWidth: 200,
  },
  buttonText: {
    color: Colors.background,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
});

export default HomeScreen;
