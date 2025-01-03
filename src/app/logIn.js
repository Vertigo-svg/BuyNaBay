import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { createClient } from '@supabase/supabase-js';

// Set up Supabase client
const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';
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
    bold: { fontFamily: 'Poppins_700Bold' },
    regular: { fontFamily: 'Poppins_400Regular' },
    medium: { fontFamily: 'Poppins_500Medium' },
    light: { fontFamily: 'Poppins_300Light' },
    thin: { fontFamily: 'Poppins_100Thin' },
  },
};

const LogInPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (username && password) {
      // Check for Admin credentials first
      if (username === 'Admin' && password === 'buynabayadmin123') {
        router.push({ pathname: 'admin/dashboard' });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', username)
          .single();

        if (error) {
          alert('Login failed. Please check your credentials.');
          return;
        }

        if (data && data.password === password) {
          console.log('Login successful:', data);
          router.push({ pathname: 'dashboard/(tabs)/profile', params: { username } });
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        alert('An unexpected error occurred. Please try again.');
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  const handleBackArrowPress = () => {
    router.push('/intro');
  };

  const handleForgotPasswordPress = () => {
    router.push('/recover');
  };

  const handleSignUpPress = () => {
    router.push('/register');
  };

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackArrowPress} style={styles.backArrow}>
          <Icon name="chevron-left" size={20} color="#FDAD00" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.signInText}>Sign In</Text>
        <Text style={styles.welcomeText}>
          Welcome to BuyNaBay! You can continue to manage your finances.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Email Address"
            mode="flat"
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor="#FDAD00"
            selectionColor="#FDAD00"
            value={username}
            onChangeText={setUsername}
            textColor='#FFF'
            theme={{
              colors: {
                placeholder: '#FFF',
                primary: '#FDAD00',
              },
            }}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Password"
            mode="flat"
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor="#FDAD00"
            selectionColor="#FDAD00"
            value={password}
            onChangeText={setPassword}
            textColor='#FFF'
            theme={{
              colors: {
                text: '#FFF',
                placeholder: '#FFF',
                primary: '#FDAD00',
              },
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPasswordPress} style={styles.forgotPasswordContainer}>
          <View style={styles.forgotPasswordWrapper}>
            <Icon name="lock" size={16} color="#FFF" />
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            <View style={styles.arrowContainer}>
              <Icon name="chevron-right" size={16} color="rgba(255, 255, 255, 0.2)" />
              <Icon name="chevron-right" size={16} color="rgba(255, 255, 255, 0.5)" />
              <Icon name="chevron-right" size={16} color="rgba(255, 255, 255, 0.8)" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Sign In Button */}
        <Button
          mode="contained"
          onPress={handleSignIn}
          style={styles.signInButton}
          labelStyle={styles.signInButtonText}
        >
          Sign In
        </Button>

        {/* Signup Prompt */}
        <TouchableOpacity onPress={handleSignUpPress} style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Doesn't have an account? <Text style={styles.signupLink}>Signup</Text></Text>
        </TouchableOpacity>
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
    marginTop: 10,
    marginLeft: 10,
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
  signInText: {
    fontSize: 45,
    color: '#FFF',
    fontWeight: 900,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1b1b41',
    fontFamily: 'Poppins_400Regular',
    color: '#FFF',
  },
  verifyIcon: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  forgotPasswordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    padding: 30,
    borderRadius: 10,
  },
  forgotPasswordText: {
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
    marginHorizontal: 10,
    flex: 1,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  signupTextContainer: {
    marginTop: 1,
    alignItems: 'center',
  },
  signupText: {
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  signupLink: {
    color: '#FDAD00',
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#FDAD00',
    borderRadius: 25,
    paddingVertical: 10,
    marginBottom: 30,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  quickLoginContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  quickLoginText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  quickLoginSubText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
    fontWeight: 'bold',
  },
});

export default LogInPage;
