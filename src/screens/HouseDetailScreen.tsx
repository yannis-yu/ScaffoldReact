import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type HouseDetailScreenRouteProp = RouteProp<{ params: { house: any } }, 'params'>;

type Props = {
  route: HouseDetailScreenRouteProp;
};

const HouseDetailScreen: React.FC<Props> = ({ route }) => {
  const { house } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{house.name}</Text>
      <Text style={styles.label}>Region:</Text>
      <Text>{house.region || 'Unknown'}</Text>
      <Text style={styles.label}>Coat of Arms:</Text>
      <Text>{house.coatOfArms || 'Unknown'}</Text>
      <Text style={styles.label}>Words:</Text>
      <Text>{house.words || 'Unknown'}</Text>
      <Text style={styles.label}>Titles:</Text>
      {house.titles.map((title: string, index: number) => (
        <Text key={index}>- {title}</Text>
      ))}
      <Text style={styles.label}>Seats:</Text>
      {house.seats.map((seat: string, index: number) => (
        <Text key={index}>- {seat}</Text>
      ))}
    </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default HouseDetailScreen;
