import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EncyclopediaScreen from '../screens/EncyclopediaScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Encyclopedia"
        component={EncyclopediaScreen}
        options={{ title: 'A Song of Ice and Fire' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
