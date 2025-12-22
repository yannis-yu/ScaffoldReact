import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../db';
import Flight from '../models/Flight';
import { useThemeStore } from '../store/useThemeStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Settings, Plus } from 'lucide-react-native';

const FlightItem = ({ flight, index, isDark }: { flight: Flight; index: number, isDark: boolean }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 100).springify()}
    className={`p-4 mb-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
  >
    <View className="flex-row justify-between mb-2">
      <Text className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{flight.carrierCode} {flight.flightNumber}</Text>
      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{flight.date}</Text>
    </View>
    <View className="flex-row justify-between items-center">
        <View>
            <Text className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{flight.origin}</Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{flight.scheduledDeparture ? new Date(flight.scheduledDeparture).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</Text>
        </View>
        <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>─────✈─────</Text>
        <View items-end>
            <Text className={`text-xl font-bold text-right ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{flight.destination}</Text>
            <Text className={`text-xs text-right ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{flight.scheduledArrival ? new Date(flight.scheduledArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</Text>
        </View>
    </View>
  </Animated.View>
);

const FlightList = ({ flights, isDark }: { flights: Flight[], isDark: boolean }) => {
    if (flights.length === 0) {
        return (
            <View className="flex-1 justify-center items-center mt-20">
                <Text className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No flights added yet.</Text>
            </View>
        )
    }
  return (
    <FlatList
      data={flights}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => <FlightItem flight={item} index={index} isDark={isDark} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

const EnhancedFlightList = withObservables([], () => ({
  flights: database.collections.get<Flight>('flights').query().observe(),
}))(FlightList);

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} className="mr-2">
          <Settings color={isDark ? '#e5e7eb' : '#374151'} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDark]);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#f3f4f6' }} className={`flex-1 px-4 pt-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <EnhancedFlightList isDark={isDark} />

      <TouchableOpacity
        style={{ position: 'absolute', bottom: 32, right: 32, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' }}
        className="absolute bottom-8 right-8 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('AddFlight')}
      >
        <Plus color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
}
