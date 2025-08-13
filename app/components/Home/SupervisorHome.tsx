import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButton, Surface, Text, useTheme} from 'react-native-paper';
import Animated, {FadeInUp, Layout} from 'react-native-reanimated';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {MenuItem, NavigationScreenProps} from '../../config/types';
import {colors} from '../../theme';

export const SupervisorHome = () => {
  const navigation = useNavigation<NavigationScreenProps>();
  const theme = useTheme();

  const menuItems: MenuItem[] = [
    {
      id: 'report',
      title: 'Báo cáo',
      icon: 'file-document-outline',
      route: 'WorkerReport',
      color: theme.colors.primary,
    },

    {
      id: 'floor',
      title: 'Xem lịch',
      icon: 'calendar-month-outline',
      route: 'CalendarSupervisor',
      color: theme.colors.secondary,
    },

    {
      id: 'trash',
      title: 'Thùng rác',
      icon: 'delete-outline',
      route: 'Trash',
      color: theme.colors.error,
    },

    {
      id: 'user',
      title: 'Nhân viên',
      icon: 'account-group',
      route: 'Employees',
      color: theme.colors.primary,
    },
  ];

  return (
    <Screen styles={styles.screen} useDefault>
      <AppHeader showLogo={true} />

      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.sectionTitle}>
          Danh mục
        </Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(index * 100)}
              layout={Layout.springify()}>
              <Surface
                style={[
                  styles.menuItem,
                  {backgroundColor: theme.colors.surface},
                ]}
                elevation={2}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(item.route)}
                  style={styles.menuItemContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item.color},
                    ]}>
                    <IconButton
                      icon={item.icon}
                      size={24}
                      iconColor={theme.colors.surface}
                    />
                  </View>
                  <Text variant="labelLarge" style={styles.menuText}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Surface>
            </Animated.View>
          ))}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  appBar: {
    backgroundColor: colors.mainColor,
    elevation: 0,
  },
  avatar: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuItem: {
    width: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItemContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 12,
    marginBottom: 8,
  },
  menuText: {
    textAlign: 'center',
    marginTop: 8,
  },
});
