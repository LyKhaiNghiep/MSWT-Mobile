import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {AppHeader} from '../../components/AppHeader';
import {otpService} from '../../services/otpService';
import {theme} from '../../theme';
import api from '../../services/api';
import useUsers from '../../hooks/useUsers';
import {showSnackbar} from '../../utils/snackbar';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../navigators';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Số điện thoại, 2: OTP, 3: Mật khẩu
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {users} = useUsers();
  const navigation = useNavigation<StackNavigation>();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      let formattedPhone = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+84${phoneNumber}`;

      const exist = users.find(x => x.phone === phoneNumber);
      if (!exist) {
        setError('Số điện thoại không tồn tại');
        return;
      }

      // Số điện thoại giả lập để kiểm thử firebase
      formattedPhone = '+1 650-555-3434';

      const verId = await otpService.sendOTP(formattedPhone);
      setVerificationId(verId);
      setStep(2);
    } catch (err) {
      setError('Không thể gửi mã OTP. Vui lòng thử lại.');
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
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');

      if (newPassword !== confirmPassword) {
        setError('Mật khẩu không khớp');
        return;
      }

      if (newPassword.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      const result = await api.put('users/change-password-by-phoneNumber', {
        phoneNumber: phoneNumber,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      });

      showSnackbar.success('Đổi mật khẩu thành công');
      navigation.navigate('Login');

      console.log('result', result);
    } catch (err: any) {
      console.log('err', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <AppHeader title="Quên Mật Khẩu" />
      <View style={styles.container}>
        {/* Phần Số Điện Thoại */}
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

        {/* Phần Xác Thực OTP */}
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

        {/* Phần Đổi Mật Khẩu */}
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

        {/* Thông Báo Lỗi */}
        {error ? (
          <HelperText type="error" visible={!!error}>
            {error}
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
