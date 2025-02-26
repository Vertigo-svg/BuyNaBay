import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';

// Set up Supabase client with URL and API Key
const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ProfileScreen = () => {
  const route = useRoute();
  const { username } = route.params;
  const [schoolID, setSchoolID] = useState('');
  const [name, setName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [editable, setEditable] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('school_id, profile_name, profile_avatar')
          .eq('email', username)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        const { data: defaultAvatar } = supabase.storage
          .from('users-avatar')
          .getPublicUrl('blank_avatar.png');

        setSchoolID(data.school_id);
        setName(data.profile_name || '');
        setProfileAvatar(data.profile_avatar || defaultAvatar.publicUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchUserData();
  }, [username]);

  const editAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permission to access the media library is required!');
    }
  };

  const uploadImageToSupabase = async (imageUri) => {
    try {
      const imageExt = imageUri.split('.').pop(); // Get image extension
      const fileName = `avatar_${Date.now()}.${imageExt}`; // Unique file name

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: `image/${imageExt}`,
      });

      // Upload image to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('users-avatar')
        .upload(fileName, formData, {
          upsert: true,
        });

      if (storageError) {
        throw storageError;
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('users-avatar')
        .getPublicUrl(storageData.path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSavePress = async () => {
    let avatarUrl = profileAvatar;

    if (selectedImage) {
      const uploadedImageUrl = await uploadImageToSupabase(selectedImage);
      if (uploadedImageUrl) {
        avatarUrl = uploadedImageUrl;
      }
    }

    try {
      let { error } = await supabase
        .from('users')
        .update({ profile_name: name, profile_avatar: avatarUrl })
        .eq('email', username);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setProfileAvatar(avatarUrl);
        setEditable(false);
        Alert.alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      // Delete avatar from Supabase storage
      const { error } = await supabase.storage
        .from('users-avatar')
        .remove([profileAvatar.split('/').pop()]); // Remove the avatar image by its name

      if (error) {
        console.error('Error deleting avatar:', error);
        return;
      }

      // Set the avatar back to the default "blank_avatar.png"
      const { data: defaultAvatar } = supabase.storage
        .from('users-avatar')
        .getPublicUrl('blank_avatar.png');

      // Update profile in Supabase to reflect the default avatar
      await supabase
        .from('users')
        .update({ profile_avatar: defaultAvatar.publicUrl })
        .eq('email', username);

      setProfileAvatar(defaultAvatar.publicUrl); // Set locally
      Alert.alert('Avatar deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={selectedImage ? { uri: selectedImage } : { uri: profileAvatar }}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.profileText}>Name: {name}</Text>
        <Text style={styles.profileText}>School ID: {schoolID}</Text>

        <TouchableOpacity
          style={editable ? styles.editButtonActive : styles.editButton}
          onPress={() => setEditable(!editable)}
        >
          <Text style={styles.editButtonText}>
            {editable ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>

        {editable && (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#AAA"
              value={name}
              onChangeText={setName}
            />

            <TouchableOpacity style={styles.uploadButton} onPress={editAvatar}>
              <Text style={styles.uploadButtonText}>Change Profile Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAvatar}>
              <Text style={styles.deleteButtonText}>Delete Avatar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Add the necessary styles for the new delete button
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
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
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
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
    backgroundColor: '#FDAD00',
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
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  editContainer: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C2C54',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    width: 230,
    height: 50,
    borderColor: '#FFF',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  uploadButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#FDAD00',
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#1B1B41',
    fontFamily: 'Poppins_600SemiBold',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#F2C14E',
    borderRadius: 5,
    marginTop: 15,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
});

export default ProfileScreen;