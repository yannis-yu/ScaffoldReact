import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeamListScreen from '../screens/TeamListScreen';
import TeamDetailsScreen from '../screens/TeamDetailsScreen';
import PlayerDetailsScreen from '../screens/PlayerDetailsScreen';
import TournamentListScreen from '../screens/TournamentListScreen';
import TournamentDetailsScreen from '../screens/TournamentDetailsScreen';
import MatchDetailsScreen from '../screens/MatchDetailsScreen';
import HeroListScreen from '../screens/HeroListScreen';
import HeroDetailsScreen from '../screens/HeroDetailsScreen';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TeamsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TeamList" component={TeamListScreen} options={{ title: 'Dota 2 Teams' }} />
    <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} options={{ title: 'Team Details' }} />
    <Stack.Screen name="PlayerDetails" component={PlayerDetailsScreen} options={{ title: 'Player Details' }} />
  </Stack.Navigator>
);

const TournamentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TournamentList" component={TournamentListScreen} options={{ title: 'Dota 2 Tournaments' }} />
    <Stack.Screen name="TournamentDetails" component={TournamentDetailsScreen} options={{ title: 'Tournament Details' }} />
    <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} options={{ title: 'Match Details' }} />
  </Stack.Navigator>
);

const HeroesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HeroList" component={HeroListScreen} options={{ title: 'Dota 2 Heroes' }} />
    <Stack.Screen name="HeroDetails" component={HeroDetailsScreen} options={{ title: 'Hero Details' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Teams') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Tournaments') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else if (route.name === 'Heroes') {
              iconName = focused ? 'shield' : 'shield-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Teams" component={TeamsStack} />
        <Tab.Screen name="Tournaments" component={TournamentsStack} />
        <Tab.Screen name="Heroes" component={HeroesStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
