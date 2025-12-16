import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getTournamentTeams } from '../api/openDota';
import { Team } from '../types/dota';

type Props = NativeStackScreenProps<RootStackParamList, 'TournamentDetails'>;

const TournamentDetailsScreen = ({ route, navigation }: Props) => {
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
    <TouchableOpacity
      style={styles.teamContainer}
      onPress={() =>
        navigation.navigate('TeamDetails', { teamId: item.team_id })
      }
    >
      <Image source={{ uri: item.logo_url }} style={styles.teamLogo} />
      <Text style={styles.teamName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text>Tier: {tournament.tier}</Text>
      </View>

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
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  teamName: {
    fontSize: 16,
  },
});

export default TournamentDetailsScreen;
