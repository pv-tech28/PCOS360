import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { HealthProvider } from './src/context/HealthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <HealthProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="#FAF9FC" />
          <AppNavigator />
        </NavigationContainer>
      </HealthProvider>
    </SafeAreaProvider>
  );
}

