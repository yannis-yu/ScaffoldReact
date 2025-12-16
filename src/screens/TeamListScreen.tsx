import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, SectionList } from 'react-native';
import { getTeams } from '../api/openDota';
import { Team } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamList'>;

const TeamListScreen = ({ navigation }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        setTeams(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const getTier = (rating: number) => {
    if (rating >= 1400) return 'Elite';
    if (rating >= 1200) return 'Professional';
    return 'Semi-Professional';
  };

  const groupAndSortTeams = () => {
    const grouped = teams.reduce((acc, team) => {
      const tier = getTier(team.rating);
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier].push(team);
      return acc;
    }, {} as { [key: string]: Team[] });

    return Object.keys(grouped)
      .map(tier => ({
        title: tier,
        data: grouped[tier].sort((a, b) => b.rating - a.rating),
      }))
      .sort((a, b) => {
        const order = ['Elite', 'Professional', 'Semi-Professional'];
        return order.indexOf(a.title) - order.indexOf(b.title);
      });
  };

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
      <TouchableOpacity onPress={() => navigation.navigate('TournamentList')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>View Tournaments</Text>
        </View>
      </TouchableOpacity>
      <SectionList
        sections={groupAndSortTeams()}
        keyExtractor={item => item.team_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`team-item-${item.team_id}`}
            onPress={() => navigation.navigate('TeamDetails', { teamId: item.team_id })}
          >
            <View style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
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
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default TeamListScreen;
