import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeamListScreen from '../screens/TeamListScreen';
import TeamDetailsScreen from '../screens/TeamDetailsScreen';
import TournamentListScreen from '../screens/TournamentListScreen';
import TournamentDetailsScreen from '../screens/TournamentDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TeamList">
        <Stack.Screen name="TeamList" component={TeamListScreen} options={{ title: 'Dota 2 Teams' }} />
        <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} options={{ title: 'Team Details' }} />
        <Stack.Screen name="TournamentList" component={TournamentListScreen} options={{ title: 'Dota 2 Tournaments' }} />
        <Stack.Screen name="TournamentDetails" component={TournamentDetailsScreen} options={{ title: 'Tournament Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
