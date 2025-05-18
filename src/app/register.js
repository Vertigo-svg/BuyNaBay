import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import fetch from 'cross-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; // Keep your key secure

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  fetch,
  realtime: { enabled: false },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random code
};

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !phoneNumber || !schoolId) {
      Alert.alert('Validation Error', 'All fields are required.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    const trimmedEmail = email.trim().toLowerCase();
    const verificationCode = generateRandomCode();

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${SUPABASE_URL}/auth/callback`,
        },
      });

      if (error) {
        Alert.alert('Registration Error', error.message);
        setLoading(false);
        return;
      }

      // ✅ Insert email, code, AND full user details
      const { error: insertError } = await supabase
        .from('email_verification_codes')
        .insert([{
          email: trimmedEmail,
          code: verificationCode,
          password: password,
          phone_number: phoneNumber,
          school_id: schoolId,
        }]);

      if (insertError) {
        console.error('Insert Error:', insertError);
        Alert.alert('Error', 'Failed to store verification details.');
        setLoading(false);
        return;
      }

      // ✅ Send email verification
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          email: trimmedEmail,
          code: verificationCode,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email Error:', errorText);
        Alert.alert('Error', 'Failed to send verification email.');
        setLoading(false);
        return;
      }

      // ✅ Redirect to /verify
      router.push({
        pathname: '/verify',
        params: { email: trimmedEmail },
      });

    } catch (err) {
      console.error(err);
      Alert.alert('Unexpected Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/logIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={35} color="#FDAD00" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      <View style={styles.Content}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create an account to get started</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            mode="flat"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            textColor="#FFF"
            theme={{ colors: { placeholder: '#FFF', primary: '#FDAD00' } }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            textColor="#FFF"
            theme={{ colors: { placeholder: '#FFF', primary: '#FDAD00' } }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Phone Number"
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            textColor="#FFF"
            theme={{ colors: { placeholder: '#FFF', primary: '#FDAD00' } }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="School ID"
            style={styles.input}
            value={schoolId}
            onChangeText={setSchoolId}
            textColor="#FFF"
            theme={{ colors: { placeholder: '#FFF', primary: '#FDAD00' } }}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FDAD00" style={{ marginTop: 20 }} />
        ) : (
          <Button mode="contained" onPress={handleSignUp} style={styles.signUpButton}>
            Create an Account
          </Button>
        )}

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInLink} onPress={handleGoToLogin}>
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b41',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
    margin: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    color: '#FFF',
  },
  Content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1b1b41',
    color: '#FFF',
  },
  signUpButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#FDAD00',
    borderRadius: 25,
    marginTop: 20,
  },
  signInContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signInText: {
    color: '#FFF',
    fontSize: 14,
  },
  signInLink: {
    fontWeight: 'bold',
    color: '#FDAD00',
  },
});

export default Register;
