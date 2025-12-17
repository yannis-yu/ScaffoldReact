import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext } from '../App';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import QRCode from 'react-native-qrcode-svg';

export default function LoginScreen() {
  const { apiId, apiHash, saveSettings, setClient, saveSession, setIsLoggedIn } = useAppContext();

  const [inputApiId, setInputApiId] = useState(apiId || '');
  const [inputApiHash, setInputApiHash] = useState(apiHash || '');

  // Login Mode: 'qr' or 'phone'
  const [mode, setMode] = useState('qr');

  // QR State
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Phone State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [phoneStep, setPhoneStep] = useState('number'); // 'number', 'code', 'password'

  const [status, setStatus] = useState('');

  // Helper to init client
  const initClient = async () => {
    if (!inputApiId || !inputApiHash) {
      alert('Please provide API ID and Hash');
      return null;
    }
    await saveSettings(inputApiId, inputApiHash, null);

    setStatus('Initializing Client...');
    const stringSession = new StringSession('');
    const client = new TelegramClient(stringSession, parseInt(inputApiId), inputApiHash, {
      connectionRetries: 5,
    });
    setClient(client);
    await client.connect();
    return client;
  };

  // --- QR Code Logic ---

  const startQrLogin = async () => {
    setLoading(true);
    try {
      const client = await initClient();
      if (!client) {
          setLoading(false);
          return;
      }

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
             console.log('QR Code received');
             // Fix base64url encoding issue
             const base64 = code.token.toString('base64');
             const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
             setQrCodeUrl(`tg://login?token=${urlSafe}`);
             setStatus('Scan the QR code with your Telegram app');
          },
          password: async (hint) => {
              // Usually handled by phone after scan?
              // If needed, we might need UI for this.
              // For now, let's hope standard QR flow works.
              return '';
          }
        }
      );

      // Success
      console.log('Logged in!');
      setStatus('Logged in!');
      const sessionString = client.session.save();
      await saveSession(sessionString);
      setIsLoggedIn(true);

    } catch (e) {
      console.error(e);
      setStatus('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Phone Number Logic ---

  const sendCode = async () => {
      setLoading(true);
      try {
          const client = await initClient();
          if (!client) {
              setLoading(false);
              return;
          }

          setStatus('Sending Code...');
          const result = await client.sendCode(
              {
                  apiId: parseInt(inputApiId),
                  apiHash: inputApiHash,
                  phoneNumber: phoneNumber,
              }
          );

          setPhoneCodeHash(result.phoneCodeHash);
          setPhoneStep('code');
          setStatus('Code sent. Please check your telegram.');
      } catch (e) {
          console.error(e);
          setStatus('Error sending code: ' + e.message);
      } finally {
          setLoading(false);
      }
  };

  const loginWithCode = async () => {
      setLoading(true);
      // We assume client is already set in state from sendCode step
      // But we need to retrieve it from context or closure if we didn't save it well.
      // useAppContext returns { client } which we called setClient on.
      // However, React state updates might be async or we need to access the client instance we created.
      // Ideally we shouldn't rely on 'client' from context being immediately available if we just set it.
      // But since we set it in initClient and awaited connect, it should be in context OR we can access the instance if we stored it in ref.
      // Actually, since we called setClient, and this is a subsequent render (user input code), context 'client' should be updated?
      // Not necessarily if we are in the same component instance, we need to access the context value.
      // But `useAppContext` is a hook.
      // Let's use a local ref or just trust the context `client` if `sendCode` set it successfully.
      // A safer way is to store client in a ref inside AppContext or here.
      // But let's try accessing `client` from props/context directly.

      // Wait, `client` from `useAppContext` is the one we set.
      // Let's get it from context.
  };

  // We need to pass the client to the next step.
  // Since `client` in `LoginWithCode` is needed.
  // We can just rely on `client` from `useAppContext()` but we need to fetch it again inside the function.
  // Actually, we can't easily access the *updated* client variable from context inside a function if we just set it in a previous async operation without a re-render.
  // BUT, sendCode sets the client. The user then types the code. This takes time. The component Re-renders.
  // So `client` from `useAppContext` SHOULD be populated in the next render cycle when user clicks "Login".

  const { client } = useAppContext(); // Get current client from context

  const submitCode = async () => {
      if (!client) {
          alert('Client not initialized');
          return;
      }
      setLoading(true);
      setStatus('Logging in...');

      try {
          await client.signIn({
              phoneNumber: phoneNumber,
              phoneCodeHash: phoneCodeHash,
              phoneCode: phoneCode,
          });

          console.log('Logged in!');
          setStatus('Logged in!');
          const sessionString = client.session.save();
          await saveSession(sessionString);
          setIsLoggedIn(true);

      } catch (e) {
          if (e.message.includes('password')) {
              setPhoneStep('password');
              setStatus('Two-Step Verification Password Required');
          } else {
              console.error(e);
              setStatus('Error: ' + e.message);
          }
      } finally {
          setLoading(false);
      }
  };

  const submitPassword = async () => {
       if (!client) return;
       setLoading(true);
       try {
           await client.signIn({
               password: phonePassword,
               phoneNumber: phoneNumber,
               phoneCodeHash: phoneCodeHash,
               phoneCode: phoneCode,
           });

           setStatus('Logged in!');
           const sessionString = client.session.save();
           await saveSession(sessionString);
           setIsLoggedIn(true);
       } catch (e) {
           console.error(e);
           setStatus('Error: ' + e.message);
       } finally {
           setLoading(false);
       }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Telegram Login</Text>

      {/* API Credentials */}
      {!qrCodeUrl && phoneStep === 'number' && (
          <View style={styles.section}>
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
          </View>
      )}

      {/* Mode Switcher */}
      {!qrCodeUrl && phoneStep === 'number' && (
          <View style={styles.modeContainer}>
              <Button title="QR Code" onPress={() => setMode('qr')} color={mode === 'qr' ? '#2196F3' : '#ccc'} />
              <View style={{width: 20}} />
              <Button title="Phone Number" onPress={() => setMode('phone')} color={mode === 'phone' ? '#2196F3' : '#ccc'} />
          </View>
      )}

      {/* QR Login Flow */}
      {mode === 'qr' && (
          <View style={styles.flowContainer}>
             {!qrCodeUrl ? (
                 <Button title="Generate QR Code" onPress={startQrLogin} disabled={loading} />
             ) : (
                <View style={styles.qrContainer}>
                  <Text style={styles.instruction}>{status}</Text>
                   {Platform.OS === 'web' ? (
                       <QRCode value={qrCodeUrl} size={250} />
                   ) : (
                       <QRCode value={qrCodeUrl} size={250} />
                   )}
                  <View style={{marginTop: 20}}>
                    <Button title="Reset / Cancel" onPress={() => { setQrCodeUrl(''); setLoading(false); }} />
                  </View>
                </View>
             )}
          </View>
      )}

      {/* Phone Login Flow */}
      {mode === 'phone' && (
          <View style={styles.flowContainer}>
              {phoneStep === 'number' && (
                  <>
                      <Text style={styles.label}>Phone Number (international format)</Text>
                      <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="+1234567890"
                        keyboardType="phone-pad"
                      />
                      <Button title="Send Code" onPress={sendCode} disabled={loading} />
                  </>
              )}

              {phoneStep === 'code' && (
                  <>
                      <Text style={styles.label}>Enter Code</Text>
                      <TextInput
                        style={styles.input}
                        value={phoneCode}
                        onChangeText={setPhoneCode}
                        placeholder="12345"
                        keyboardType="numeric"
                      />
                      <Button title="Login" onPress={submitCode} disabled={loading} />
                  </>
              )}

              {phoneStep === 'password' && (
                  <>
                      <Text style={styles.label}>Enter Password (2FA)</Text>
                      <TextInput
                        style={styles.input}
                        value={phonePassword}
                        onChangeText={setPhonePassword}
                        placeholder="Password"
                        secureTextEntry
                      />
                      <Button title="Submit Password" onPress={submitPassword} disabled={loading} />
                  </>
              )}
          </View>
      )}

      {loading && !qrCodeUrl && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
      {status ? <Text style={styles.status}>{status}</Text> : null}

      {(qrCodeUrl || phoneStep !== 'number') && !loading && (
          <TouchableOpacity onPress={() => {
              // Reset
              setQrCodeUrl('');
              setPhoneStep('number');
              setLoading(false);
              setStatus('');
              setClient(null); // Reset client to force re-init if needed
          }} style={{marginTop: 30}}>
              <Text style={{color: 'red', textAlign: 'center'}}>Cancel / Restart</Text>
          </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  section: {
      marginBottom: 20
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
  modeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20
  },
  flowContainer: {
      marginBottom: 20
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
