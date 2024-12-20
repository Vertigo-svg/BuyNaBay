import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

  useEffect(() => {
    async function fetchSchoolID() {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('school_id')
          .eq('email', username) // Fetch based on username
          .single();

        if (error) {
          console.error('Error fetching school ID:', error);
        } else {
          setSchoolID(data.school_id); // Set the fetched school ID to state
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchSchoolID();
  }, [username]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image source={require('../../../assets/joevel.jpeg')} style={styles.profileImage} />
        <Text style={styles.profileText}>School ID: {schoolID}</Text>
        {/* Other profile details */}
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default ProfileScreen;
