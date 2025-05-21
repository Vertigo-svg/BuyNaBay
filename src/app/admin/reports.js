// app/admin/reports.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5 } from '@expo/vector-icons';

const ReportsScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports & Analytics</Text>
      <Text style={styles.subtitle}>Here you can find various reports and insights into your marketplace.</Text>

      <View style={styles.reportSection}>
        <View style={styles.reportCard}>
          <FontAwesome5 name="shopping-cart" size={30} color="#1B1B41" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Sales Overview</Text>
          <Text style={styles.cardText}>Total sales, average order value, and sales trends over time.</Text>
        </View>

        <View style={styles.reportCard}>
          <FontAwesome5 name="users" size={30} color="#1B1B41" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>User Activity</Text>
          <Text style={styles.cardText}>New user registrations, active users, and user retention rates.</Text>
        </View>
      </View>

      <View style={styles.reportSection}>
        <View style={styles.reportCard}>
          <FontAwesome5 name="box-open" size={30} color="#1B1B41" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Product Performance</Text>
          <Text style={styles.cardText}>Top-selling products, most viewed items, and inventory status.</Text>
        </View>

        <View style={styles.reportCard}>
          <FontAwesome5 name="chart-line" size={30} color="#1B1B41" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Revenue Breakdown</Text>
          <Text style={styles.cardText}>Detailed look at revenue sources and profitability.</Text>
        </View>
      </View>

      <View style={styles.placeholderCard}>
        <FontAwesome5 name="wrench" size={40} color="#FDAD00" />
        <Text style={styles.placeholderText}>More reports coming soon!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 30,
  },
  reportSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '48%', // Adjust based on your layout needs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    marginBottom: 15,
    color: '#FDAD00', // Changed icon color
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold', // Assuming you have Poppins_600SemiBold, if not, use Poppins_700Bold or Poppins_500Medium
    color: '#1B1B41',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    textAlign: 'center',
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#FDAD00',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    color: '#FDAD00',
    marginTop: 15,
  },
});

export default ReportsScreen;