import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddFlightScreen from '../screens/AddFlightScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeStore } from '../store/useThemeStore';

export type RootStackParamList = {
  Home: undefined;
  AddFlight: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff', // gray-800 : white
        },
        headerTintColor: isDark ? '#f3f4f6' : '#111827', // gray-100 : gray-900
        contentStyle: {
            backgroundColor: isDark ? '#111827' : '#f3f4f6', // gray-900 : gray-100
        }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Flights' }} />
      <Stack.Screen name="AddFlight" component={AddFlightScreen} options={{ title: 'Add Flight' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}
