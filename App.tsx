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

  const handlePlay = async () => {
    // Simplified for debugging
  };

  const handlePause = async () => {
    // Simplified for debugging
  };

  const handleRecord = () => {
    // Simplified for debugging
  };

  const handleLoadFile = async () => {
    // Simplified for debugging
  };

  const handleSelectionChange = (newSelection: { start: number | null; end: number | null }) => {
    setSelection(newSelection);
  };

  const handleTrim = () => {
    // Simplified for debugging
  };

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
