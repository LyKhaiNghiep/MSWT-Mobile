/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  CalenderActive,
  CalenderTab,
  ChatActive,
  Chat as ChatTab,
  EarningActive,
  Earning as EarningTab,
  ProfileActive,
  Profile as ProfileTab,
} from '../assets/svgs';
import {TabIcon} from '../components';
import {Earning, EnhancedChat, Profile} from '../screens';
import {Appointment} from '../screens/Appointment';
import {colors} from '../theme';
import {$tabBar, $tabLabel} from './style';
import {TabParamList} from './TabParamList';

export const HomeNavigator = () => {
  const Tab = createBottomTabNavigator<TabParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerBackgroundContainerStyle: {backgroundColor: colors.white},
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: $tabLabel,
        tabBarStyle: $tabBar,
      }}>
      {/* <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={<HomeActive />}
              focused={focused}
              icon={<HomeTab />}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Appointment"
        component={Appointment}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={<CalenderActive />}
              focused={focused}
              icon={<CalenderTab />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Earning"
        component={Earning}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={<EarningActive />}
              focused={focused}
              icon={<EarningTab />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={EnhancedChat}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <TabIcon
              activeIcon={<ChatActive />}
              focused={focused}
              icon={<ChatTab />}
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
              activeIcon={<ProfileActive />}
              focused={focused}
              icon={<ProfileTab />}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
