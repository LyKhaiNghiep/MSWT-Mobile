import React from 'react';
import {Box, Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {colors} from '../../theme';
import {Avatar, Button, Card, Divider, List} from 'react-native-paper';
import {useAuth} from '../../contexts/AuthContext';
import {Animated, StyleSheet} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigation, StackTabNavigation} from '../../navigators';
import {useAccounts} from '../../hooks/useAccounts';
import {mutate} from 'swr';

export const Profile = () => {
  const {user, logout} = useAuth();

  const {users} = useAccounts();
  const sepcificUser = users?.find(u => u.userName === user?.userName);

  const navigation = useNavigation<StackNavigation>();
  const tabNavigation = useNavigation<StackTabNavigation>();
  const handleChangePassword = () => navigation.navigate('ChangePassword');
  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleGoHome = () => {
    // Since Profile is a tab screen, navigate to the Home tab
    tabNavigation.navigate('Home');
  };

  // Refresh accounts data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Invalidate the SWR cache to fetch fresh data
      mutate('users-all');
    }, []),
  );

  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault={false}>
      <AppHeader title="Thông tin cá nhân" onBackPress={handleGoHome} />
      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Box style={styles.avatarContainer}>
            <Avatar.Image
              size={80}
              key={sepcificUser?.image} // Force re-render when image URL changes
              source={
                sepcificUser?.image
                  ? {uri: sepcificUser.image}
                  : require('../../assets/images/avatar-default.svg')
              }
            />
            <Box style={styles.userInfo}>
              <List.Item
                title={sepcificUser?.fullName || 'N/A'}
                description={
                  sepcificUser?.roleName || sepcificUser?.description || 'N/A'
                }
                titleStyle={styles.name}
                descriptionStyle={styles.role}
              />
            </Box>
          </Box>

          <Divider style={styles.divider} />

          <List.Section>
            <List.Item
              title="Email"
              description={sepcificUser?.email || 'N/A'}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <List.Item
              title="Số điện thoại"
              description={sepcificUser?.phone || 'N/A'}
              left={props => <List.Icon {...props} icon="phone" />}
            />
            <List.Item
              title="Địa chỉ"
              description={sepcificUser?.address || 'N/A'}
              left={props => <List.Icon {...props} icon="map-marker" />}
            />
            <List.Item
              title="Chức vụ"
              description={
                sepcificUser?.description || sepcificUser?.position || 'N/A'
              }
              left={props => <List.Icon {...props} icon="badge-account" />}
            />
            <List.Item
              title="Tên đăng nhập"
              description={sepcificUser?.userName || 'N/A'}
              left={props => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Trạng thái"
              description={sepcificUser?.status || 'N/A'}
              left={props => <List.Icon {...props} icon="account-check" />}
            />
            {user?.rating && (
              <List.Item
                title="Đánh giá"
                description={`${user.rating}/5`}
                left={props => <List.Icon {...props} icon="star" />}
              />
            )}
          </List.Section>
        </Card>

        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
            justifyContent: 'space-between',
            alignContent: 'space-around',
          }}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={handleEditProfile}>
            Chỉnh sửa
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={handleChangePassword}>
            Đổi mật khẩu
          </Button>
        </Box>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.button}
          labelStyle={styles.buttonText}>
          Đăng xuất
        </Button>
      </Animated.ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  avatarContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: colors.grey,
  },
  divider: {
    marginHorizontal: 16,
  },

  button: {
    backgroundColor: colors.mainColor,
    minWidth: 150,
  },
  buttonText: {
    fontSize: 16,
  },
});
