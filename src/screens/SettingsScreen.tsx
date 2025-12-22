import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { useThemeStore } from '../store/useThemeStore';

export default function SettingsScreen() {
  const { amadeusClientId, amadeusClientSecret, setAmadeusCredentials } = useSettingsStore();
  const { theme, toggleTheme } = useThemeStore();
  const [clientId, setClientId] = useState(amadeusClientId);
  const [clientSecret, setClientSecret] = useState(amadeusClientSecret);

  const handleSave = () => {
    setAmadeusCredentials(clientId, clientSecret);
    Alert.alert('Settings', 'Credentials saved successfully.');
  };

  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Amadeus API Settings</Text>

      <View className="mb-4">
        <Text className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Client ID</Text>
        <TextInput
          className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
          value={clientId}
          onChangeText={setClientId}
          placeholder="Enter Client ID"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        />
      </View>

      <View className="mb-4">
        <Text className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Client Secret</Text>
        <TextInput
          className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
          value={clientSecret}
          onChangeText={setClientSecret}
          placeholder="Enter Client Secret"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-600 p-4 rounded items-center mb-8"
      >
        <Text className="text-white font-bold">Save Credentials</Text>
      </TouchableOpacity>

      <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Appearance</Text>
      <View className="flex-row items-center justify-between">
         <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</Text>
         <TouchableOpacity onPress={toggleTheme} className={`px-4 py-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
             <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{isDark ? 'On' : 'Off'}</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}
