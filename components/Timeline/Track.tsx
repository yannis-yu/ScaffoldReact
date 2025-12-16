import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';

interface TrackProps {
  waveformData: number[];
  onSelectionChange: (selection: { start: number | null; end: number | null }) => void;
}

const Track: React.FC<TrackProps> = ({ waveformData, onSelectionChange }) => {
  const [selection, setSelection] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });

  const barWidth = 3; // Corresponds to width + marginRight of waveformBar

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const start = Math.floor(evt.nativeEvent.locationX / barWidth);
      const newSelection = { start, end: start };
      setSelection(newSelection);
      onSelectionChange(newSelection);
    },
    onPanResponderMove: (evt) => {
      const end = Math.floor(evt.nativeEvent.locationX / barWidth);
      setSelection((prev) => {
        const newSelection = { ...prev, end };
        onSelectionChange(newSelection);
        return newSelection;
      });
    },
    onPanResponderRelease: () => {
      // Final selection is already passed in onPanResponderMove
    },
  });

  const renderSelection = () => {
    if (selection.start === null || selection.end === null) {
      return null;
    }

    const left = Math.min(selection.start, selection.end) * barWidth;
    const width = Math.abs(selection.start - selection.end) * barWidth;

    return <View style={[styles.selection, { left, width }]} />;
  };

  return (
    <View style={styles.trackContainer} {...panResponder.panHandlers}>
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
        {renderSelection()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    height: 100,
  },
  track: {
    height: 100,
    backgroundColor: '#555',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#a00',
    marginRight: 1,
  },
  selection: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(0, 100, 255, 0.4)',
  },
});

export default Track;
