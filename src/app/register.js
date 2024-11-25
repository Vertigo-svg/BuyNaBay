import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons for standard icons
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#FFF', // Set the global text color to white
    primary: '#FFF', // Primary button and accent color
    background: '#1b1b41', // Background color
    surface: '#1b1b41', // Card/Surface background color
    placeholder: '#B0B0B0', // Placeholder color
  },
  fonts: {
    regular: { fontFamily: 'Poppins_400Regular' },
    medium: { fontFamily: 'Poppins_500Medium' },
    light: { fontFamily: 'Poppins_300Light' },
    thin: { fontFamily: 'Poppins_100Thin' },
  },
};


const Register = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={30} color="#FDAD00" />
        </TouchableOpacity>

        {/* Logo and Title */}
        <View style={styles.headerContent}>
          <Image source={require('../assets/BuyNaBay.png')} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>BuyNaBay</Text>
        </View>
      </View>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create an account so you can manage your personal finances</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          mode="flat"
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#FFF"
          labelStyle={styles.labelText}
          textColor='#FFF'
          theme={{
            colors: {
              placeholder: '#FFF', // Set placeholder color to white
              primary: '#FDAD00',
            },
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="Password"
          secureTextEntry
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#FFF"
          labelStyle={styles.labelText}
          textColor='#FFF'
          theme={{
            colors: {
              placeholder: '#FFF', // Set placeholder color to white
              primary: '#FDAD00',
            },
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="Phone Number"
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor="#FFF"
          labelStyle={styles.labelText}
          textColor='#FFF'
          theme={{
            colors: {
              placeholder: '#FFF', // Set placeholder color to white
              primary: '#FDAD00',
            },
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="School ID"
          style={styles.input}
          placeholder="Enter School ID Number"
          placeholderTextColor="#FFF"
          labelStyle={styles.labelText}
          textColor='#FFF'
          theme={{
            colors: {
              placeholder: '#FFF', // Set placeholder color to white
              primary: '#FDAD00',
            },
          }}
        />
      </View>

      {/* Sign Up Button */}
      <Button mode="contained" onPress={() => console.log('Registering...')} style={styles.signUpButton}>
        Create an Account
      </Button>

      {/* Sign In Text */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => router.push('/logIn')}>
            Sign In
          </Text>
        </Text>
      </View>

      {/* Social Media Sign Up */}
      <View style={styles.socialSignUp}>
        <Text style={styles.socialText}>Or continue with social account</Text>
        <View style={styles.socialIcons}>
          {/* Apple Icon */}
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="apple" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Google (Gmail) Icon */}
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="google" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Facebook Icon */}
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="facebook" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1b1b41',
    fontFamily: 'Poppins', // Set global font to Poppins
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align the logo and title to the right
    flex: 1,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10, // Space between the logo and text
    fontFamily: 'Poppins', // Ensure Poppins font for title
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins', // Ensure Poppins font for title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0', // Lighter gray color for subtitle to appear faded
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins', // Ensure Poppins font for subtitle
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1b1b41',
    color: '#FFF',
    fontFamily: 'Poppins_400Regular', // Ensure Poppins font for inputs
  },
  labelText: {
    fontFamily: 'Poppins', // Apply Poppins to label text
    color: '#FFF', // White color for the label
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
    fontFamily: 'Poppins', // Ensure Poppins font for sign-in text
  },
  signInLink: {
    fontWeight: 'bold',
    color: '#FDAD00',
  },
  socialSignUp: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialText: {
    color: '#B0B0B0', // Lighter gray color for socialText to appear faded
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Poppins', // Ensure Poppins font for social text
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialIcon: {
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Register;
