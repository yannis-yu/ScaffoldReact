import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BookCard from '../components/BookCard';

const EncyclopediaScreen = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('https://anapioficeandfire.com/api/books')
      .then(response => response.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>A Song of Ice and Fire Encyclopedia</Text>
      <FlatList
        data={books}
        keyExtractor={item => item.url}
        renderItem={({ item }) => <BookCard book={item} />}
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

export default EncyclopediaScreen;
