import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchDashboardData } from './database'; // Assuming you have a function to fetch dashboard data

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData(); // Fetch data for the dashboard
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigateTo = (route) => {
    router.push(route);
  };

  const renderSummaryCard = (title, value) => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryCardTitle}>{title}</Text>
      <Text style={styles.summaryCardValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Summary Data */}
      <View style={styles.summaryContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FDAD00" />
        ) : dashboardData ? (
          <>
            {renderSummaryCard('Total Products', dashboardData.totalProducts)}
            {renderSummaryCard('Total Users', dashboardData.totalUsers)}
            {renderSummaryCard('Total Sales', `$${dashboardData.totalSales}`)}
          </>
        ) : (
          <Text style={styles.errorText}>Failed to load dashboard data</Text>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navButtonsContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigateTo('/admin/products')}
        >
          <FontAwesome5 name="box" size={20} color="#1B1B41" />
          <Text style={styles.navButtonText}>Manage Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigateTo('/admin/users')}
        >
          <FontAwesome5 name="users" size={20} color="#1B1B41" />
          <Text style={styles.navButtonText}>Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigateTo('/admin/reports')}
        >
          <FontAwesome5 name="chart-bar" size={20} color="#1B1B41" />
          <Text style={styles.navButtonText}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigateTo('/admin/database')}
        >
          <FontAwesome5 name="database" size={20} color="#1B1B41" />
          <Text style={styles.navButtonText}>Database</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    flexWrap: 'wrap', // Allows the summary cards to stack on smaller screens
  },
  summaryCard: {
    backgroundColor: '#FDAD00',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15, // Ensure spacing between cards when stacked
  },
  summaryCardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  summaryCardValue: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
    marginTop: 10,
  },
  navButtonsContainer: {
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDAD00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  navButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
    marginLeft: 15,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Dashboard;
