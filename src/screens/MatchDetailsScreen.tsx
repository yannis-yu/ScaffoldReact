import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { getMatchById } from '../api/openDota';
import { Match, MatchPlayer } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchDetails'>;

const MatchDetailsScreen = ({ route, navigation }: Props) => {
  const { matchId } = route.params;
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await getMatchById(matchId);
        setMatch(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.centered}>
        <Text>{error ? `Error: ${error}` : 'Match not found.'}</Text>
      </View>
    );
  }

  const renderPlayer = ({ item }: { item: MatchPlayer }) => (
    <TouchableOpacity
      style={styles.playerRow}
      onPress={() =>
        item.account_id &&
        navigation.navigate('PlayerDetails', { accountId: item.account_id })
      }
    >
      <Text style={styles.playerText} numberOfLines={1}>
        {item.personaname || 'Anonymous'}
      </Text>
      <Text style={styles.playerText}>
        {item.kills}/{item.deaths}/{item.assists}
      </Text>
      <Text style={styles.playerText}>{item.gold_per_min} GPM</Text>
    </TouchableOpacity>
  );

  const radiantPlayers = match.players.filter((p, i) => i < 5);
  const direPlayers = match.players.filter((p, i) => i >= 5);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Image
                source={{ uri: match.radiant_team?.logo_url }}
                style={styles.teamLogo}
              />
              <Text style={styles.score}>
                {match.radiant_score} - {match.dire_score}
              </Text>
              <Image
                source={{ uri: match.dire_team?.logo_url }}
                style={styles.teamLogo}
              />
            </View>
            <Text style={styles.winnerText}>
              {match.radiant_win ? 'Radiant Victory' : 'Dire Victory'}
            </Text>
          </>
        }
        data={[
          { title: 'Radiant Team', data: radiantPlayers },
          { title: 'Dire Team', data: direPlayers },
        ]}
        renderItem={({ item }) => (
          <View style={styles.teamSection}>
            <Text style={styles.teamTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              renderItem={renderPlayer}
              keyExtractor={(player, index) => player.account_id?.toString() ?? index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
        keyExtractor={item => item.title}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  teamLogo: {
    width: 60,
    height: 60,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  winnerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#444',
    color: '#fff',
  },
  teamSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  teamTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerText: {
    fontSize: 16,
    width: '33%',
    textAlign: 'center',
  },
});

export default MatchDetailsScreen;
