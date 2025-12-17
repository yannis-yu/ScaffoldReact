import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type BookDetailScreenRouteProp = RouteProp<{ params: { book: any } }, 'params'>;

type Props = {
  route: BookDetailScreenRouteProp;
};

const BookDetailScreen: React.FC<Props> = ({ route }) => {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.name}</Text>
      <Text>Publisher: {book.publisher}</Text>
      <Text>Released: {new Date(book.released).toLocaleDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default BookDetailScreen;
