import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Track from './Track';

interface TimelineProps {
  waveformData: number[];
}

const Timeline: React.FC<TimelineProps> = ({ waveformData }) => {
  return (
    <ScrollView style={styles.timeline}>
      <Track waveformData={waveformData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  timeline: {
    padding: 10,
  },
});

export default Timeline;
