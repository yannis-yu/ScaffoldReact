import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type CharacterDetailScreenRouteProp = RouteProp<{ params: { character: any } }, 'params'>;

type Props = {
  route: CharacterDetailScreenRouteProp;
};

const CharacterDetailScreen: React.FC<Props> = ({ route }) => {
  const { character } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: character.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{character.fullName}</Text>
      <Text style={styles.label}>Title:</Text>
      <Text>{character.title}</Text>
      <Text style={styles.label}>Family:</Text>
      <Text>{character.family}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default CharacterDetailScreen;
