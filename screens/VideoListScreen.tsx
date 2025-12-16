import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button, Modal, TextInput, Image } from 'react-native';
import { useAppContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VideoListScreen({ route, navigation }) {
  const { chatId, title } = route.params;
  const { client, tmdbApiKey } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offsetId, setOffsetId] = useState(0);

  // Search Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (offset = 0) => {
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      // Fetch history with filter for input messages, specifically looking for media
      // GramJS iterMessages is easier to use
      const result = await client.getMessages(chatId, {
        limit: 20,
        offsetId: offset,
        // filter: Api.InputMessagesFilterVideo // This might filter specifically for video messages
        // If filter is not strictly working as expected in all GramJS versions, we can filter manually
      });

      const videos = result.filter(msg => msg.media && (msg.media.document || msg.media.video));

      // Further filter to ensure it's a video (mime type check or attribute check)
      const validVideos = videos.filter(msg => {
          if (msg.media.document) {
              const mime = msg.media.document.mimeType;
              return mime && mime.startsWith('video/');
          }
          return true; // if it is Api.MessageMediaVideo
      });

      if (offset === 0) {
        setMessages(validVideos);
      } else {
        setMessages(prev => [...prev, ...validVideos]);
      }

      if (result.length > 0) {
          setOffsetId(result[result.length - 1].id);
      }

    } catch (e) {
      console.error('Error fetching messages', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
      if (!loadingMore) {
          fetchMessages(offsetId);
      }
  };

  const getFilename = (msg) => {
      if (msg.media && msg.media.document) {
          const attr = msg.media.document.attributes.find(a => a.fileName);
          if (attr) return attr.fileName;
      }
      return 'Unknown Filename';
  };

  const searchTMDB = async (query) => {
      if (!tmdbApiKey) {
          alert('Please set TMDB API Key in Settings first.');
          return;
      }
      setSearching(true);
      try {
          const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`;
          const res = await fetch(url);
          const data = await res.json();
          setSearchResults(data.results || []);
      } catch (e) {
          console.error('TMDB Search Error', e);
          alert('Error searching TMDB');
      } finally {
          setSearching(false);
      }
  };

  const onVideoPress = (msg) => {
      // First try to auto-match
      const filename = getFilename(msg);
      const text = msg.message || '';
      // Simple heuristic: try filename first, clean extension
      let query = filename.replace(/\.[^/.]+$/, "");
      if (!query || query === 'Unknown Filename') {
          query = text;
      }

      setSearchQuery(query);
      setSelectedMessage(msg);
      setSearchResults([]);
      setModalVisible(true);
      if (query && query.length > 2) {
           searchTMDB(query);
      }
  };

  const addToLibrary = async (tmdbItem) => {
      if (!selectedMessage) return;

      const newItem = {
          id: selectedMessage.id.toString() + '_' + chatId.toString(), // Unique ID
          tmdbId: tmdbItem.id,
          title: tmdbItem.title || tmdbItem.name, // Movie title or TV show name
          overview: tmdbItem.overview,
          posterPath: tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : null,
          videoFilename: getFilename(selectedMessage),
          chatId: chatId.toString(),
          messageId: selectedMessage.id,
          addedAt: Date.now()
      };

      try {
          // Get existing library
          const existing = await AsyncStorage.getItem('library');
          let library = existing ? JSON.parse(existing) : [];

          // Check for duplicates
          if (library.find(i => i.id === newItem.id)) {
              alert('Video already in library');
          } else {
              library.push(newItem);
              await AsyncStorage.setItem('library', JSON.stringify(library));
              alert('Added to library!');
          }
          setModalVisible(false);
      } catch (e) {
          console.error('Error saving to library', e);
          alert('Failed to save to library');
      }
  };

  const renderItem = ({ item }) => {
      const filename = getFilename(item);
      const text = item.message;

      return (
        <TouchableOpacity style={styles.item} onPress={() => onVideoPress(item)}>
           <Text style={styles.filename} numberOfLines={1}>{filename}</Text>
           {text ? <Text style={styles.messageText} numberOfLines={2}>{text}</Text> : null}
        </TouchableOpacity>
      );
  };

  const renderSearchResult = ({ item }) => {
      const title = item.title || item.name;
      const year = (item.release_date || item.first_air_date || '').split('-')[0];
      const uri = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null;

      return (
          <TouchableOpacity style={styles.searchItem} onPress={() => addToLibrary(item)}>
              {uri && <Image source={{ uri }} style={styles.poster} />}
              <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.searchTitle}>{title} ({year})</Text>
                  <Text numberOfLines={2} style={styles.overview}>{item.overview}</Text>
              </View>
              <Button title="Add" onPress={() => addToLibrary(item)} />
          </TouchableOpacity>
      )
  };

  return (
    <View style={styles.container}>
        <Text style={styles.headerTitle}>Videos in {title}</Text>
        {loading ? (
            <ActivityIndicator size="large" />
        ) : (
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
            />
        )}

        {/* Modal for TMDB Match */}
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Find Match in TMDB</Text>
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>

                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Enter keywords..."
                    />
                    <Button title="Search" onPress={() => searchTMDB(searchQuery)} />
                </View>

                {searching ? (
                    <ActivityIndicator size="large" style={{marginTop: 20}} />
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderSearchResult}
                        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No results found.</Text>}
                    />
                )}
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
      padding: 15,
      fontSize: 20,
      fontWeight: 'bold',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc'
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filename: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
      color: '#333'
  },
  messageText: {
      fontSize: 14,
      color: '#666'
  },
  modalContainer: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: '#f5f5f5'
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold'
  },
  searchBox: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      marginBottom: 10
  },
  input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      backgroundColor: '#fff'
  },
  searchItem: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#fff',
      marginBottom: 10,
      marginHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center'
  },
  poster: {
      width: 50,
      height: 75,
      borderRadius: 3
  },
  searchTitle: {
      fontWeight: 'bold',
      fontSize: 16
  },
  overview: {
      fontSize: 12,
      color: 'gray'
  }
});
