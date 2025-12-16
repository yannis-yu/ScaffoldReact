import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import MixerTrack from './components/MixerTrack';

const audioFiles = [
  require('./assets/audio/sample1.mp3'),
  require('./assets/audio/sample2.mp3'),
  require('./assets/audio/sample3.wav'),
  require('./assets/audio/sample4.ogg'),
];

export default function App() {
  const [volumes, setVolumes] = useState([0.5, 0.5, 0.5, 0.5]);
  const [sounds, setSounds] = useState<Audio.Sound[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSounds = async () => {
      const soundObjects = await Promise.all(
        audioFiles.map(async (file) => {
          const { sound } = await Audio.Sound.createAsync(file, {
            isLooping: true,
          });
          return sound;
        })
      );
      setSounds(soundObjects);
    };

    loadSounds();

    return () => {
      sounds.forEach((sound) => sound.unloadAsync());
    };
  }, []);

  const handleVolumeChange = (index: number, value: number) => {
    const newVolumes = [...volumes];
    newVolumes[index] = value;
    setVolumes(newVolumes);
    if (sounds[index]) {
      sounds[index].setVolumeAsync(value);
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      await Promise.all(sounds.map((sound) => sound.pauseAsync()));
    } else {
      await Promise.all(sounds.map((sound) => sound.playAsync()));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mixing Console</Text>
      <View style={styles.mixer}>
        {sounds.map((_, index) => (
          <MixerTrack
            key={index}
            label={`Track ${index + 1}`}
            volume={volumes[index]}
            onVolumeChange={(value) => handleVolumeChange(index, value)}
          />
        ))}
      </View>
      <Button
        title={isPlaying ? 'Pause' : 'Play'}
        onPress={togglePlayback}
        color="#841584"
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  mixer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
});
