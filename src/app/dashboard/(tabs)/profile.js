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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../../assets/blank_avatar.png')} style={styles.profileImage} />
          <Icon name="camera" size={20} color="#FFF" style={styles.cameraIcon} />
        </View>
        <Text style={styles.profileText}>Name: {name}</Text>
        <Text style={styles.profileText}>School ID: {schoolID}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Edit Profile Modal */}
        <Modal visible={editable} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={name}
              onChangeText={setName}
            />
            <Button title="Save" onPress={handleSavePress} />
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
    backgroundColor: '#007BFF',
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
    width: 200,
    height: 40,
    borderColor: '#FFF',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF',
  },
});

export default ProfileScreen;
