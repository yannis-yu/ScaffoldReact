import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HouseCard from '../components/HouseCard';

const HousesScreen = () => {
  const [houses, setHouses] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = () => {
    if (loading) return;
    setLoading(true);
    fetch(`https://anapioficeandfire.com/api/houses?page=${page}&pageSize=20`)
      .then(response => response.json())
      .then(data => {
        setHouses(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={houses}
        keyExtractor={item => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('HouseDetail', { house: item })}>
            <HouseCard house={item} />
          </TouchableOpacity>
        )}
        onEndReached={loadHouses}
        onEndReachedThreshold={0.5}
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

export default HousesScreen;
