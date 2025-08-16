import {ThemeProvider} from '@shopify/restyle';
import React from 'react';
import {StatusBar} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {theme} from './theme';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {AuthProvider} from './contexts/AuthContext';
import {AppStack} from './navigators/AppStack';
import '@react-native-firebase/app';

function App(): React.JSX.Element {
  const navigationRef = createNavigationContainerRef<any>();

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <AuthProvider>
            <AppStack />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
