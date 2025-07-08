/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {TabIcon} from '../components';
import {Home, Notification, Profile} from '../screens';
import {colors, theme} from '../theme';
import {$tabBar, $tabLabel} from './style';
import {TabParamList} from './TabParamList';

export const Navigator = () => {
  const Tab = createBottomTabNavigator<TabParamList>();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: $tabLabel,
        tabBarStyle: $tabBar,
      }}>
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={
                <IconButton
                  icon={'bell'}
                  size={32}
                  mode="contained"
                  iconColor={theme.colors.mainColor}
                  containerColor={colors.white}
                />
              }
              focused={focused}
              icon={
                <IconButton
                  icon={'bell'}
                  size={32}
                  iconColor={theme.colors.white}
                />
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={
                <IconButton
                  icon={'home'}
                  size={36}
                  mode="contained"
                  iconColor={theme.colors.mainColor}
                  containerColor={colors.white}
                />
              } //
              focused={focused}
              icon={
                <IconButton
                  icon={'home'}
                  size={36}
                  iconColor={theme.colors.white}
                />
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={
                <IconButton
                  icon={'account-circle'}
                  size={32}
                  mode="contained"
                  iconColor={theme.colors.mainColor}
                  containerColor={colors.white}
                />
              }
              focused={focused}
              icon={
                <IconButton
                  icon={'account-circle'}
                  size={32}
                  iconColor={theme.colors.white}
                />
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
