/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Platform, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { fcmService } from './src/services/fcmService';

// Ignore Firebase related warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'No Firebase App',
    'Firebase is not initialized',
    'FirebaseApp is not initialized',
  ]);
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    if (Platform.OS === 'android' || !__DEV__) {
      fcmService.requestUserPermission().catch(error => {
        console.warn('FCM initialization failed:', error);
      });
    } else {
      console.log('FCM is disabled for iOS in development');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <CalendarScreen />
    </SafeAreaProvider>
  );
}

export default App;
