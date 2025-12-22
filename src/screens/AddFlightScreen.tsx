import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../db';
import { fetchFlightStatus } from '../services/amadeus';
import { useThemeStore } from '../store/useThemeStore';

export default function AddFlightScreen() {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [carrierCode, setCarrierCode] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState(''); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);

  const handleFetchAndSave = async () => {
    if (!carrierCode || !flightNumber || !date) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Fetch from Amadeus
      const data = await fetchFlightStatus(carrierCode, flightNumber, date);

      if (!data.data || data.data.length === 0) {
        Alert.alert('Not Found', 'Flight not found.');
        setLoading(false);
        return;
      }

      const flightData = data.data[0];
      const flightPoints = flightData.flightDesignator || {}; // Depending on exact API response structure for flight points
      // Note: Amadeus Flight Status structure varies. Usually `flightPoints` or `segments`.
      // Let's assume a simplified mapping or try to safely access.
      // Actually `data` from /schedule/flights usually has:
      // data: [{ type: 'flight-schedule', start: {...}, end: {...}, ... }]
      // But let's check structure.
      // If we don't know exact structure, let's map what we can.

      // Amadeus Flight Status response example usually has `flightDesignator`, `flightPoints` array (departure, arrival).

      const departure = flightData.flightPoints?.find((p: any) => p.departure);
      const arrival = flightData.flightPoints?.find((p: any) => p.arrival);

      const origin = departure?.iataCode || 'UNKNOWN';
      const destination = arrival?.iataCode || 'UNKNOWN';
      const scheduledDeparture = departure?.departure?.scheduledTime || '';
      const scheduledArrival = arrival?.arrival?.scheduledTime || '';

      // Save to WatermelonDB
      await database.write(async () => {
        await database.get('flights').create(record => {
          const flight = record as any; // Cast to any to bypass TS checks on dynamic properties for now, or use stronger typing
          flight.flightNumber = flightNumber;
          flight.carrierCode = carrierCode;
          flight.date = date;
          flight.origin = origin;
          flight.destination = destination;
          flight.status = 'Scheduled'; // Simplified
          flight.scheduledDeparture = scheduledDeparture;
          flight.scheduledArrival = scheduledArrival;
        });
      });

      Alert.alert('Success', 'Flight added successfully.');
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add flight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`flex-1 p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Text className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Carrier Code (e.g., UA)</Text>
      <TextInput
        className={`p-3 rounded border mb-4 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
        value={carrierCode}
        onChangeText={setCarrierCode}
        placeholder="UA"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        autoCapitalize="characters"
      />

      <Text className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Flight Number (e.g., 123)</Text>
      <TextInput
        className={`p-3 rounded border mb-4 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
        value={flightNumber}
        onChangeText={setFlightNumber}
        placeholder="123"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        keyboardType="numeric"
      />

      <Text className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date (YYYY-MM-DD)</Text>
      <TextInput
        className={`p-3 rounded border mb-6 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
        value={date}
        onChangeText={setDate}
        placeholder="2023-11-01"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
      />

      <TouchableOpacity
        onPress={handleFetchAndSave}
        disabled={loading}
        className={`p-4 rounded items-center ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Add Flight</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
