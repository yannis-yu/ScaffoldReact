import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HousesScreen from '../screens/HousesScreen';
import HouseDetailScreen from '../screens/HouseDetailScreen';

const Stack = createStackNavigator();

const HousesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HousesList"
        component={HousesScreen}
        options={{ title: 'Houses' }}
      />
      <Stack.Screen
        name="HouseDetail"
        component={HouseDetailScreen}
        options={({ route }) => ({ title: route.params.house.name })}
      />
    </Stack.Navigator>
  );
};

export default HousesNavigator;
