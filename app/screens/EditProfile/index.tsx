import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Avatar, Button, Text, ActivityIndicator} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {API_URLS} from '../../constants/api-urls';
import {useAuth} from '../../contexts/AuthContext';
import {useAccounts} from '../../hooks/useAccounts';
import api from '../../services/api';
import {colors} from '../../theme';
import {showSnackbar} from '../../utils/snackbar';

export default function EditProfile() {
  const {user} = useAuth();

  const {users} = useAccounts();
  const sepcificUser = users?.find(u => u.userName === user?.userName);

  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    fullName: sepcificUser?.fullName || '',
    email: sepcificUser?.email || '',
    phone: sepcificUser?.phone || '',
    address: sepcificUser?.address || '',
    userName: sepcificUser?.userName || '',
    image: sepcificUser?.image || '',
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          name: result.assets[0].fileName || 'image.jpg',
        });

        const response = await api.post(API_URLS.CLOUDINARY, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data?.url) {
          setFormData(prev => ({
            ...prev,
            image: response.data.url,
          }));
          showSnackbar?.success('Tải ảnh lên thành công');
        }
      } catch (error) {
        showSnackbar?.error('Tải ảnh lên thất bại');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!user?.userId) {
        showSnackbar?.error('Không tìm thấy thông tin người dùng');
        return;
      }

      const response = await api.put(API_URLS.USER.UPDATE_PROFILE, formData);

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
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.avatarContainer}
            disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator size="large" color={colors.mainColor} />
            ) : (
              <>
                <Avatar.Image size={100} source={{uri: formData.image}} />
                <Text style={styles.changePhotoText}>Thay đổi ảnh</Text>
              </>
            )}
          </TouchableOpacity>

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
      </ScrollView>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePhotoText: {
    color: colors.mainColor,
    marginTop: 8,
    fontSize: 16,
  },
});
