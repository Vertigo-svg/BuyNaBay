import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons for standard icons
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#FFF',
    primary: '#FFF',
    background: '#1b1b41',
    surface: '#1b1b41',
    placeholder: '#B0B0B0',
  },
  fonts: {
    regular: { fontFamily: 'Poppins_400Regular' },
    medium: { fontFamily: 'Poppins_500Medium' },
    light: { fontFamily: 'Poppins_300Light' },
    thin: { fontFamily: 'Poppins_100Thin' },
  },
};

const Recover = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleRecover = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-app-url/reset-password', 
      });
      if (error) throw error;

      Alert.alert('Success', 'Recovery email sent! Check your inbox.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    }
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
        <Text style={styles.title}>Recover Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address, and we'll send you a link to reset your password.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            label="Email Address"
            mode="outlined"
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#FFF"
            underlineColor="#FDAD00"
            activeOutlineColor="#FDAD00"
            textColor="#FFF"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon name="email" color="#FDAD00" size={20} />}
          />
        </View>
        <Button mode="contained" onPress={handleRecover} style={styles.recoverButton}>
          Send Recovery Email
        </Button>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Remembered your password?{' '}
            <Text style={styles.signInLink} onPress={() => router.push('/logIn')}>
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
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    margin: 20,
  },
  backArrow: {
    alignSelf: 'flex-start',
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
    fontFamily: 'Poppins_700Bold',
  },
  Content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: 900,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1b1b41',
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  recoverButton: {
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
    fontFamily: 'Poppins',
  },
  signInLink: {
    fontWeight: 'bold',
    color: '#FDAD00',
  },
});

export default Recover;