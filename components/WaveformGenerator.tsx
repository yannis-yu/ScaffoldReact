import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface WaveformGeneratorProps {
  audioURI: string;
  onWaveformData: (data: number[]) => void;
}

const WaveformGenerator: React.FC<WaveformGeneratorProps> = ({ audioURI, onWaveformData }) => {
  const injectedJavaScript = `
    const getBuffer = async (url) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const rawData = audioBuffer.getChannelData(0);
      const samples = 100;
      const blockSize = Math.floor(rawData.length / samples);
      let filterData = [];
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum = sum + Math.abs(rawData[blockStart + j]);
        }
        filterData.push(sum / blockSize);
      }
      window.ReactNativeWebView.postMessage(JSON.stringify(filterData));
    };
    getBuffer("${audioURI}");
  `;

  return (
    <View style={{ height: 0, width: 0 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: '<script>' + injectedJavaScript + '</script>' }}
        onMessage={(event) => {
          onWaveformData(JSON.parse(event.nativeEvent.data));
        }}
      />
    </View>
  );
};

export default WaveformGenerator;
