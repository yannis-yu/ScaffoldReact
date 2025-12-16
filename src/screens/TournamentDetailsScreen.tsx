import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getTournamentTeams } from '../api/openDota';
import { Team } from '../types/dota';

type Props = NativeStackScreenProps<RootStackParamList, 'TournamentDetails'>;

const TournamentDetailsScreen = ({ route }: Props) => {
  const { tournament } = route.params;
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTournamentTeams(tournament.leagueid);
        setTeams(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [tournament.leagueid]);

  const renderTeam = ({ item }: { item: Team }) => (
    <View style={styles.teamContainer}>
      <Image source={{ uri: item.logo_url }} style={styles.teamLogo} />
      <Text style={styles.teamName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tournament.name}</Text>
      <Text>Tier: {tournament.tier}</Text>
      <Text style={styles.teamsTitle}>Participating Teams</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={teams}
          renderItem={renderTeam}
          keyExtractor={item => item.team_id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  teamsTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  teamName: {
    fontSize: 18,
  },
});

export default TournamentDetailsScreen;
