import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { getSteamImageUrl } from '../api/openDota';
import { Hero } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HeroDetails'>;

const HeroDetailsScreen = ({ route }: Props) => {
  const { hero } = route.params;

  if (!hero) {
    return (
      <View style={styles.centered}>
        <Text>Hero not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: getSteamImageUrl(hero.img) }} style={styles.heroImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.heroName}>{hero.localized_name}</Text>
          <Text style={styles.primaryAttr}>
            Primary Attribute: {hero.primary_attr?.toUpperCase()}
          </Text>
          <Text style={styles.roles}>Roles: {hero.roles?.join(', ')}</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statTitle}>Base Stats</Text>
            <Text>Attack Type: {hero.attack_type}</Text>
            <Text>Health: {hero.base_health}</Text>
            <Text>Mana: {hero.base_mana}</Text>
            <Text>Armor: {hero.base_armor}</Text>
            <Text>
              Attack: {hero.base_attack_min} - {hero.base_attack_max}
            </Text>
            <Text>Move Speed: {hero.move_speed}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 16,
  },
  heroName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  primaryAttr: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },
  roles: {
    fontSize: 16,
    marginTop: 8,
  },
  statsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  statTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default HeroDetailsScreen;
