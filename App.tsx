import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import Header from './components/Header/Header';
import Timeline from './components/Timeline/Timeline';
import Controls from './components/Controls/Controls';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setIsRecording(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleRecord = () => {
    setIsRecording(true);
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.mainContent}>
        <Timeline />
      </View>
      <Controls
        isPlaying={isPlaying}
        isPaused={isPaused}
        isRecording={isRecording}
        onPlay={handlePlay}
        onPause={handlePause}
        onRecord={handleRecord}
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
