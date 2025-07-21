import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Button} from 'react-native-paper';
import {InputField} from '../../components/Form';
import {showSnackbar} from '../../utils/snackbar';
import {useAuth} from '../../contexts/AuthContext';
import api from '../../services/api';
import {API_URLS} from '../../constants/api-urls';
import {colors} from '../../theme';
import {useNavigation} from '@react-navigation/native';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {user} = useAuth();
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        showSnackbar?.error('Mật khẩu xác nhận không khớp');
        return;
      }

      if (newPassword.length < 6) {
        showSnackbar?.error('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      const response = await api.put(API_URLS.USER.CHANGE_PASSWORD, {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (response.data) {
        showSnackbar?.success('Đổi mật khẩu thành công');
        setNewPassword('');
        setConfirmPassword('');
        setOldPassword('');
      }
    } catch (error) {
      showSnackbar?.error('Đổi mật khẩu thất bại');
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Đổi mật khẩu" />
      <View style={styles.container}>
        <TextInput
          placeholder="Mật khẩu cũ"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Mật khẩu mới"
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={{
              backgroundColor: colors.mainColor,
              flex: 1,

              marginHorizontal: 8,
            }}>
            Lưu
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}>
            Hủy
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },
  input: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,

    marginHorizontal: 8,
  },
});
