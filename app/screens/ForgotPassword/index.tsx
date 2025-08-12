import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {AppHeader} from '../../components/AppHeader';
import {otpService} from '../../services/otpService';
import {theme} from '../../theme';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Password
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const formattedPhone = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+84${phoneNumber}`;
      const verId = await otpService.sendOTP(formattedPhone);
      setVerificationId(verId);
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      await otpService.verifyOTP(verificationId, otp);
      setStep(3);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Add your password change API call here
      // await userService.changePassword(newPassword);

      // Navigate back to login
      // navigation.navigate('Login');
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <AppHeader title="Quên Mật Khẩu" />
      <View style={styles.container}>
        {/* Phone Number Section */}
        <View style={[styles.section, {display: step === 1 ? 'flex' : 'none'}]}>
          <Text style={styles.title}>Nhập số điện thoại của bạn</Text>
          <TextInput
            mode="outlined"
            label="Số Điện Thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            disabled={loading}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSendOTP}
            loading={loading}
            disabled={!phoneNumber || loading}
            style={styles.button}>
            Gửi Mã OTP
          </Button>
        </View>

        {/* OTP Verification Section */}
        <View style={[styles.section, {display: step === 2 ? 'flex' : 'none'}]}>
          <Text style={styles.title}>Nhập Mã OTP</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã đến {phoneNumber}
          </Text>
          <TextInput
            mode="outlined"
            label="Mã OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            disabled={loading}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleVerifyOTP}
            loading={loading}
            disabled={!otp || loading}
            style={styles.button}>
            Xác Thực OTP
          </Button>
          <Button
            mode="text"
            onPress={() => setStep(1)}
            disabled={loading}
            style={styles.backButton}>
            Đổi Số Điện Thoại
          </Button>
        </View>

        {/* Change Password Section */}
        <View style={[styles.section, {display: step === 3 ? 'flex' : 'none'}]}>
          <Text style={styles.title}>Đặt Mật Khẩu Mới</Text>
          <TextInput
            mode="outlined"
            label="Mật Khẩu Mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            disabled={loading}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Xác Nhận Mật Khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            disabled={loading}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleChangePassword}
            loading={loading}
            disabled={!newPassword || !confirmPassword || loading}
            style={styles.button}>
            Đổi Mật Khẩu
          </Button>
        </View>

        {/* Error Message */}
        {error ? (
          <HelperText type="error" visible={!!error}>
            {error === 'Failed to send OTP. Please try again.'
              ? 'Không thể gửi mã OTP. Vui lòng thử lại.'
              : error === 'Invalid OTP. Please try again.'
              ? 'Mã OTP không hợp lệ. Vui lòng thử lại.'
              : error === 'Passwords do not match'
              ? 'Mật khẩu không khớp'
              : error === 'Password must be at least 6 characters'
              ? 'Mật khẩu phải có ít nhất 6 ký tự'
              : error === 'Failed to change password. Please try again.'
              ? 'Không thể đổi mật khẩu. Vui lòng thử lại.'
              : error}
          </HelperText>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  backButton: {
    marginTop: theme.spacing.xs,
  },
});
