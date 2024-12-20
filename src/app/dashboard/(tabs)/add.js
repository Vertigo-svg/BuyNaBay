import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Add() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null); // State to store the selected image

  // Function to handle photo selection
  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      // Launch the image picker if permission is granted
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set the image URI to state
      }
    } else {
      Alert.alert('Permission to access the media library is required!');
    }
  };

  const handleAddItem = async () => {
    if (!itemName || !description || !price || !category || !address) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    // Add the item to Supabase
    const { data, error } = await supabase.from('items').insert([
      {
        itemname: itemName,
        description: description,
        price: price,
        category: category,
        address: address,
        image: image, // Include the image URI in the submission
      },
    ]);

    if (error) {
      Alert.alert('Error adding item: ' + error.message);
    } else {
      Alert.alert('Item added successfully!');
      // Reset the form fields
      setItemName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setAddress('');
      setImage(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Photo</Text>

      {/* Add Photo Button */}
      <View style={styles.imageContainer}>
        <Button title="Pick an Image" onPress={pickImage} color="#FF6F00" />
        {image && (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="Enter item name"
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter item description"
          placeholderTextColor="#A0A0A0"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter item price"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a category" value="" />
            <Picker.Item label="Clothes" value="Clothes" />
            <Picker.Item label="Books" value="Books" />
            <Picker.Item label="Shoes" value="Shoes" />
            <Picker.Item label="Foods" value="Foods" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter item location"
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <Button title="Add Item" onPress={handleAddItem} color="#FF6F00" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFECB3', // Light creamy background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Accent color for headings
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderColor: '#FF6F00', // Accent border for the image preview
    borderWidth: 2,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#000', // Black for label text
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF', // White background for input fields
    color: '#000', // Black text for input fields
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1, // Add subtle border
    borderColor: '#fff', // Accent border color for input fields
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  picker: {
    color: '#000',
    fontSize: 16,
  },
});
