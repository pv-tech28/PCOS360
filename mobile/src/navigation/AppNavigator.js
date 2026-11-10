import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../theme/colors';

// Navigators & Screens
import BottomTabNavigator from './BottomTabNavigator';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
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
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {/* Onboarding & Welcome Flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* Main Tab Navigator (Home, Track, Insights, Learn) */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

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
    </Stack.Navigator>
  );
}

