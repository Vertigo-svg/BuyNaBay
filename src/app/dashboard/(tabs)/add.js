import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons for UI icons
import * as ImagePicker from 'expo-image-picker'; // Import Expo's ImagePicker for image selection
import { Picker } from '@react-native-picker/picker'; // Import Picker for selecting categories
import { createClient } from '@supabase/supabase-js'; // Import Supabase for database interactions

// Initialize Supabase client with the URL and key
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';
const supabase = createClient(supabaseUrl, supabaseKey); // Create the Supabase client

export default function Add({ navigation }) {
  // State variables for form fields and image selection
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set the selected image URI
      }
    } else {
      Alert.alert('Permission to access the media library is required!');
    }
  };

  // Function to handle the item submission
  const handleAddItem = async () => {
    if (!itemName || !description || !price || !category || !address) {
      Alert.alert('Please fill out all fields.'); // Check if all fields are filled
      return;
    }

    // Insert the item into the Supabase database
    const { data, error } = await supabase.from('items').insert([
      {
        itemname: itemName,
        description: description,
        price: price,
        category: category,
        address: address,
        image: image,
      },
    ]);

    // Show success or error message based on the result
    if (error) {
      Alert.alert('Error adding item: ' + error.message);
    } else {
      Alert.alert('Item added successfully!');
      setItemName(''); // Clear form fields on success
      setDescription('');
      setPrice('');
      setCategory('');
      setAddress('');
      setImage(null); // Clear the image preview
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

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formHeader}>Add New Item</Text>

        {/* Image Picker */}
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>
              <Icon name="image" size={18} color="#FFF" style={styles.icon} /> Pick an Image
            </Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>

        {/* Item Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor="#FFF"
          />
          <Icon name="tag" size={20} color="#FFF" style={styles.inputIcon} />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter item description"
            placeholderTextColor="#FFF"
            multiline
            numberOfLines={4}
          />
          <Icon name="file-text" size={20} color="#FFF" style={styles.inputIcon} />
        </View>

        {/* Price Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter item price"
            placeholderTextColor="#FFF"
            keyboardType="numeric"
          />
          <Icon name="dollar-sign" size={20} color="#FFF" style={styles.inputIcon} />
        </View>

        {/* Category Picker */}
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
          <Icon name="list" size={20} color="#FFF" style={styles.inputIcon} />
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter item location"
            placeholderTextColor="#FFF"
          />
          <Icon name="map-pin" size={20} color="#FFF" style={styles.inputIcon} />
        </View>

        {/* Add Item Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>
            <Icon name="plus" size={20} color="#FFF" /> Add Item
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the layout and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41', // Background color for the entire screen
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
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
  formContainer: {
    flexGrow: 1,
    margin: 20,
  },
  formHeader: {
    fontSize: 35,
    color: '#FFF',
    fontWeight: 900,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: '#FDAD00', // Button color for image picker
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  imageButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6F00',
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    color: '#333',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CCC',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  picker: {
    color: '#333',
    fontSize: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 1,
    top: -5,
  },
  icon: {
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#FDAD00', // Button color for add item button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
