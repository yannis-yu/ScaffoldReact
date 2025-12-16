import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TrackProps {
  waveformData: number[];
}

const Track: React.FC<TrackProps> = ({ waveformData }) => {
  return (
    <View style={styles.track}>
      {waveformData.map((amplitude, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            { height: `${amplitude * 100}%` },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 100,
    backgroundColor: '#555',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#a00',
    marginRight: 1,
  },
});

export default Track;
