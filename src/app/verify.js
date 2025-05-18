import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; // Truncated for security
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

const Verify = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
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
      const { data: verificationData, error } = await supabase
        .from('email_verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', cleanCode)
        .eq('is_verified', false)
        .single();

      if (error || !verificationData) {
        Alert.alert('Verification Failed', 'Invalid or expired verification code.');
        return;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          email: verificationData.email,
          password: verificationData.password, // ⚠️ In production, hash the password
          phone_number: verificationData.phone_number,
          school_id: verificationData.school_id,
        }]);

      if (insertError) {
        Alert.alert('User Creation Failed', insertError.message);
        return;
      }

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={35} color="#FDAD00" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

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
          mode="outlined"
          placeholder="Enter your code"
          activeOutlineColor="#FDAD00"
          left={<TextInput.Icon name="lock" color="#FDAD00" />}
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    margin: 20,
  },
  backButton: {
    marginRight: 10,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
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
  input: {
    backgroundColor: '#1b1b41',
    color: '#FFF',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  verifyButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#FDAD00',
    borderRadius: 25,
    marginTop: 10,
  },
});

export default Verify;
