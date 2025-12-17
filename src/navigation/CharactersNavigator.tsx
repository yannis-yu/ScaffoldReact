import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CharactersScreen from '../screens/CharactersScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';

const Stack = createStackNavigator();

const CharactersNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CharactersList"
        component={CharactersScreen}
        options={{ title: 'Characters' }}
      />
      <Stack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={({ route }) => ({ title: route.params.character.name || 'Character Details' })}
      />
    </Stack.Navigator>
  );
};

export default CharactersNavigator;
