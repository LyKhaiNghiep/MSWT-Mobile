import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, Divider, List, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useAccounts} from '../../hooks/useAccounts';
import {colors} from '../../theme';
import {useAuth} from '../../contexts/AuthContext';

export default function UserDetails() {
  const route = useRoute();
  const {user} = useAuth();
  const {users} = useAccounts();
  const id = (route.params as any).id;
  const sepcificUser = users?.find(u => u.userId === id);

  if (!sepcificUser) return null;
  const roles = [
    {value: 'Worker', label: 'Nhân viên'},
    {value: 'Supervisor', label: 'Giám sát viên'},
    {value: 'Manager', label: 'Quản lý'},
  ];

  return (
    <Screen styles={{backgroundColor: colors.white}} useDefault>
      <AppHeader
        title="Chi tiết người dùng"
        navigateTo={user?.role === 'Supervisor' ? 'Employees' : 'User'}
      />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={80}
                source={
                  sepcificUser.image
                    ? {uri: sepcificUser.image}
                    : require('../../assets/images/avatar-default.svg')
                }
                style={styles.avatar}
              />
              <View style={styles.headerInfo}>
                <Text variant="headlineSmall" style={styles.name}>
                  {sepcificUser.fullName}
                </Text>
                <Text variant="bodyLarge" style={styles.role}>
                  {sepcificUser.roleName ||
                    sepcificUser.description ||
                    roles.find(r => r.value === sepcificUser.role?.roleName)
                      ?.label ||
                    'Không có'}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <List.Section>
              <List.Item
                title="Tên đăng nhập"
                description={sepcificUser.userName || 'N/A'}
                left={props => <List.Icon {...props} icon="account" />}
              />
              <List.Item
                title="Email"
                description={sepcificUser.email || 'N/A'}
                left={props => <List.Icon {...props} icon="email" />}
              />
              <List.Item
                title="Số điện thoại"
                description={sepcificUser.phone || 'N/A'}
                left={props => <List.Icon {...props} icon="phone" />}
              />
              <List.Item
                title="Địa chỉ"
                description={sepcificUser.address || 'N/A'}
                left={props => <List.Icon {...props} icon="map-marker" />}
              />
              <List.Item
                title="Trạng thái"
                description={sepcificUser.status || 'N/A'}
                left={props => <List.Icon {...props} icon="account-check" />}
              />
              <List.Item
                title="Chức vụ"
                description={sepcificUser.description || 'N/A'}
                left={props => <List.Icon {...props} icon="badge-account" />}
              />
              <List.Item
                title="Ngày tạo"
                description={
                  sepcificUser.createAt
                    ? sepcificUser.createAt.split('T')[0]
                    : 'N/A'
                }
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              {sepcificUser.rating && (
                <List.Item
                  title="Đánh giá"
                  description={`${sepcificUser.rating}/5`}
                  left={props => <List.Icon {...props} icon="star" />}
                />
              )}
              {sepcificUser.reasonForLeave && (
                <List.Item
                  title="Lý do nghỉ"
                  description={sepcificUser.reasonForLeave}
                  left={props => <List.Icon {...props} icon="information" />}
                />
              )}
            </List.Section>
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    elevation: 4,
    borderRadius: 12,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 8,
  },
  headerInfo: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  role: {
    color: colors.subLabel,
  },
  divider: {
    marginVertical: 16,
  },
});
