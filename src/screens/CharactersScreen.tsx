import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CharacterCard from '../components/CharacterCard';

const CharactersScreen = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = () => {
    if (loading) return;
    setLoading(true);
    fetch(`https://thronesapi.com/api/v2/Characters`)
      .then(response => response.json())
      .then(data => {
        setCharacters(data);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CharacterDetail', { character: item })}>
            <CharacterCard character={item} />
          </TouchableOpacity>
        )}
        ListFooterComponent={loading && <ActivityIndicator />}
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
});

export default CharactersScreen;
