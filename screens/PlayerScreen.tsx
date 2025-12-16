import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Button, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useAppContext } from '../App';
import { Api } from 'telegram';

export default function PlayerScreen({ route, navigation }) {
  const { chatId, messageId, filename } = route.params;
  const { client } = useAppContext();

  const [videoSource, setVideoSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    loadVideo();
    return () => {
        // Cleanup if needed (revoke object URL)
        if (videoSource && videoSource.uri && Platform.OS === 'web') {
            URL.revokeObjectURL(videoSource.uri);
        }
    };
  }, []);

  const loadVideo = async () => {
    try {
      setStatus('Fetching message...');
      // Fetch the message to get the media object
      // We need to ensure we have the correct input entity for the chat
      // If chatId is coming from library, it might be a string. GramJS handles it if we have the dialog cached or if it's an ID.
      // Better to use getMessages with the ID.

      const messages = await client.getMessages(chatId, { ids: [parseInt(messageId)] });
      if (!messages || messages.length === 0) {
          throw new Error('Message not found or accessible');
      }
      const message = messages[0];

      if (!message.media) {
          throw new Error('No media in this message');
      }

      setStatus('Downloading media... (This may take a while)');

      // Download media to buffer
      // For large files on web, this loads into memory.
      // Progress callback is available in downloadMedia
      const buffer = await client.downloadMedia(message, {
          progressCallback: (downloaded, total) => {
              const percent = Math.round((downloaded / total) * 100);
              setStatus(`Downloading: ${percent}%`);
          }
      });

      if (!buffer) {
          throw new Error('Download failed');
      }

      setStatus('Processing video...');

      if (Platform.OS === 'web') {
          // Convert Buffer to Blob to ObjectURL
          const blob = new Blob([buffer], { type: message.media.document?.mimeType || 'video/mp4' });
          const url = URL.createObjectURL(blob);
          setVideoSource({ uri: url });
      } else {
          // Native implementation (Android/iOS)
          // We would need to save buffer to file system using expo-file-system
          // import * as FileSystem from 'expo-file-system';
          // const uri = FileSystem.cacheDirectory + 'temp_video.mp4';
          // await FileSystem.writeAsStringAsync(uri, buffer.toString('base64'), { encoding: FileSystem.EncodingType.Base64 });
          // setVideoSource({ uri });

          // For now, since user emphasized Web working properly and I don't want to overcomplicate with fs-native right now unless requested:
          alert('Playback is currently optimized for Web. On native, large downloads to memory might crash.');
          // Attempting similar blob approach on native usually fails.
          // But let's try data URI for small files or just Error.
          setError('Native playback not fully implemented yet (requires FileSystem). Please use Web.');
          return;
      }

      setLoading(false);

    } catch (e) {
      console.error('Error loading video', e);
      setError(e.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.status}>{status}</Text>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (error) {
      return (
          <View style={styles.container}>
              <Text style={styles.error}>Error: {error}</Text>
              <Button title="Go Back" onPress={() => navigation.goBack()} />
          </View>
      )
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={videoSource}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay
        onError={(e) => console.log('Video Error:', e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  status: {
      color: '#fff',
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center'
  },
  error: {
      color: 'red',
      marginBottom: 20
  }
});
