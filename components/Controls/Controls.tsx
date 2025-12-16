import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRecord: () => void;
  onLoadFile: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, isPaused, isRecording, onPlay, onPause, onRecord, onLoadFile }) => {
  return (
    <View style={styles.controls}>
      <TouchableOpacity style={styles.button} onPress={onLoadFile}>
        <Text style={styles.buttonText}>Load File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, isPlaying && styles.activeButton]} onPress={onPlay}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, isPaused && styles.activeButton]} onPress={onPause}>
        <Text style={styles.buttonText}>Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.recordButton, isRecording && styles.activeRecordButton]} onPress={onRecord}>
        <Text style={styles.buttonText}>Record</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
  },
  button: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 5,
    margin: 5,
  },
  recordButton: {
    backgroundColor: '#a00',
  },
  activeButton: {
    backgroundColor: '#777',
  },
  activeRecordButton: {
    backgroundColor: '#d00',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Controls;
