import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Card,
  Text,
  Surface,
  Badge,
  IconButton,
  Chip,
  Avatar,
  Divider,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {User} from '../../config/models/user.model';
import {useAccounts} from '../../hooks/useAccounts';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

export default function UserListPage() {
  const {users, isLoading} = useAccounts();
  const navigation = useNavigation<StackNavigation>();
  const [selectedRole, setSelectedRole] = useState('Supervisor');

  const roles = [
    {value: 'Worker', label: 'Nhân viên'},
    {value: 'Supervisor', label: 'Giám sát viên'},
    {value: 'Manager', label: 'Quản lý'},
  ];

  const filteredUsers = users?.filter(
    user => user.role?.roleName === selectedRole,
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hoạt động':
        return colors.success;
      case 'tạm khóa':
        return colors.warning;
      case 'đã khóa':
        return colors.error;
      default:
        return colors.subLabel;
    }
  };

  const renderItem = ({item}: {item: User}) => (
    <Surface style={styles.surface} elevation={2}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('UserDetails' as any, {id: item.userId})
        }>
        <Card.Content style={styles.cardContent}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Avatar.Image
                  size={50}
                  source={
                    item.image
                      ? {uri: item.image}
                      : require('../../assets/images/avatar-default.svg')
                  }
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.fullName}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtitle}>
                    {item.email}
                  </Text>
                </View>
              </View>
              <Badge
                size={24}
                style={[
                  styles.badge,
                  {backgroundColor: getStatusColor(item.status)},
                ]}>
                {item.status}
              </Badge>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.footer}>
              <Chip
                icon="briefcase"
                style={styles.roleChip}
                textStyle={styles.roleChipText}>
                {roles.find(x => x.value === item.role?.roleName)?.label}
              </Chip>
              <IconButton
                icon="chevron-right"
                size={24}
                iconColor={colors.primary}
                style={styles.chevron}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  if (isLoading) {
    return (
      <Screen useDefault>
        <AppHeader title="Người dùng" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen useDefault>
      <AppHeader title="Người dùng" />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {roles.map(role => (
            <Chip
              key={role.value}
              selected={selectedRole === role.value}
              onPress={() => setSelectedRole(role.value)}>
              {role.label}
            </Chip>
          ))}
        </View>
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item => item.userId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Không có người dùng nào
              </Text>
            </View>
          }
          removeClippedSubviews={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    backgroundColor: colors.blueLight,
  },

  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  surface: {
    borderRadius: 16,
    backgroundColor: colors.white,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.subLabel,
  },
  badge: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleChip: {},
  roleChipText: {
    color: colors.primary,
    fontSize: 12,
  },
  chevron: {
    margin: 0,
    padding: 0,
  },
  separator: {
    height: 12,
  },
  emptyText: {
    color: colors.subLabel,
    textAlign: 'center',
  },
});
