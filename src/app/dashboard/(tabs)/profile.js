import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';

// Set up Supabase client with URL and API Key
const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const route = useRoute();
  const { username } = route.params;
  const [schoolID, setSchoolID] = useState('');
  const [name, setName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [editable, setEditable] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);

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
          setLoading(false);
          return;
        }

        const { data: defaultAvatar } = supabase.storage
          .from('users-avatar')
          .getPublicUrl('blank_avatar.png');

        setSchoolID(data.school_id);
        setName(data.profile_name || '');
        setProfileAvatar(data.profile_avatar || defaultAvatar.publicUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  const editAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setShowActionButtons(true);
      }
    } else {
      Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
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
    setSavingProfile(true);
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
        Alert.alert('Update Failed', 'Unable to update your profile. Please try again.');
      } else {
        setProfileAvatar(avatarUrl);
        setEditable(false);
        setShowActionButtons(false);
        Alert.alert('Success', 'Your profile has been updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      // Get the default avatar URL
      const { data: defaultAvatar } = supabase.storage
        .from('users-avatar')
        .getPublicUrl('blank_avatar.png');

      // Update profile in Supabase to reflect the default avatar
      await supabase
        .from('users')
        .update({ profile_avatar: defaultAvatar.publicUrl })
        .eq('email', username);

      setProfileAvatar(defaultAvatar.publicUrl);
      setSelectedImage(null);
      setShowActionButtons(false);
      Alert.alert('Success', 'Profile picture has been reset to default.');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Unable to reset profile picture. Please try again.');
    }
  };

  const cancelImageSelection = () => {
    setSelectedImage(null);
    setShowActionButtons(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDAD00" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B1B41" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/BuyNaBay.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={selectedImage ? { uri: selectedImage } : { uri: profileAvatar }}
              style={styles.profileImage}
            />
            {!editable ? (
              <TouchableOpacity style={styles.editProfileButton} onPress={() => setEditable(true)}>
                <Ionicons name="pencil" size={18} color="#FFF" />
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editAvatarButton} onPress={editAvatar}>
                <Ionicons name="camera" size={22} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Image action buttons */}
          {showActionButtons && (
            <View style={styles.imageActionButtons}>
              <TouchableOpacity style={styles.imageActionButton} onPress={cancelImageSelection}>
                <Ionicons name="close-circle" size={24} color="#FF4757" />
                <Text style={styles.imageActionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageActionButton} onPress={handleDeleteAvatar}>
                <Ionicons name="trash" size={24} color="#FF4757" />
                <Text style={styles.imageActionButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {!editable ? (
              <>
                <Text style={styles.profileName}>{name || 'Add your name'}</Text>
                <Text style={styles.profileID}>{schoolID}</Text>
                <Text style={styles.profileEmail}>{username}</Text>
              </>
            ) : (
              <View style={styles.editContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#AAA"
                  value={name}
                  onChangeText={setName}
                />
                
                <Text style={styles.staticInfoLabel}>School ID</Text>
                <Text style={styles.staticInfoValue}>{schoolID}</Text>
                
                <Text style={styles.staticInfoLabel}>Email</Text>
                <Text style={styles.staticInfoValue}>{username}</Text>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]} 
                    onPress={() => {
                      setEditable(false);
                      setSelectedImage(null);
                      setShowActionButtons(false);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={handleSavePress}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <ActivityIndicator size="small" color="#1B1B41" />
                    ) : (
                      <>
                        <Ionicons name="save" size={18} color="#1B1B41" />
                        <Text style={styles.saveButtonText}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B41',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 30 : 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  profileCard: {
    width: '100%',
    marginTop: 30,
    backgroundColor: 'rgba(44, 44, 84, 0.6)',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FDAD00',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: width * 0.32,
    backgroundColor: '#FDAD00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
    marginBottom: 8,
  },
  profileID: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#FDAD00',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C54',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  editProfileButtonText: {
    color: '#FFF',
    marginLeft: 5,
    fontFamily: 'Poppins_400Regular',
  },
  imageActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  imageActionButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  imageActionButtonText: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  editContainer: {
    width: '100%',
    padding: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FDAD00',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  staticInfoLabel: {
    fontSize: 14,
    color: '#FDAD00',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  staticInfoValue: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '48%',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  saveButton: {
    backgroundColor: '#FDAD00',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins_500Medium',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#1B1B41',
    fontFamily: 'Poppins_500Medium',
    marginLeft: 5,
  },
});

export default ProfileScreen;