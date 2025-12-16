import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import { getTeamById, getTeamPlayers } from '../api/openDota';
import { Team, Player } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamDetails'>;

const TeamDetailsScreen = ({ route }: Props) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamResponse, playersResponse] = await Promise.all([
          getTeamById(teamId),
          getTeamPlayers(teamId),
        ]);
        setTeam(teamResponse.data);
        setPlayers(playersResponse.data.filter((p: Player) => p.is_current_team_member));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  const renderPlayer = ({ item }: { item: Player }) => (
    <View style={styles.playerContainer}>
      <Image source={{ uri: item.avatarfull }} style={styles.playerAvatar} />
      <Text style={styles.playerName}>{item.name}</Text>
    </View>
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

  if (!team) {
    return (
      <View style={styles.centered}>
        <Text>No team data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: team.logo_url }} style={styles.teamLogo} />
      <Text style={styles.title}>{team.name}</Text>
      <Text>Rating: {team.rating}</Text>
      <Text>Wins: {team.wins}</Text>
      <Text>Losses: {team.losses}</Text>
      <Text style={styles.playersTitle}>Current Players</Text>
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={item => item.account_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  playersTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
});

export default TeamDetailsScreen;
