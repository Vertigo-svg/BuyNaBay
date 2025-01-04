import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppLoading from 'expo-app-loading';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminProducts = () => {
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '' });
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Ensure that the component only renders once fonts are loaded
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Function to handle adding a product
  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      // Add product to Supabase
      const { data, error } = await supabase
        .from('products') // Replace 'products' with the actual table name in your Supabase
        .insert([
          {
            name: newProduct.name,
            price: `₱${newProduct.price}`,
            quantity: Number(newProduct.quantity),
          },
        ]);

      if (error) {
        console.error('Error adding product:', error.message);
        Alert.alert('Error', 'Failed to add the product.');
      } else {
        // Fetch updated list of products from Supabase
        fetchProducts();
        setNewProduct({ name: '', price: '', quantity: '' }); // Reset input fields
        Alert.alert('Success', 'Product added successfully.');
      }
    }
  };

  // Function to fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products') // Fetch products from the Supabase 'products' table
      .select('*');

    if (error) {
      console.error('Error fetching products:', error.message);
      Alert.alert('Error', 'Failed to fetch products.');
    } else {
      setProducts(data); // Update state with fetched products
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productText}>{item.name}</Text>
      <Text style={styles.productText}>{item.price}</Text>
      <Text style={styles.productText}>Qty: {item.quantity}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Manage Products</Text>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Product Section */}
      <View style={styles.addProductContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          placeholderTextColor="#1b1b41"
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#1b1b41"
          keyboardType="numeric"
          value={newProduct.price}
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          placeholderTextColor="#1b1b41"
          keyboardType="numeric"
          value={newProduct.quantity}
          onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b41',
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#FDAD00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#1b1b41',
  },
  addProductContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#FDAD00',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#1b1b41',
    fontFamily: 'Poppins_400Regular',
  },
  addButton: {
    backgroundColor: '#FDAD00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1b1b41',
    marginLeft: 5,
  },
});

export default AdminProducts;
