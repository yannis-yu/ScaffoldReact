import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const BookCard = ({ book }) => {
  const imageUrl = book.name === 'A Game of Thrones'
    ? 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/AGameOfThrones.jpg/250px-AGameOfThrones.jpg'
    : null;

  return (
    <View style={styles.card}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{book.name}</Text>
        <Text>Author: {book.authors.join(', ')}</Text>
        <Text>Pages: {book.numberOfPages}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 16,
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookCard;
