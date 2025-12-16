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
  const [selection, setSelection] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'Sorry, we need microphone permissions to make this work!');
      }
    })();
  }, []);

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

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      generateRandomWaveform();
    }
  }

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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

  const handleSelectionChange = (newSelection: { start: number | null; end: number | null }) => {
    setSelection(newSelection);
  };

  const handleTrim = () => {
    if (selection.start !== null && selection.end !== null) {
      const start = Math.min(selection.start, selection.end);
      const end = Math.max(selection.start, selection.end);
      const newWaveformData = waveformData.slice(start, end);
      setWaveformData(newWaveformData);
      setSelection({ start: null, end: null });
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
        <Timeline waveformData={waveformData} onSelectionChange={handleSelectionChange} />
      </View>
      <Controls
        isPlaying={isPlaying}
        isPaused={isPaused}
        isRecording={isRecording}
        onPlay={handlePlay}
        onPause={handlePause}
        onRecord={handleRecord}
        onLoadFile={handleLoadFile}
        onTrim={handleTrim}
        selectionActive={selection.start !== null && selection.end !== null}
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
