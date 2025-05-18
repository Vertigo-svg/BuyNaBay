import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  Platform
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import fetch from 'cross-fetch';
import { createClient } from '@supabase/supabase-js';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';

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
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Refs for inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const schoolIdRef = useRef(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Form validation
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (password && password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
      if (schoolId && schoolId.length < 3) {
        newErrors.schoolId = 'School ID seems too short';
      }

      setErrors(newErrors);
      setIsFormValid(
        email.trim().length > 0 &&
        password.length > 0 &&
        phoneNumber.length > 0 &&
        schoolId.length > 0 &&
        Object.keys(newErrors).length === 0
      );
    };
    validateForm();
  }, [email, password, phoneNumber, schoolId]);

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

  const handleSignUp = async () => {
    Keyboard.dismiss();

    if (!email.trim()) {
        showError('Missing Email', 'Please enter your email address.', () => emailRef.current?.focus());
        return;
    }
    if (errors.email) {
        showError('Invalid Email', errors.email, () => emailRef.current?.focus());
        return;
    }
    if (!password) {
        showError('Missing Password', 'Please enter your password.', () => passwordRef.current?.focus());
        return;
    }
    if (errors.password) {
        showError('Invalid Password', errors.password, () => passwordRef.current?.focus());
        return;
    }
    if (!phoneNumber.trim()) {
        showError('Missing Phone Number', 'Please enter your phone number.', () => phoneNumberRef.current?.focus());
        return;
    }
    if (errors.phoneNumber) {
        showError('Invalid Phone Number', errors.phoneNumber, () => phoneNumberRef.current?.focus());
        return;
    }
    if (!schoolId.trim()) {
        showError('Missing School ID', 'Please enter your School ID.', () => schoolIdRef.current?.focus());
        return;
    }
    if (errors.schoolId) {
        showError('Invalid School ID', errors.schoolId, () => schoolIdRef.current?.focus());
        return;
    }

    if (!isFormValid) {
        showError('Incomplete Form', 'Please fill all fields correctly.');
        return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const verificationCode = generateRandomCode();

    setLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', trimmedEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        showError('Database Error', 'Could not verify existing user: ' + fetchError.message);
        setLoading(false);
        return;
      }

      if (existingUser) {
        showError('User Exists', 'This email is already registered. Please try logging in.');
        setLoading(false);
        return;
      }

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
        showError('Error', 'Failed to store verification details. ' + insertError.message);
        setLoading(false);
        return;
      }

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
        console.error('Email Error Response:', errorText);
        showError('Error', `Failed to send verification email. Server responded with: ${response.status}`);
        setLoading(false);
        return;
      }
      
      showSuccess(
        'Verification Sent',
        'A verification code has been sent to your email. Please check your inbox (and spam folder).',
        () => router.push({ pathname: '/verify', params: { email: trimmedEmail }})
      );

    } catch (err) {
      console.error("Sign Up Catch Error: ", err);
      showError('Unexpected Error', err.message || 'Something went wrong during sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/logIn');
  };

  const handleBackArrowPress = () => {
    router.push('/intro');
  };

  // Input Handlers
  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };
  
  const handlePasswordChange = (text) => setPassword(text);
  const handlePhoneNumberChange = (text) => setPhoneNumber(text);
  const handleSchoolIdChange = (text) => setSchoolId(text);

  // Auto-focus next input
  const handleEmailSubmit = () => passwordRef.current?.focus();
  const handlePasswordSubmit = () => phoneNumberRef.current?.focus();
  const handlePhoneNumberSubmit = () => schoolIdRef.current?.focus();
  const handleSchoolIdSubmit = () => {
    if (isFormValid && !loading) {
      handleSignUp();
    }
  };

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
                <Text style={styles.signUpText}>Sign Up</Text>
                <View style={styles.titleUnderline} />
        </View>
        <Text style={styles.welcomeText}>
          Create an account to start managing your finances with BuyNaBay.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={emailRef}
            label="Email Address"
            mode="flat"
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor={errors.email ? "#FF6B6B" : "#FDAD00"}
            selectionColor="#FDAD00"
            value={email}
            onChangeText={handleEmailChange}
            onSubmitEditing={handleEmailSubmit}
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
                primary: errors.email ? "#FF6B6B" : "#FDAD00",
              },
            }}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
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
            underlineColor={errors.password ? "#FF6B6B" : "#FDAD00"}
            selectionColor="#FDAD00"
            value={password}
            onChangeText={handlePasswordChange}
            onSubmitEditing={handlePasswordSubmit}
            textColor='#FFF'
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="next"
            accessible={true}
            accessibilityLabel="Password input"
            theme={{
              colors: {
                text: '#FFF',
                placeholder: '#FFF',
                primary: errors.password ? "#FF6B6B" : "#FDAD00",
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
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={phoneNumberRef}
            label="Phone Number (e.g. 09xxxxxxxxx)"
            mode="flat"
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor={errors.phoneNumber ? "#FF6B6B" : "#FDAD00"}
            selectionColor="#FDAD00"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            onSubmitEditing={handlePhoneNumberSubmit}
            textColor='#FFF'
            keyboardType="phone-pad"
            returnKeyType="next"
            accessible={true}
            accessibilityLabel="Phone number input"
            theme={{
              colors: {
                text: '#FFF',
                placeholder: '#FFF',
                primary: errors.phoneNumber ? "#FF6B6B" : "#FDAD00",
              },
            }}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>
        
        {/* School ID Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={schoolIdRef}
            label="School ID"
            mode="flat"
            style={styles.input}
            placeholderTextColor="#FFF"
            underlineColor={errors.schoolId ? "#FF6B6B" : "#FDAD00"}
            selectionColor="#FDAD00"
            value={schoolId}
            onChangeText={handleSchoolIdChange}
            onSubmitEditing={handleSchoolIdSubmit}
            textColor='#FFF'
            autoCapitalize="characters"
            returnKeyType="go"
            accessible={true}
            accessibilityLabel="School ID input"
            theme={{
              colors: {
                text: '#FFF',
                placeholder: '#FFF',
                primary: errors.schoolId ? "#FF6B6B" : "#FDAD00",
              },
            }}
          />
          {errors.schoolId && (
            <Text style={styles.errorText}>{errors.schoolId}</Text>
          )}
        </View>

        {/* Sign Up Button */}
        <Button
          mode="contained"
          onPress={handleSignUp}
          style={[
            styles.signInButton,
            {
              opacity: isFormValid && !loading ? 1 : 0.7,
              backgroundColor: isFormValid && !loading ? '#FDAD00' : '#A0A0A0'
            }
          ]}
          labelStyle={styles.signInButtonText}
          disabled={!isFormValid || loading}
          loading={loading}
          accessible={true}
          accessibilityLabel="Create account button"
          accessibilityRole="button"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Login Prompt */}
        <TouchableOpacity 
          onPress={handleGoToLogin} 
          style={styles.signupTextContainer}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Already have an account? Sign in"
          accessibilityRole="button"
        >
          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.signupLink}>Sign In</Text>
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
  signUpText: {
    fontSize: 45,
    color: '#FFF',
    fontWeight: 900,
    fontFamily: 'Poppins_700Bold',
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
});

export default Register;