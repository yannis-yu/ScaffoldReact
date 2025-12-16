import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button, Modal, TextInput, Image, Alert, ScrollView } from 'react-native';
import { useAppContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { extractMetadata } from '../utils/metadata';

export default function VideoListScreen({ route, navigation }) {
  const { chatId, title } = route.params;
  const { client, tmdbApiKey, saveSettings } = useAppContext();
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

  // TV Show S/E Selection
  const [selectedTmdbItem, setSelectedTmdbItem] = useState(null); // The TV show selected
  const [inputSeason, setInputSeason] = useState('');
  const [inputEpisode, setInputEpisode] = useState('');

  // Missing API Key State
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (offset = 0) => {
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const result = await client.getMessages(chatId, {
        limit: 20,
        offsetId: offset,
      });

      const videos = result.filter(msg => msg.media && (msg.media.document || msg.media.video));

      const validVideos = videos.filter(msg => {
          if (msg.media.document) {
              const mime = msg.media.document.mimeType;
              return mime && mime.startsWith('video/');
          }
          return true;
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

  const saveApiKey = async () => {
      if (!inputApiKey) return;
      await saveSettings(null, null, inputApiKey);
      setShowApiKeyInput(false);
      if (searchQuery) {
          searchTMDB(searchQuery, inputApiKey);
      }
  };

  const searchTMDB = async (query, explicitKey = null) => {
      const apiKey = explicitKey || tmdbApiKey;

      if (!apiKey) {
          setShowApiKeyInput(true);
          return;
      }
      setSearching(true);
      try {
          const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
          const res = await fetch(url);
          const data = await res.json();
          setSearchResults(data.results || []);
      } catch (e) {
          console.error('TMDB Search Error', e);
          Alert.alert('Error', 'Error searching TMDB');
      } finally {
          setSearching(false);
      }
  };

  const onVideoPress = (msg) => {
      const filename = getFilename(msg);
      const text = msg.message || '';

      const { title: cleanTitle, season, episode } = extractMetadata(filename, text);

      let query = cleanTitle;
      if (!query || query === 'Unknown Filename') {
          query = text;
      }

      setSearchQuery(query);
      setSelectedMessage(msg);
      // Pre-fill S/E just in case user picks a TV show later
      setInputSeason(season || '');
      setInputEpisode(episode || '');

      setSearchResults([]);
      setSelectedTmdbItem(null); // Reset selection
      setModalVisible(true);

      if (query && query.length > 2) {
           searchTMDB(query);
      } else if (!tmdbApiKey) {
           setShowApiKeyInput(true);
      }
  };

  const handleTmdbSelect = (item) => {
      if (item.media_type === 'tv' || item.name) { // TV show
          setSelectedTmdbItem(item);
          // Don't add yet, let user confirm S/E
      } else {
          // Movie, add directly
          addToLibrary(item);
      }
  };

  const confirmTvShowAdd = () => {
      if (selectedTmdbItem) {
          addToLibrary(selectedTmdbItem, inputSeason, inputEpisode);
      }
  };

  const addToLibrary = async (tmdbItem, season = null, episode = null) => {
      if (!selectedMessage) return;

      const newItem = {
          id: selectedMessage.id.toString() + '_' + chatId.toString(),
          tmdbId: tmdbItem.id,
          title: tmdbItem.title || tmdbItem.name,
          mediaType: tmdbItem.media_type || (tmdbItem.name ? 'tv' : 'movie'),
          season: season,
          episode: episode,
          overview: tmdbItem.overview,
          posterPath: tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : null,
          videoFilename: getFilename(selectedMessage),
          chatId: chatId.toString(),
          messageId: selectedMessage.id,
          addedAt: Date.now()
      };

      try {
          const existing = await AsyncStorage.getItem('library');
          let library = existing ? JSON.parse(existing) : [];

          // Remove potential duplicate if re-adding logic
          // library = library.filter(i => i.id !== newItem.id);

          if (library.find(i => i.id === newItem.id)) {
              Alert.alert('Info', 'Video updated in library');
              library = library.map(i => i.id === newItem.id ? newItem : i);
          } else {
              library.push(newItem);
              Alert.alert('Success', 'Added to library!');
          }
          await AsyncStorage.setItem('library', JSON.stringify(library));
          setModalVisible(false);
          setSelectedTmdbItem(null);
      } catch (e) {
          console.error('Error saving to library', e);
          Alert.alert('Error', 'Failed to save to library');
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
      const isTv = item.media_type === 'tv' || !!item.name;
      const uri = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null;

      return (
          <TouchableOpacity style={styles.searchItem} onPress={() => handleTmdbSelect(item)}>
              {uri && <Image source={{ uri }} style={styles.poster} />}
              <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.searchTitle}>{title} ({year}) {isTv ? '[TV]' : ''}</Text>
                  <Text numberOfLines={2} style={styles.overview}>{item.overview}</Text>
              </View>
              <Button title="Select" onPress={() => handleTmdbSelect(item)} />
          </TouchableOpacity>
      )
  };

  return (
    <View style={styles.container}>
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

                {showApiKeyInput ? (
                    <View style={styles.apiKeyContainer}>
                        <Text style={styles.instruction}>TMDB API Key is required to search.</Text>
                        <TextInput
                            style={styles.input}
                            value={inputApiKey}
                            onChangeText={setInputApiKey}
                            placeholder="Enter TMDB API Key"
                            autoCapitalize="none"
                        />
                        <Button title="Save & Search" onPress={saveApiKey} />
                    </View>
                ) : selectedTmdbItem ? (
                    // TV Show Confirmation View
                    <View style={styles.selectionContainer}>
                        <Text style={styles.selectionTitle}>Selected: {selectedTmdbItem.name}</Text>
                        <Text style={styles.instruction}>Please confirm Season and Episode:</Text>

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text>Season</Text>
                                <TextInput
                                    style={styles.input}
                                    value={inputSeason}
                                    onChangeText={setInputSeason}
                                    keyboardType="numeric"
                                    placeholder="e.g. 1"
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Text>Episode</Text>
                                <TextInput
                                    style={styles.input}
                                    value={inputEpisode}
                                    onChangeText={setInputEpisode}
                                    keyboardType="numeric"
                                    placeholder="e.g. 1"
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Button title="Back to Results" onPress={() => setSelectedTmdbItem(null)} color="gray" />
                            <View style={{width: 20}}/>
                            <Button title="Confirm & Add" onPress={confirmTvShowAdd} />
                        </View>
                    </View>
                ) : (
                    // Search View
                    <>
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
                    </>
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
  apiKeyContainer: {
      padding: 20,
      alignItems: 'center'
  },
  instruction: {
      marginBottom: 10,
      fontSize: 16,
      textAlign: 'center',
      color: '#333'
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
  },
  selectionContainer: {
      padding: 20,
      alignItems: 'center'
  },
  selectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20
  },
  halfInput: {
      width: 100,
      marginHorizontal: 10
  }
});
