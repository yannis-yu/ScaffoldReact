import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import Header from './components/Header/Header';
import Timeline from './components/Timeline/Timeline';
import Controls from './components/Controls/Controls';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const handlePlay = async () => {
    if (sound) {
      try {
        await sound.playAsync();
        setIsPlaying(true);
        setIsPaused(false);
        setIsRecording(false);
      } catch (error) {
        Alert.alert('Error', 'Could not play audio.');
      }
    }
  };

  const handlePause = async () => {
    if (sound) {
      try {
        await sound.pauseAsync();
        setIsPaused(true);
        setIsPlaying(false);
      } catch (error) {
        Alert.alert('Error', 'Could not pause audio.');
      }
    }
  };

  const handleRecord = () => {
    // This will be implemented in a future step.
    setIsRecording(true);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const generateRandomWaveform = () => {
    // Simulate waveform data for now.
    const data = Array.from({ length: 100 }, () => Math.random());
    setWaveformData(data);
  };

  const handleLoadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        generateRandomWaveform();
        Alert.alert('Success', 'Audio file loaded successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load audio file.');
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.mainContent}>
        <Timeline waveformData={waveformData} />
      </View>
      <Controls
        isPlaying={isPlaying}
        isPaused={isPaused}
        isRecording={isRecording}
        onPlay={handlePlay}
        onPause={handlePause}
        onRecord={handleRecord}
        onLoadFile={handleLoadFile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
  },
});
