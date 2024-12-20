import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const IntroScreen = () => {
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1)); // Start with full opacity
  const router = useRouter();

  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Set a timer to trigger the fade-out animation and then transition to the Login page after 2 seconds
    const timer = setTimeout(() => {
      // Start fading out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 3000, // Fade out duration (1 second)
        useNativeDriver: true,
      }).start();

      // After the fade-out is complete, navigate to the intro page
      setTimeout(() => {
        setLoading(false);
        router.push('intro'); // Navigate to the intro page
      }, 1000); // Same duration as fade-out
    }, 3000); // Initial wait time before starting fade-out

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  if (!fontsLoaded) {
    return <AppLoading />; // Wait for the fonts to load
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.Image
          source={require('../assets/BuyNaBay.png')} // Path to your logo image
          style={[styles.logo, { opacity: fadeAnim }]} // Apply fade animation to logo
        />
        <Animated.Text
          style={[styles.title, { opacity: fadeAnim, fontFamily: 'Poppins_700Bold' }]}>
          BuyNaBay
        </Animated.Text>
      </SafeAreaView>
    );
  }

  return null; // While loading, nothing is rendered
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1b41', // Updated background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    backgroundColor: '#1b1b41', // Logo background color to match the screen
    overflow: 'hidden', // Keeps the logo clean, no border-radius
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: -30,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold', // Apply the bold Poppins font to the title
  },
});

export default IntroScreen;
