import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.drawerIcon} onPress={openDrawer}>
          <Icon name="bars" size={24} color="#1B1B41" />
        </TouchableOpacity>
        <Text style={styles.logo}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionLabel}>Tools and Resources</Text>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="cogs" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="key" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Privacy Checkup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="home" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Supervision</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Preferences</Text>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="sun-o" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Darkmode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="bell" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="language" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="universal-access" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Accessibility</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionLabel}>Legal Policies</Text>
        <TouchableOpacity style={styles.settingOption}>
          <Icon name="file" size={18} style={styles.icon} />
          <Text style={styles.settingText}>Terms of Service</Text>
        </TouchableOpacity>
        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41', // Dark blue background for the settings screen
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
    backgroundColor: '#FFF',
    zIndex: 10,
    borderBottomWidth: 0,
    marginTop:40,
    borderBottomColor: 'black',
  },
  drawerIcon: { 
    marginRight: 16 
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 160,
    color: '#1B1B41',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 80, // Give space for the fixed header
    paddingHorizontal: 20,
  },
  sectionLabel: {
    marginTop:50,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FDAD00', // Vibrant yellow color for section labels
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 5,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#FFF', // White text for settings options
  },
  icon: {
    marginRight: 10,
    color: '#FDAD00', // Vibrant yellow color for icons
  },
  footerSpacing: {
    height: 50,
  },
});
