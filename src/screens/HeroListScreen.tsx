import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { getHeroStats, getSteamImageUrl } from '../api/openDota';
import { Hero } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HeroList'>;

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns;

const HeroListScreen = ({ navigation }: Props) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await getHeroStats();
        setHeroes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  const renderHero = ({ item }: { item: Hero }) => (
    <TouchableOpacity
      testID={`hero-item-${item.id}`}
      style={styles.itemContainer}
      onPress={() => navigation.navigate('HeroDetails', { hero: item })}
    >
      <Image source={{ uri: getSteamImageUrl(item.img) }} style={styles.heroImage} />
      <Text style={styles.heroName}>{item.localized_name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={heroes}
        renderItem={renderHero}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
      />
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
  itemContainer: {
    width: itemSize,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: itemSize * 0.8,
    height: itemSize * 0.8 * (9 / 16), // Maintain aspect ratio
    borderRadius: 8,
  },
  heroName: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HeroListScreen;
