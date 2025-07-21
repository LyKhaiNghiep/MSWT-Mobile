import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {Button} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {API_URLS} from '../../constants/api-urls';
import {useAuth} from '../../contexts/AuthContext';
import api from '../../services/api';
import {colors} from '../../theme';
import {showSnackbar} from '../../utils/snackbar';

export default function EditProfile() {
  const {user} = useAuth();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    userName: user?.userName || '',
  });

  const handleUpdateProfile = async () => {
    try {
      if (!user?.userId) {
        showSnackbar?.error('Không tìm thấy thông tin người dùng');
        return;
      }

      const response = await api.put(API_URLS.USER.UPDATE_PROFILE, {
        formData,
      });

      if (response.data) {
        showSnackbar?.success('Cập nhật thông tin thành công');
        navigation.goBack();
      }
    } catch (error) {
      showSnackbar?.error('Cập nhật thông tin thất bại');
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chỉnh sửa thông tin" />
      <View style={styles.container}>
        <TextInput
          placeholder="Họ và tên"
          value={formData.fullName}
          onChangeText={text => setFormData({...formData, fullName: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={text => setFormData({...formData, email: text})}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Số điện thoại"
          value={formData.phone}
          onChangeText={text => setFormData({...formData, phone: text})}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Địa chỉ"
          value={formData.address}
          onChangeText={text => setFormData({...formData, address: text})}
          style={styles.input}
          multiline
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleUpdateProfile}
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
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
