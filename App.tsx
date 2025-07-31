/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { fcmService } from './src/services/fcmService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize FCM service
    fcmService.requestUserPermission();
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
