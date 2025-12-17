import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { getLshk } from 'cantonese-romanisation';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [jyutping, setJyutping] = useState('');

  const convertToJyutping = () => {
    if (inputText) {
      const result = getLshk(inputText);
      const formattedResult = result.map(pinyins => pinyins[0] || '').join(' ');
      setJyutping(formattedResult);
    } else {
      setJyutping('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>粤拼词典</Text>
      <TextInput
        style={styles.input}
        placeholder="输入汉字..."
        onChangeText={setInputText}
        value={inputText}
      />
      <Button title="查询" onPress={convertToJyutping} />
      <Text style={styles.result}>{jyutping}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
});
