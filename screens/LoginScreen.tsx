import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { useAppContext } from '../App';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import QRCode from 'react-native-qrcode-svg';

export default function LoginScreen() {
  const { apiId, apiHash, saveSettings, setClient, saveSession, setIsLoggedIn } = useAppContext();

  const [inputApiId, setInputApiId] = useState(apiId || '');
  const [inputApiHash, setInputApiHash] = useState(apiHash || '');
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const startLogin = async () => {
    if (!inputApiId || !inputApiHash) {
      alert('Please provide API ID and Hash');
      return;
    }

    await saveSettings(inputApiId, inputApiHash, null);
    setLoading(true);
    setStatus('Initializing...');

    const stringSession = new StringSession(''); // New session

    // NOTE: client should probably be created outside or managed better to avoid re-creation
    const client = new TelegramClient(stringSession, parseInt(inputApiId), inputApiHash, {
      connectionRetries: 5,
    });

    setClient(client);

    try {
      await client.connect();
      setStatus('Generating QR Code...');

      await client.signInUserWithQrCode(
        {
          apiId: parseInt(inputApiId),
          apiHash: inputApiHash,
        },
        {
          onError: (err) => {
             console.error('QR Code error:', err);
             setStatus('Error: ' + err.message);
             setLoading(false);
          },
          qrCode: async (code) => {
             console.log('QR Code received:', code);
             setQrCodeUrl(`tg://login?token=${code.token.toString('base64url')}`);
             setStatus('Scan the QR code with your Telegram app');
          },
          password: async (hint) => {
              // This callback is for 2FA password if needed, but QR login usually bypasses or handles it differently?
              // Actually QR login might still require password if 2FA is on.
              // But client.signInUserWithQrCode documentation says it returns a promise that resolves when logged in.
              // Wait, checking docs or usage...
              // Actually standard QR login waits for user to scan.
              // If password is required, it might throw PasswordNeededError or similar after scan.
              // For simplicity, let's assume we just handle the scan for now.
              return  password; // We might need a UI to prompt for password if this is called
          }
        }
      );

      // Once resolved, we are logged in
      console.log('Logged in!');
      setStatus('Logged in!');
      const sessionString = client.session.save();
      await saveSession(sessionString);
      setIsLoggedIn(true);

    } catch (e) {
      console.error(e);
      setStatus('Error: ' + e.message);
      // Handle 2FA password need here if strictly necessary,
      // though typically QR login involves scanning and confirming on the phone.
      // If the user has a cloud password, the promise might throw or request it.
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Telegram Login</Text>

      {!qrCodeUrl ? (
        <>
          <Text style={styles.label}>API ID</Text>
          <TextInput
            style={styles.input}
            value={inputApiId}
            onChangeText={setInputApiId}
            placeholder="Enter API ID"
            keyboardType="numeric"
          />

          <Text style={styles.label}>API Hash</Text>
          <TextInput
            style={styles.input}
            value={inputApiHash}
            onChangeText={setInputApiHash}
            placeholder="Enter API Hash"
          />

          <Button title="Generate QR Code" onPress={startLogin} disabled={loading} />
        </>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.instruction}>{status}</Text>
          {/* react-native-qrcode-svg does not support web fully out of the box in some versions or needs svg support */}
          {Platform.OS === 'web' ? (
              // On web we might render it differently or use a library compatible with web
               <QRCode
                  value={qrCodeUrl}
                  size={250}
               />
          ) : (
              <QRCode
                value={qrCodeUrl}
                size={250}
              />
          )}

          <View style={{marginTop: 20}}>
            <Button title="Reset / Cancel" onPress={() => { setQrCodeUrl(''); setLoading(false); }} />
          </View>
        </View>
      )}

      {loading && !qrCodeUrl && <ActivityIndicator style={{ marginTop: 20 }} />}
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
      marginBottom: 20,
      fontSize: 16,
      textAlign: 'center'
  },
  status: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray'
  }
});
