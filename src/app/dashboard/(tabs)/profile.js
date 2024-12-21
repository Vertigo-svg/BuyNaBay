import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
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
  const [profileAvatar, setProfileAvatar] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('school_id, profile_name, profile_avatar')
          .eq('email', username) // Fetch based on username
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setSchoolID(data.school_id);
          setName(data.profile_name || '');
          setProfileAvatar(data.profile_avatar || '');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchUserData();
  }, [username]);

  const handleEditPress = () => {
    setEditable(true);
  };

  const handleSavePress = async () => {
    try {
      let { error } = await supabase
        .from('users')
        .update({ profile_name: name })
        .eq('email', username);

      if (error) {
        console.error('Error updating profile name:', error);
      } else {
        setEditable(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelPress = () => {
    setEditable(false);
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setProfileAvatar(selectedImageUri);

      try {
        let { error } = await supabase
          .from('users')
          .update({ profile_avatar: selectedImageUri })
          .eq('email', username);

        if (error) {
          console.error('Error saving profile avatar:', error);
        } else {
          alert('Profile picture updated successfully!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      {/* Profile Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              profileAvatar
                ? { uri: profileAvatar }
                : require('../../../assets/blank_avatar.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handleCameraPress} style={styles.cameraButton}>
            <Icon name="camera" size={30} color="#FFF" />
          </TouchableOpacity>
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
              placeholderTextColor="#AAA"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
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
    backgroundColor: '#1B1B41',
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    color: '#FFF',
    fontFamily: 'Poppins_700Bold',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,  // Increased size
    height: 150, // Increased size
    borderRadius: 75, // Ensures it's a circle
    marginBottom: 20,
  },
  cameraButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  profileText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#F2C14E',
    borderRadius: 5,
  },
  editButtonActive: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#F2C14E',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_400Regular',
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
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  statLabel: {
    fontSize: 14,
    color: '#AAA',
    fontFamily: 'Poppins_400Regular',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#1B1B41',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#F2C14E',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
});

export default ProfileScreen;
