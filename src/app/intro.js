import React from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const router = useRouter();

  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigateToLogin = () => {
    router.push('logIn'); // Replace 'logIn' with the actual route to your login page
  };

  return (
    <LinearGradient
      colors={['#1B1B41', '#FDAD00']}
      start={{ x: 1, y: 0 }}
      end={{ x: 2, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Header Section with Logo and Text in Row */}
        <View style={styles.header}>
          <Image
            source={require('../assets/BuyNaBay2.png')} // Replace with the path to your logo
            style={styles.logo}
          />
          <Text style={[styles.logoText, { fontFamily: 'Poppins_700Bold' }]}>BuyNaBay</Text>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={[styles.title, { fontFamily: 'Poppins_700Bold' }]}>
            Buy Local, Sell Smart – All in Your Campus
          </Text>
          <Text style={[styles.description, { fontFamily: 'Poppins_400Regular' }]}>
            Your go-to app for buying and selling pre-loved items on campus! Support sustainability, save
            money, and connect with fellow students in a secure, easy-to-use platform. Buy smart, sell fast –
            all within your campus community.
          </Text>
            {/* Navigation Arrows */}
        <TouchableOpacity style={styles.arrowButton} onPress={navigateToLogin}>
          <View style={styles.arrowRow}>
            <Text style={[styles.arrow, { opacity: 0.1 }]}> &gt; </Text>
            <Text style={[styles.arrow, { opacity: 0.3 }]}> &gt; </Text>
            <Text style={[styles.arrow, { opacity: 0.5 }]}> &gt; </Text>
            <Text style={[styles.arrow, { opacity: 0.7 }]}> &gt; </Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.arrowRow}>
        </View>
      
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    alignSelf: 'center', // Center-align header
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 37,
    color: '#ffffff',
    textAlign: 'left', 
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    color: '#d1d1d1',
    textAlign: 'justify', 
    marginBottom: 30,
  },
  arrowButton: {
   
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 40,
    color: '#FFF',
    marginHorizontal: -9,
  },
});

export default WelcomeScreen;
