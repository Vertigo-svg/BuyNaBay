import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
import fetch from 'cross-fetch';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { fetch });

const Verify = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // For query parameters
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.email) {
      setEmail(params.email.toString().trim());
    }
  }, [params]);

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Validation Error', 'Please enter the verification code.');
      return;
    }

    const cleanCode = code.trim();

    setLoading(true);
    try {
      // Step 1: Retrieve user data from verification table
      const { data: verificationData, error } = await supabase
        .from('email_verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', cleanCode)
        .eq('is_verified', false)
        .single();

      if (error || !verificationData) {
        Alert.alert('Verification Failed', 'Invalid or expired verification code.');
        setLoading(false);
        return;
      }

      // Step 2: Insert into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          email: verificationData.email,
          password: verificationData.password, // ⚠️ hash in production!
          phone_number: verificationData.phone_number,
          school_id: verificationData.school_id,
        }]);

      if (insertError) {
        Alert.alert('User Creation Failed', insertError.message);
        setLoading(false);
        return;
      }

      // Step 3: Mark verification code as used
      await supabase
        .from('email_verification_codes')
        .update({ is_verified: true })
        .eq('email', email)
        .eq('code', cleanCode);

      Alert.alert('Success', 'Email verified and account created!');
      router.push('/logIn');
    } catch (err) {
      Alert.alert('Unexpected Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit verification code sent to {email}
        </Text>

        <TextInput
          label="Verification Code"
          keyboardType="number-pad"
          style={styles.input}
          value={code}
          onChangeText={setCode}
          textColor="#FFF"
          theme={{ colors: { placeholder: '#FFF', primary: '#FDAD00' } }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FDAD00" style={{ marginTop: 20 }} />
        ) : (
          <Button mode="contained" onPress={handleVerifyCode} style={styles.verifyButton}>
            Verify
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b41',
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#1b1b41',
    width: '100%',
    marginBottom: 20
  },
  verifyButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#FDAD00',
    borderRadius: 25
  }
});

export default Verify;
