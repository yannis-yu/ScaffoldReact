import React from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/store/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/useThemeStore';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
    const { theme } = useThemeStore();
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <NavigationContainer>
                <AppNavigator />
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AppContent />
    </QueryClientProvider>
  );
}
