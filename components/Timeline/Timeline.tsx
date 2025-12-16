import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Track from './Track';

interface TimelineProps {
  waveformData: number[];
  onSelectionChange: (selection: { start: number | null; end: number | null }) => void;
}

const Timeline: React.FC<TimelineProps> = ({ waveformData, onSelectionChange }) => {
  return (
    <ScrollView style={styles.timeline} horizontal>
      <Track waveformData={waveformData} onSelectionChange={onSelectionChange} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  timeline: {
    padding: 10,
  },
});

export default Timeline;
