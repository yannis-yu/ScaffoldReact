import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BookCard from '../components/BookCard';

const BooksScreen = () => {
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://anapioficeandfire.com/api/books')
      .then(response => response.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { book: item })}>
            <BookCard book={item} />
          </TouchableOpacity>
        )}
      />
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

export default BooksScreen;
