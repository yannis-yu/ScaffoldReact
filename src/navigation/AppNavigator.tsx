import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BooksNavigator from './BooksNavigator';
import CharactersNavigator from './CharactersNavigator';
import HousesNavigator from './HousesNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Books') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Characters') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Houses') {
            iconName = focused ? 'home' : 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Books"
        component={BooksNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Characters"
        component={CharactersNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Houses"
        component={HousesNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
