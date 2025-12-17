import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HouseCard = ({ house }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{house.name}</Text>
      <Text>Region: {house.region || 'Unknown'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HouseCard;
