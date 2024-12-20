import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createClient } from '@supabase/supabase-js';

// Set up Supabase client
const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ProfileScreen = () => {
  const route = useRoute();
  const { username } = route.params; // Access the username parameter
  const [schoolID, setSchoolID] = useState('');
  const [name, setName] = useState('');
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    async function fetchSchoolID() {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('school_id, profile_name')
          .eq('email', username) // Fetch based on username
          .single();

        if (error) {
          console.error('Error fetching school ID:', error);
        } else {
          setSchoolID(data.school_id); // Set the fetched school ID to state
          setName(data.profile_name || ''); // Set the fetched profile name to state
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchSchoolID();
  }, [username]);

  const handleEditPress = () => {
    setEditable(true);
  };

  const handleSavePress = async () => {
    try {
      let { error } = await supabase
        .from('users')
        .update({ profile_name: name }) // Update profile name
        .eq('email', username); // Ensure correct user

      if (error) {
        console.error('Error updating profile name:', error);
      } else {
        setEditable(false); // Close the modal if successful
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelPress = () => {
    setEditable(false); // Close the modal without saving changes
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../../assets/blank_avatar.png')} style={styles.profileImage} />
          <Icon name="camera" size={20} color="#FFF" style={styles.cameraIcon} />
        </View>
        <Text style={styles.profileText}>Name: {name}</Text>
        <Text style={styles.profileText}>School ID: {schoolID}</Text>
        <TouchableOpacity style={editable ? styles.editButtonActive : styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Horizontal line */}
        <View style={styles.line}></View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Items Sold</Text>
          </View>
        </View>

        {/* Edit Profile Modal */}
        <Modal visible={editable} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#AAA" // Placeholder text color
              value={name}
              onChangeText={setName}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSavePress} color="#1B1B41" />
              <Button title="Cancel" onPress={handleCancelPress} color="#F2C14E" />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 50,
    marginBottom: 20,
  },
  cameraIcon: {
    position: 'absolute',
    top: 83,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 5,
  },
  profileText: {
    fontSize: 18,
    marginVertical: 5,
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#1B1B41', // Dark blue
    borderRadius: 5,
  },
  editButtonActive: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#F2C14E', // Gold
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    width: 230,
    height: 70,
    borderColor: '#FFF',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 20,
    width: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;
