import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchDashboardData } from './database';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load the Poppins font
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
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleNavigateTo = (route) => {
    router.push(`/admin/${route}`);
  };

  const renderSummaryCard = (title, value, icon) => (
    <LinearGradient
      colors={['#FDAD00', '#F76D00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.summaryCard}
    >
      <View style={styles.summaryIconContainer}>
        <FontAwesome5 name={icon} size={24} color="#1B1B41" />
      </View>
      <View style={styles.summaryTextContainer}>
        <Text style={styles.summaryCardTitle}>{title}</Text>
        <Text style={styles.summaryCardValue}>{value}</Text>
      </View>
    </LinearGradient>
  );

  const renderActivityCard = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityIconContainer}>
        <FontAwesome5 name={item.icon} size={16} color="#FDAD00" />
      </View>
      <View style={styles.activityTextContainer}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  const recentActivities = [
    { id: '1', title: 'New user registered', time: '10 minutes ago', icon: 'user-plus' },
    { id: '2', title: 'New product listed', time: '30 minutes ago', icon: 'tag' },
    { id: '3', title: 'Sale completed', time: '1 hour ago', icon: 'shopping-cart' },
    { id: '4', title: 'Report resolved', time: '2 hours ago', icon: 'check-circle' },
  ];

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        
        <View style={styles.summaryContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FDAD00" />
          ) : dashboardData ? (
            <>
              {renderSummaryCard('Total Products', dashboardData.totalProducts, 'box')}
              {renderSummaryCard('Total Users', dashboardData.totalUsers, 'users')}
            </>
          ) : (
            <Text style={styles.errorText}>Failed to load dashboard data</Text>
          )}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivities}
          keyExtractor={(item) => item.id}
          renderItem={renderActivityCard}
          contentContainerStyle={styles.activityList}
        />
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => handleNavigateTo('products')}
          >
            <FontAwesome5 name="box" size={20} color="#1B1B41" />
            <Text style={styles.quickAccessText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => handleNavigateTo('users')}
          >
            <FontAwesome5 name="users" size={20} color="#1B1B41" />
            <Text style={styles.quickAccessText}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => handleNavigateTo('reports')}
          >
            <FontAwesome5 name="chart-bar" size={20} color="#1B1B41" />
            <Text style={styles.quickAccessText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
    marginBottom: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  summaryCard: {
    width: '31%',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
  },
  summaryCardValue: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessButton: {
    backgroundColor: '#FDAD00',
    width: '31%',
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickAccessText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
    marginTop: 10,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins_400Regular',
  },
});

export default Dashboard;