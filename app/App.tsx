import {ThemeProvider} from '@shopify/restyle';
import React from 'react';
import {StatusBar} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {theme} from './theme';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {AuthProvider} from './contexts/AuthContext';
import {AppStack} from './navigators/AppStack';
function App(): React.JSX.Element {
  const navigationRef = createNavigationContainerRef<any>();

  return (
    <GestureHandlerRootView>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <BottomSheetModalProvider>
              <AuthProvider>
                <AppStack />
              </AuthProvider>
            </BottomSheetModalProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
