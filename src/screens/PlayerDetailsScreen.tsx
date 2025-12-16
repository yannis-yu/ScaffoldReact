import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  getPlayerById,
  getPlayerRecentMatches,
  getPlayerHeroes,
  getHeroStats,
  getSteamImageUrl,
} from '../api/openDota';
import { PlayerDetails, RecentMatch, PlayerHero, Hero } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerDetails'>;

const PlayerDetailsScreen = ({ route, navigation }: Props) => {
  const { accountId } = route.params;
  const [player, setPlayer] = useState<PlayerDetails | null>(null);
  const [matches, setMatches] = useState<RecentMatch[]>([]);
  const [heroes, setHeroes] = useState<PlayerHero[]>([]);
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const [
          playerRes,
          matchesRes,
          heroesRes,
          allHeroesRes,
        ] = await Promise.all([
          getPlayerById(accountId),
          getPlayerRecentMatches(accountId),
          getPlayerHeroes(accountId),
          getHeroStats(),
        ]);
        setPlayer(playerRes.data);
        setMatches(matchesRes.data);
        setHeroes(heroesRes.data.slice(0, 5)); // Top 5 heroes
        setAllHeroes(allHeroesRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [accountId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !player) {
    return (
      <View style={styles.centered}>
        <Text>{error ? `Error: ${error}` : 'Player not found.'}</Text>
      </View>
    );
  }

  const renderMatch = ({ item }: { item: RecentMatch }) => (
    <TouchableOpacity
      style={styles.matchContainer}
      onPress={() =>
        navigation.navigate('MatchDetails', { matchId: item.match_id })
      }
    >
      <Text>Match ID: {item.match_id}</Text>
      <Text>
        KDA: {item.kills}/{item.deaths}/{item.assists}
      </Text>
    </TouchableOpacity>
  );

  const renderHero = ({ item }: { item: PlayerHero }) => {
    const heroData = allHeroes.find(h => h.id.toString() === item.hero_id);
    if (!heroData) return null;
    return (
      <TouchableOpacity
        style={styles.heroContainer}
        onPress={() =>
          navigation.navigate('HeroDetails', { hero: heroData })
        }
      >
        <Image
          source={{ uri: getSteamImageUrl(heroData.img) }}
          style={styles.heroImage}
        />
        <Text style={styles.heroName}>{heroData.localized_name}</Text>
        <Text>Win Rate: {((item.win / item.games) * 100).toFixed(2)}%</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: player.profile?.avatarfull }}
            style={styles.avatar}
          />
          <Text style={styles.playerName}>{player.profile?.personaname}</Text>
          <Text>Solo MMR: {player.solo_competitive_rank}</Text>
          <Text>Party MMR: {player.competitive_rank}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={item => item.match_id.toString()}
            horizontal
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Played Heroes</Text>
          <FlatList
            data={heroes}
            renderItem={renderHero}
            keyExtractor={item => item.hero_id}
            horizontal
          />
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
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchContainer: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginRight: 10,
    width: 150,
  },
  heroContainer: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  heroImage: {
    width: 80,
    height: 45, // 16:9 aspect ratio
    borderRadius: 8,
    marginBottom: 5,
  },
  heroName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PlayerDetailsScreen;
