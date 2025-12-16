import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function LibraryScreen({ navigation }) {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchLibrary();
    }, [])
  );

  const fetchLibrary = async () => {
    try {
      const stored = await AsyncStorage.getItem('library');
      if (stored) {
        setLibrary(JSON.parse(stored));
      } else {
        setLibrary([]);
      }
    } catch (e) {
      console.error('Error loading library', e);
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = async (id) => {
      try {
          const newLibrary = library.filter(item => item.id !== id);
          setLibrary(newLibrary);
          await AsyncStorage.setItem('library', JSON.stringify(newLibrary));
      } catch (e) {
          console.error('Error removing item', e);
      }
  };

  const renderItem = ({ item }) => {
    // Check if TV info exists
    const isTv = item.mediaType === 'tv' || (item.season && item.episode);

    return (
      <View style={styles.item}>
          {item.posterPath ? (
              <Image source={{ uri: item.posterPath }} style={styles.poster} />
          ) : (
              <View style={[styles.poster, {backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'}]}>
                  <Text>No Image</Text>
              </View>
          )}
          <View style={styles.info}>
              <Text style={styles.title}>
                  {item.title}
                  {isTv && item.season && item.episode ? ` - S${item.season}E${item.episode}` : ''}
              </Text>
              <Text style={styles.filename} numberOfLines={1}>File: {item.videoFilename}</Text>
              <Text style={styles.chat} numberOfLines={1}>Chat ID: {item.chatId}</Text>
              <TouchableOpacity onPress={() => removeFromLibrary(item.id)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
          </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
        <FlatList
            data={library}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchLibrary} />}
            ListEmptyComponent={<Text style={styles.empty}>Library is empty. Go to chats and add videos.</Text>}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  poster: {
      width: 80,
      height: 120,
      borderRadius: 5,
      marginRight: 15
  },
  info: {
      flex: 1,
      justifyContent: 'center'
  },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5
  },
  filename: {
      color: 'gray',
      fontSize: 12,
      marginBottom: 3
  },
  chat: {
      color: 'gray',
      fontSize: 12,
      marginBottom: 10
  },
  removeBtn: {
      backgroundColor: '#ffdddd',
      padding: 5,
      alignSelf: 'flex-start',
      borderRadius: 5
  },
  removeText: {
      color: 'red',
      fontSize: 12
  },
  empty: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: 'gray'
  }
});
