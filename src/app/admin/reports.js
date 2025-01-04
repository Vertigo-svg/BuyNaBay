import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppLoading from 'expo-app-loading';

const initialReports = [
  { id: '1', title: 'Report A', date: '2025-01-01', status: 'Resolved' },
  { id: '2', title: 'Report B', date: '2025-01-03', status: 'Pending' },
  { id: '3', title: 'Report C', date: '2025-01-05', status: 'In Progress' },
];

const AdminReports = () => {
  const [reports, setReports] = useState(initialReports);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleResolve = (id) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, status: 'Resolved' } : report
      )
    );
  };

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportDetails}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDate}>Date: {item.date}</Text>
        <Text style={styles.reportStatus}>Status: {item.status}</Text>
      </View>
      {item.status !== 'Resolved' && (
        <TouchableOpacity
          style={styles.resolveButton}
          onPress={() => handleResolve(item.id)}
        >
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.resolveButtonText}>Resolve</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b41',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportCard: {
    backgroundColor: '#FDAD00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportDetails: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1b1b41',
  },
  reportDate: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1b1b41',
  },
  reportStatus: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1b1b41',
  },
  resolveButton: {
    backgroundColor: '#1b1b41',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resolveButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
    marginLeft: 5,
  },
});

export default AdminReports;
