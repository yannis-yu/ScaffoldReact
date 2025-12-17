import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../App';

export default function SettingsScreen() {
  const { tmdbApiKey, saveSettings, apiId, apiHash, logout } = useAppContext();
  const [key, setKey] = useState(tmdbApiKey || '');

  const handleSave = () => {
    saveSettings(null, null, key);
    alert('Settings saved');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>TMDB API Key</Text>
      <TextInput
        style={styles.input}
        value={key}
        onChangeText={setKey}
        placeholder="Enter TMDB API Key"
      />

      <Button title="Save" onPress={handleSave} />

      <View style={styles.info}>
          <Text>Current API ID: {apiId}</Text>
          <Text>Current API Hash: {apiHash ? '********' : 'Not Set'}</Text>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  info: {
      marginTop: 30,
      padding: 10,
      backgroundColor: '#f9f9f9',
      marginBottom: 30
  },
  logoutBtn: {
      backgroundColor: '#ffeeee',
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'red'
  },
  logoutText: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: 16
  }
});
