import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Button, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useAppContext } from '../App';
import { TelegramFile } from '../utils/TelegramFile';
// @ts-ignore
import VideoStream from 'videostream';

export default function PlayerScreen({ route, navigation }) {
  const { chatId, messageId, filename } = route.params;
  const { client } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [useNativeVideo, setUseNativeVideo] = useState(false);

  // Ref for HTML video element (Web only)
  const videoRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
        startStreaming();
    } else {
        // Fallback for native (not implemented fully for streaming yet)
        setError('Streaming is currently only supported on Web.');
        setLoading(false);
    }

    return () => {
        // Cleanup
    };
  }, []);

  const startStreaming = async () => {
    try {
      setStatus('Fetching metadata...');
      const messages = await client.getMessages(chatId, { ids: [parseInt(messageId)] });
      if (!messages || messages.length === 0) {
          throw new Error('Message not found');
      }
      const message = messages[0];
      if (!message.media || !message.media.document) {
          throw new Error('No media document found');
      }

      setLoading(false);
      setUseNativeVideo(true);

      // We need to wait for the video element to render
      setTimeout(() => {
          if (videoRef.current) {
              try {
                  const file = new TelegramFile(client, message);
                  const stream = new VideoStream(file, videoRef.current);
                  console.log('VideoStream initialized', stream);
              } catch (e) {
                  console.error('VideoStream error', e);
                  setError('Failed to initialize video stream: ' + e.message);
              }
          }
      }, 500);

    } catch (e) {
      console.error('Error starting stream', e);
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

  // Web Implementation using HTML5 Video tag + videostream
  if (Platform.OS === 'web' && useNativeVideo) {
      return (
          <View style={styles.container}>
              <video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%', outline: 'none' }}
                  controls
                  autoPlay
              />
              <Button title="Close" onPress={() => navigation.goBack()} />
          </View>
      );
  }

  // Native Implementation (Fallback or future)
  return (
    <View style={styles.container}>
      <Text style={styles.error}>Native player not ready</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
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
  status: {
      color: '#fff',
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center'
  },
  error: {
      color: 'red',
      marginBottom: 20,
      textAlign: 'center'
  }
});
