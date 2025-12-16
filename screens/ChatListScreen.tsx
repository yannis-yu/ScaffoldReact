import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppContext } from '../App';
import { Api } from 'telegram';

export default function ChatListScreen({ navigation }) {
  const { client } = useAppContext();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      // Get dialogs (chats)
      const dialogs = await client.getDialogs({
          limit: 100
      });
      // Filter for groups and channels
      const filtered = dialogs.filter(d => d.isChannel || d.isGroup);
      setChats(filtered);
    } catch (e) {
      console.error('Error fetching chats', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('VideoList', { chatId: item.id, title: item.title || 'Chat' })}
      >
        <Text style={styles.chatTitle}>{item.title || 'Unknown'}</Text>
        <Text style={styles.subtitle}>{item.isChannel ? 'Channel' : 'Group'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No joined channels or groups found.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'gray',
    fontSize: 14,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: 'gray',
  }
});
