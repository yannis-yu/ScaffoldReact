import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Track from './Track';

const Timeline = () => {
  return (
    <ScrollView style={styles.timeline}>
      <Track />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  timeline: {
    padding: 10,
  },
});

export default Timeline;
