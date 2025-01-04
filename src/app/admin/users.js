import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppLoading from 'expo-app-loading';

const initialUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Blocked' },
  { id: '3', name: 'Alice Brown', email: 'alice@example.com', status: 'Active' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleToggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' }
          : user
      )
    );
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userStatus}>Status: {item.status}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.statusButton,
          item.status === 'Active' ? styles.blockButton : styles.unblockButton,
        ]}
        onPress={() => handleToggleStatus(item.id)}
      >
        <Icon
          name={item.status === 'Active' ? 'ban' : 'unlock'}
          size={16}
          color="#fff"
        />
        <Text style={styles.statusButtonText}>
          {item.status === 'Active' ? 'Block' : 'Unblock'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
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
  userCard: {
    backgroundColor: '#FDAD00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1b1b41',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1b1b41',
  },
  userStatus: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1b1b41',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  blockButton: {
    backgroundColor: '#1b1b41',
  },
  unblockButton: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    marginLeft: 5,
  },
});

export default AdminUsers;
