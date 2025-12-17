import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BooksScreen from '../screens/BooksScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

const Stack = createStackNavigator();

const BooksNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BooksList"
        component={BooksScreen}
        options={{ title: 'Books' }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={({ route }) => ({ title: route.params.book.name })}
      />
    </Stack.Navigator>
  );
};

export default BooksNavigator;
