import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Alert, Keyboard, Platform, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [attemptCount, setAttemptCount] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // Form validation
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      
      if (username && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
        newErrors.username = 'Please enter a valid email address';
      }
      
      setErrors(newErrors);
      setIsFormValid(username.length > 0 && password.length > 0 && Object.keys(newErrors).length === 0);
    };
    
    validateForm();
  }, [username, password]);

  // Enhanced error handling with better user feedback
  const showError = (title, message, onPress = null) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onPress) onPress();
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'OK',
            onPress: onPress || (() => {}),
            style: 'default'
          }
        ],
        { cancelable: false }
      );
    }
  };

  const showSuccess = (title, message, onPress) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onPress) onPress();
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'Continue',
            onPress: onPress,
            style: 'default'
          }
        ],
        { cancelable: false }
      );
    }
  };

  const handleSignIn = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    // Validate form
    if (!username.trim()) {
      showError('Missing Email', 'Please enter your email address', () => {
        usernameRef.current?.focus();
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.trim())) {
      showError('Invalid Email', 'Please enter a valid email address', () => {
        usernameRef.current?.focus();
      });
      return;
    }

    if (!password) {
      showError('Missing Password', 'Please enter your password', () => {
        passwordRef.current?.focus();
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check for Admin credentials first
      if (username.trim() === 'Admin@gmail.com' && password === 'buynabayadmin123') {
        showSuccess('Welcome Admin!', 'Login successful. Redirecting to admin dashboard...', () => {
          router.push({ pathname: 'admin/dashboard' });
        });
        return;
      }

      // Add delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', username.trim())
        .single();

      if (error) {
        setAttemptCount(prev => prev + 1);
        
        if (attemptCount >= 2) {
          showError(
            'Too Many Failed Attempts', 
            'Having trouble logging in? Try resetting your password or contact support.',
            () => {
              setAttemptCount(0);
            }
          );
        } else {
          showError('Login Failed', 'Please check your email and password and try again.');
        }
        return;
      }

      if (data && data.password === password) {
        console.log('Login successful:', data);
        showSuccess('Welcome Back!', `Hello ${data.name || 'User'}! You have successfully logged in.`, () => {
          router.push({ pathname: 'dashboard/(tabs)/profile', params: { username: username.trim() } });
        });
      } else {
        setAttemptCount(prev => prev + 1);
        showError('Invalid Credentials', 'The email or password you entered is incorrect. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Connection Error', 'Unable to connect to server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackArrowPress = () => {
    router.push('/intro');
  };

  const handleForgotPasswordPress = () => {
    if (username.trim()) {
      router.push({ pathname: '/recover', params: { email: username.trim() } });
    } else {
      router.push('/recover');
    }
  };

  const handleSignUpPress = () => {
    router.push('/register');
  };

  // Enhanced input handlers
  const handleUsernameChange = (text) => {
    setUsername(text);
    if (errors.username && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setErrors(prev => ({ ...prev, username: null }));
    }
  };

  const handlePasswordChange = (text) => {
      setPassword(text);
  };

  // Auto-focus next input
  const handleUsernameSubmit = () => {
    passwordRef.current?.focus();
  };

  const handlePasswordSubmit = () => {
    if (isFormValid && !isLoading) {
      handleSignIn();
    }
  };

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FDAD00" />
        <Text style={[styles.welcomeText, { marginTop: 10 }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackArrowPress} 
          style={styles.backArrow}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Icon name="chevron-left" size={20} color="#FDAD00" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
      <View style={styles.signInWrapper}>
        <Text style={styles.signInText}>Sign In</Text>
        <View style={styles.titleUnderline} />
      </View>
        <Text style={styles.welcomeText}>
          Welcome to BuyNaBay! You can continue to buy and sell products.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={usernameRef}
            label="Email Address"
            mode="flat"
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor={errors.username ? "#FF6B6B" : "#FDAD00"}
            selectionColor="#FDAD00"
            value={username}
            onChangeText={handleUsernameChange}
            onSubmitEditing={handleUsernameSubmit}
            textColor='#FFF'
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            blurOnSubmit={false}
            returnKeyType="next"
            accessible={true}
            accessibilityLabel="Email address input"
            theme={{
              colors: {
                placeholder: '#FFF',
                primary: errors.username ? "#FF6B6B" : "#FDAD00",
              },
            }}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={passwordRef}
            label="Password"
            mode="flat"
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor="#FDAD00"
            selectionColor="#FDAD00"
            value={password}
            onChangeText={handlePasswordChange}
            onSubmitEditing={handlePasswordSubmit}
            textColor='#FFF'
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="go"
            accessible={true}
            accessibilityLabel="Password input"
            theme={{
              colors: {
                text: '#FFF',
                placeholder: '#FFF',
                primary: '#FDAD00',
              },
            }}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)} 
            style={styles.eyeIcon}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            accessibilityRole="button"
          >
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity 
          onPress={handleForgotPasswordPress} 
          style={styles.forgotPasswordContainer}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Forgot your password"
          accessibilityRole="button"
        >
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
          style={[
            styles.signInButton,
            {
              opacity: isFormValid && !isLoading ? 1 : 0.7,
              backgroundColor: isFormValid && !isLoading ? '#FDAD00' : '#A0A0A0'
            }
          ]}
          labelStyle={styles.signInButtonText}
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          accessible={true}
          accessibilityLabel="Sign in button"
          accessibilityRole="button"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Signup Prompt */}
        <TouchableOpacity 
          onPress={handleSignUpPress} 
          style={styles.signupTextContainer}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Don't have an account? Sign up"
          accessibilityRole="button"
        >
          <Text style={styles.signupText}>
            Doesn't have an account? <Text style={styles.signupLink}>Signup</Text>
          </Text>
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
    marginBottom: 5,
  },
  titleUnderline: {
    width: 100,
    height: 4,
    backgroundColor: '#FDAD00',
    borderRadius: 2,
    marginBottom: 5,
    },
  signInWrapper: {
    alignItems: 'center',
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontFamily: 'Poppins_400Regular',
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