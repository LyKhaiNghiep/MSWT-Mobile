import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import { fetchUserProfile, updateUserProfile } from '../store/slices/userSlice';
import Button from '../components/Button';
import { Colors, Spacing, Typography } from '../constants/Colors';
import { NavigationProps } from '../types';

const ProfileScreen: React.FC<NavigationProps> = ({
  navigation: _navigation,
}) => {
  const dispatch = useAppDispatch();

  // Redux state
  const {
    user,
    isLoading: authLoading,
    error: authError,
    isAuthenticated,
  } = useAppSelector(state => state.auth);
  const { profile, isLoading: userLoading } = useAppSelector(
    state => state.user
  );

  // Local state for forms
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });

  // Initialize profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  // Handle login
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(loginUser(loginForm)).unwrap();
      Alert.alert('Success', 'Logged in successfully!');
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      Alert.alert('Login Failed', error as string);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!profileForm.name || !profileForm.email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(updateUserProfile(profileForm)).unwrap();
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Update Failed', error as string);
    }
  };

  // Fetch user profile
  const handleFetchProfile = () => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  };

  // Clear auth error
  const handleClearError = () => {
    dispatch(clearError());
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Login to Continue</Text>

          {authError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{authError}</Text>
              <Button
                title="Clear Error"
                onPress={handleClearError}
                variant="outline"
                size="small"
              />
            </View>
          )}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={loginForm.email}
              onChangeText={text => setLoginForm({ ...loginForm, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={loginForm.password}
              onChangeText={text =>
                setLoginForm({ ...loginForm, password: text })
              }
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={authLoading}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome, {user?.name}!</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={profileForm.name}
              onChangeText={text =>
                setProfileForm({ ...profileForm, name: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profileForm.email}
              onChangeText={text =>
                setProfileForm({ ...profileForm, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              title="Update Profile"
              onPress={handleUpdateProfile}
              loading={userLoading}
              style={styles.button}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redux Actions</Text>

          <Button
            title="Fetch Profile Data"
            onPress={handleFetchProfile}
            variant="secondary"
            loading={userLoading}
            style={styles.button}
          />

          {profile && (
            <View style={styles.profileData}>
              <Text style={styles.dataText}>Fetched Profile:</Text>
              <Text style={styles.dataText}>ID: {profile.id}</Text>
              <Text style={styles.dataText}>Name: {profile.name}</Text>
              <Text style={styles.dataText}>Email: {profile.email}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  form: {
    gap: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.md,
    backgroundColor: Colors.surface,
  },
  button: {
    marginTop: Spacing.sm,
  },
  errorContainer: {
    backgroundColor: Colors.error,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorText: {
    color: Colors.background,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  profileData: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  dataText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
});

export default ProfileScreen;
