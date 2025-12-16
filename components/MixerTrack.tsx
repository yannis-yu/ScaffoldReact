import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface MixerTrackProps {
  label: string;
  volume: number;
  onVolumeChange: (value: number) => void;
}

const MixerTrack: React.FC<MixerTrackProps> = ({ label, volume, onVolumeChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={volume}
          onValueChange={onVolumeChange}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          thumbTintColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  sliderContainer: {
    height: 200,
    width: 50,
    transform: [{ rotate: '-90deg' }],
    justifyContent: 'center',
  },
  slider: {
    width: 200,
    height: 50,
  },
});

export default MixerTrack;
