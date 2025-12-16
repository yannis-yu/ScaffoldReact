import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, SectionList } from 'react-native';
import { getTournaments } from '../api/openDota';
import { Tournament } from '../types/dota';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TournamentList'>;

const TournamentListScreen = ({ navigation }: Props) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await getTournaments();
        setTournaments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const groupAndSortTournaments = () => {
    const grouped = tournaments.reduce((acc, tournament) => {
      const { tier } = tournament;
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier].push(tournament);
      return acc;
    }, {} as { [key: string]: Tournament[] });

    return Object.keys(grouped)
      .map(tier => ({
        title: tier,
        data: grouped[tier].sort((a, b) => b.start_timestamp - a.start_timestamp),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
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
      <SectionList
        sections={groupAndSortTournaments()}
        keyExtractor={item => item.leagueid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`tournament-item-${item.leagueid}`}
            onPress={() => navigation.navigate('TournamentDetails', { tournament: item })}
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
});

export default TournamentListScreen;
