import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {localStore} from '../data';
import {AppStack} from './AppStack';

export const AppNavigator = () => {
  const {} = localStore();
  return (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <AppStack />
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};
