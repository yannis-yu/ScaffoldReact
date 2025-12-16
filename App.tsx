import 'react-native-gesture-handler';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

// Screens (Placeholders for now)
import LoginScreen from './screens/LoginScreen';
import ChatListScreen from './screens/ChatListScreen';
import VideoListScreen from './screens/VideoListScreen';
import LibraryScreen from './screens/LibraryScreen';
import SettingsScreen from './screens/SettingsScreen';

// Context
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const Stack = createStackNavigator();

export default function App() {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState('');
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSession = await AsyncStorage.getItem('session');
      const storedApiId = await AsyncStorage.getItem('apiId');
      const storedApiHash = await AsyncStorage.getItem('apiHash');
      const storedTmdbApiKey = await AsyncStorage.getItem('tmdbApiKey');

      if (storedSession) setSession(storedSession);
      if (storedApiId) setApiId(storedApiId);
      if (storedApiHash) setApiHash(storedApiHash);
      if (storedTmdbApiKey) setTmdbApiKey(storedTmdbApiKey);

      // If we have credentials, we might be "logged in" conceptually,
      // but we still need to connect. For now, let's just finish loading.
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newApiId, newApiHash, newTmdbApiKey) => {
    try {
      if(newApiId) {
          await AsyncStorage.setItem('apiId', newApiId);
          setApiId(newApiId);
      }
      if(newApiHash) {
          await AsyncStorage.setItem('apiHash', newApiHash);
          setApiHash(newApiHash);
      }
      if(newTmdbApiKey) {
          await AsyncStorage.setItem('tmdbApiKey', newTmdbApiKey);
          setTmdbApiKey(newTmdbApiKey);
      }
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const saveSession = async (newSession) => {
      try {
          await AsyncStorage.setItem('session', newSession);
          setSession(newSession);
      } catch (e) {
          console.error('Failed to save session', e);
      }
  }

  const logout = async () => {
      setClient(null);
      setSession('');
      setIsLoggedIn(false);
      await AsyncStorage.removeItem('session');
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppContext.Provider
        value={{
          client,
          setClient,
          session,
          saveSession,
          apiId,
          apiHash,
          tmdbApiKey,
          saveSettings,
          isLoggedIn,
          setIsLoggedIn,
          logout
        }}
      >
        <NavigationContainer>
          <Stack.Navigator>
            {!isLoggedIn ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
              <>
                <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
                <Stack.Screen name="VideoList" component={VideoListScreen} options={{ title: 'Videos' }} />
                <Stack.Screen name="Library" component={LibraryScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}
