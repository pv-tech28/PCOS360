import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, LineChart, BookOpen } from 'lucide-react-native';
import colors from '../theme/colors';

// Tab Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import TrackerScreen from '../screens/main/TrackerScreen';
import PcoscopeScreen from '../screens/main/PcoscopeScreen';
import LearningHubScreen from '../screens/main/LearningHubScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="TrackTab"
        component={TrackerScreen}
        options={{
          tabBarLabel: 'Track',
          tabBarIcon: ({ color, focused }) => (
            <Calendar size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="InsightsTab"
        component={PcoscopeScreen}
        options={{
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <LineChart size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="LearnTab"
        component={LearningHubScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#292431',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

