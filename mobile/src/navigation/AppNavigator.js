import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import { useHealth } from '../context/HealthContext';

// Navigators & Screens
import BottomTabNavigator from './BottomTabNavigator';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LabDecoderScreen from '../screens/features/LabDecoderScreen';
import WhatIfScreen from '../screens/features/WhatIfScreen';
import CopilotScreen from '../screens/features/CopilotScreen';
import TimelineScreen from '../screens/features/TimelineScreen';
import CareGapsScreen from '../screens/features/CareGapsScreen';
import MetabolicScreen from '../screens/features/MetabolicScreen';
import ClinicalExplorerScreen from '../screens/features/ClinicalExplorerScreen';
import ExplainAIScreen from '../screens/features/ExplainAIScreen';
import SettingsScreen from '../screens/features/SettingsScreen';
import DailyLogModalScreen from '../screens/modals/DailyLogModalScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { authState, profile } = useHealth();

  if (authState === 'loading') {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingTitle}>Restoring PCOS360 session...</Text>
      </View>
    );
  }

  const isSignedOut = authState === 'signed_out';
  const startRoute = authState === 'authenticated' && !profile.initialized ? 'Onboarding' : 'MainTabs';
  const navKey = isSignedOut ? 'signed-out' : 'signed-in';

  return (
    <NavigationContainer key={navKey}>
      <Stack.Navigator
        initialRouteName={isSignedOut ? 'Welcome' : startRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {isSignedOut ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />

            {/* Feature Screens */}
            <Stack.Screen name="LabDecoder" component={LabDecoderScreen} />
            <Stack.Screen name="WhatIf" component={WhatIfScreen} />
            <Stack.Screen name="Copilot" component={CopilotScreen} />
            <Stack.Screen name="Timeline" component={TimelineScreen} />
            <Stack.Screen name="CareGaps" component={CareGapsScreen} />
            <Stack.Screen name="Metabolic" component={MetabolicScreen} />
            <Stack.Screen name="ClinicalExplorer" component={ClinicalExplorerScreen} />
            <Stack.Screen name="ExplainAI" component={ExplainAIScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />

            {/* Modals */}
            <Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
              <Stack.Screen name="DailyLogModal" component={DailyLogModalScreen} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
