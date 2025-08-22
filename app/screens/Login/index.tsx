import React, {useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {Screen, Text} from '../../components';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../theme';
import {showSnackbar} from '../../utils/snackbar';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../navigators';

export const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigation>();
  const {login} = useAuth();

  const handleLogin = async () => {
    // Basic validation
    if (!phoneNumber.trim()) {
      showSnackbar?.error('Vui lòng nhập số điện thoại');
      return;
    }

    if (!password.trim()) {
      showSnackbar?.error('Vui lòng nhập mật khẩu');
      return;
    }

    console.log('🔐 Login attempt with:', {
      username: phoneNumber,
      password: '***',
    });

    const result = await login({password, username: phoneNumber});

    console.log('🔍 Login result:', {
      success: result.success,
      error: result.error,
    });

    if (result.success) {
      showSnackbar?.success('Đăng nhập thành công');
    } else {
      const errorMessage = result.error || 'Đăng nhập thất bại';
      console.log('❌ Displaying error:', errorMessage);
      showSnackbar?.error(errorMessage);
    }
  };

  return (
    <Screen>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Image
              source={require('../../assets/images/login.png')}
              style={styles.illustration}
              resizeMode="contain"
            />

            <Text style={styles.title}>Đăng nhập</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="0982382934"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••••"
                />
              </View>

              <Text
                style={styles.forgotPassword}
                onPress={() => navigation?.navigate('ForgotPassword')}>
                Quên mật khẩu?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => handleLogin()}>
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  illustration: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#4A55A2',
    textAlign: 'right',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 32,
  },
  loginButton: {
    backgroundColor: '#FF7F50',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
