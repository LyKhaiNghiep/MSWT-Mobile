import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Button} from 'react-native-paper';
import {InputField} from '../../components/Form';
import {showSnackbar} from '../../utils/snackbar';
import {useAuth} from '../../contexts/AuthContext';
import {userService} from '../../services/userService';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme';

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

      await userService.updateUser(user.userId, {
        ...user,
        ...formData,
      });

      showSnackbar?.success('Cập nhật thông tin thành công');
      navigation.goBack();
    } catch (error) {
      showSnackbar?.error('Cập nhật thông tin thất bại');
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chỉnh sửa thông tin" />
      <ScrollView style={styles.container}>
        <InputField
          label="Họ và tên"
          value={formData.fullName}
          onChangeText={text => setFormData({...formData, fullName: text})}
          style={styles.input}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChangeText={text => setFormData({...formData, email: text})}
          style={styles.input}
          keyboardType="email-address"
        />
        <InputField
          label="Số điện thoại"
          value={formData.phone}
          onChangeText={text => setFormData({...formData, phone: text})}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <InputField
          label="Địa chỉ"
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
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
