import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { getTeamById, getTeamPlayers, getTeamMatches } from '../api/openDota';
import { Team, Player, TeamMatch } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamDetails'>;

const TeamDetailsScreen = ({ route, navigation }: Props) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamRes, playersRes, matchesRes] = await Promise.all([
          getTeamById(teamId),
          getTeamPlayers(teamId),
          getTeamMatches(teamId),
        ]);
        setTeam(teamRes.data);
        setPlayers(
          playersRes.data.filter((p: Player) => p.is_current_team_member)
        );
        setMatches(matchesRes.data.slice(0, 10)); // Last 10 matches
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity
      testID={`player-item-${item.account_id}`}
      style={styles.playerContainer}
      onPress={() =>
        navigation.navigate('PlayerDetails', { accountId: item.account_id })
      }
    >
      <Image source={{ uri: item.avatarfull }} style={styles.playerAvatar} />
      <Text style={styles.playerName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMatch = ({ item }: { item: TeamMatch }) => {
    const won =
      (item.radiant && item.radiant_win) ||
      (!item.radiant && !item.radiant_win);
    return (
      <TouchableOpacity
        testID={`match-item-${item.match_id}`}
        style={styles.matchContainer}
        onPress={() =>
          navigation.navigate('MatchDetails', { matchId: item.match_id })
        }
      >
        <Text style={{ color: won ? 'green' : 'red', fontWeight: 'bold' }}>
          {won ? 'Win' : 'Loss'}
        </Text>
        <Text>vs {item.opposing_team_name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !team) {
    return (
      <View style={styles.centered}>
        <Text>{error ? `Error: ${error}` : 'Team not found.'}</Text>
      </View>
    );
  }

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Image source={{ uri: team.logo_url }} style={styles.teamLogo} />
        <Text style={styles.title}>{team.name}</Text>
        <Text>Rating: {team.rating}</Text>
        <Text>
          Record: {team.wins} - {team.losses}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Players</Text>
        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={item => item.account_id.toString()}
          scrollEnabled={false} // Disable scrolling for this list
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Matches</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={item => item.match_id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingHorizontal: 10 }}
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
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  teamLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  playerName: {
    fontSize: 18,
  },
  matchContainer: {
    padding: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TeamDetailsScreen;
