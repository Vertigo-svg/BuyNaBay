import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppLoading from 'expo-app-loading';

const adminData = [
  { id: '1', title: 'Manage Users', icon: 'users' },
  { id: '2', title: 'View Reports', icon: 'line-chart' },
  { id: '3', title: 'Settings', icon: 'cogs' },
];

const AdminDashboard = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Icon name={item.icon} size={24} color="#1b1b41" />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/BuyNaBay.png')} style={styles.logo} />
        <Text style={styles.logoText}>BuyNaBay</Text>
      </View>

      {/* Dashboard Title */}
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Functional Cards */}
      <FlatList
        data={adminData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2} // Display cards in two columns for a responsive layout
        contentContainerStyle={styles.cardContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b41',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow cards to wrap in multiple rows
    justifyContent: 'space-evenly', // Center the cards
    width: '100%',
  },
  card: {
    backgroundColor: '#FDAD00',
    width: '45%', // Card width takes up 45% of the screen for two-column layout
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#1b1b41',
    marginLeft: 10,
  },
});

export default AdminDashboard;
