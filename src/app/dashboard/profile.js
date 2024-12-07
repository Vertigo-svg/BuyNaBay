import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer(); // Open the drawer when the icon is clicked
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.drawerIcon}>
          <Icon name="bars" size={24} color="#1B1B41" />
        </TouchableOpacity>

        <Text style={styles.logo}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image source={require('../../assets/joevel.jpeg')} style={styles.profileImage} />

        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>Joevel Berana</Text>
          <Icon name="check-circle" size={18} color="#FDAD00" style={styles.verifiedIcon} />
        </View>

        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
          <Icon name="edit" size={16} color="#fff" style={styles.editProfileIcon} />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>20</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>50</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>

        <View style={styles.divider} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41', // Dark blue background
  },
  header: {
    position: 'absolute', // Fix header on top
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
    borderBottomWidth: 0,
    borderBottomColor: 'black',
  },
  drawerIcon: {
    marginRight: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 200,
    color: '#1B1B41', // Vibrant yellow color
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingTop: 80, // Adjust padding to avoid overlap with header
    paddingBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FDAD00', // Vibrant yellow border
    marginTop: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text color for name
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 15,
    backgroundColor: '#FDAD00', // Vibrant yellow background
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#fff', // White text for edit button
  },
  editProfileIcon: {
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-around',
    width: '90%',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color for stats
  },
  statLabel: {
    fontSize: 12,
    color: '#fff', // White text color for stat labels
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#fff', // White divider
    marginVertical: 20,
  },
});

export default ProfileScreen;
