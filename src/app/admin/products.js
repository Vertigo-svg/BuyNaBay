import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminProductsScreen = () => { // Renamed to avoid confusion if you name the file AdminProducts.js
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    }
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error.message);
      Alert.alert('Error', 'Failed to fetch products.');
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              name: newProduct.name,
              price: `₱${newProduct.price}`, // Assuming price is stored as string with currency
              quantity: Number(newProduct.quantity),
            },
          ]);

        if (error) {
          throw error;
        }

        fetchProducts();
        setNewProduct({ name: '', price: '', quantity: '' });
        Alert.alert('Success', 'Product added successfully.');
      } catch (error) {
        console.error('Error adding product:', error.message);
        Alert.alert('Error', 'Failed to add the product.');
      }
    } else {
      Alert.alert('Missing Fields', 'Please fill in all product details.');
    }
  };

  const handleEdit = (id, data) => {
    setEditData({ id, data: { ...data, price: String(data.price).replace('₱', '') } }); // Store price without ₱ for editing
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    try {
      const { id, data } = editData;
      const { error } = await supabase
        .from('products')
        .update({
          name: data.name,
          price: `₱${data.price}`, // Add ₱ back when saving
          quantity: Number(data.quantity)
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      fetchProducts();
      setEditData(null);
      setIsEditing(false);
      Alert.alert('Success', 'Product updated successfully.');
    } catch (error) {
      console.error('Error updating product:', error.message);
      Alert.alert('Error', 'Failed to update the product.');
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEdit(item.id, item)}
      >
        <FontAwesome5 name="edit" size={16} color="#1B1B41" />
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* The Page Header provided by AdminLayout.js will appear above this content */}

      {/* Products List */}
      <View style={styles.productsContainer}>
        <View style={styles.tableHeaderContainer}>
          <Text style={styles.tableTitle}>Available Products</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchProducts}
          >
            <FontAwesome5 name="sync-alt" size={16} color="#FDAD00" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderProduct}
            style={styles.productsList}
            contentContainerStyle={styles.productsListContent}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <FontAwesome5 name="box-open" size={32} color="#FDAD00" />
            <Text style={styles.noDataText}>No products available</Text>
          </View>
        )}
      </View>

      {/* Add Product Form */}
      <View style={styles.addProductContainer}>
        <Text style={styles.formTitle}>Add New Product</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Product Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter product name"
            placeholderTextColor="#999"
            value={newProduct.name}
            onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.formLabel}>Price (₱)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.formLabel}>Quantity</Text>
            <TextInput
              style={styles.formInput}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={newProduct.quantity}
              onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <FontAwesome5 name="plus" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      {isEditing && editData && (
        <View style={styles.editModal}>
          <View style={styles.editModalContent}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Product</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <FontAwesome5 name="times" size={20} color="#FDAD00" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editModalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Product Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={editData.data.name || ''}
                  onChangeText={(text) => {
                    setEditData(prev => ({
                      ...prev,
                      data: { ...prev.data, name: text }
                    }));
                  }}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price</Text>
                <TextInput
                  style={styles.formInput}
                  value={editData.data.price} // Assuming price is already string without ₱ from handleEdit
                  onChangeText={(text) => {
                    setEditData(prev => ({
                      ...prev,
                      data: { ...prev.data, price: text } // Store as plain number string
                    }));
                  }}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Quantity</Text>
                <TextInput
                  style={styles.formInput}
                  value={editData.data.quantity ? String(editData.data.quantity) : ''}
                  onChangeText={(text) => {
                    setEditData(prev => ({
                      ...prev,
                      data: { ...prev.data, quantity: text }
                    }));
                  }}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.editModalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// Styles are the same as you provided, just ensure they don't define a conflicting .container padding if AdminLayout already does
// For brevity, I'm not repeating the full styles here. Use the styles from your AdminProducts.js.
// Just make sure the top-level SafeAreaView style (styles.container) in AdminProductsScreen
// doesn't conflict with padding/margins from AdminLayout's content view.
// The `padding: 25` on AdminLayout's `content` style and AdminProducts' `container` style might be additive.
// You might want to remove padding from one of them or adjust as needed. For now, I'll keep your AdminProducts styles as is.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    // Consider if the padding: 25 from AdminLayout's content style is sufficient,
    // or if this screen needs its own additional padding.
    // If AdminLayout's content area already has padding, you might remove it here.
    // For now, keeping it as per your original AdminProducts.js:
    padding: 25,
  },
  // ... (rest of your styles from AdminProducts.js)
  pageHeader: { // This style can be removed if you remove the header View from the component
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pageTitle: { // This style can be removed
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  pageSubtitle: { // This style can be removed
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 5,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1B1B41',
    padding: 15,
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 173, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#FDAD00',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    marginLeft: 5,
  },
  productsList: {
    flex: 1,
  },
  productsListContent: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  editButton: {
    backgroundColor: '#FDAD00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  addProductContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#555',
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#FDAD00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  editModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '70%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  editModalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  editModalForm: {
    maxHeight: 400,
  },
  editModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#FDAD00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  }
});

export default AdminProductsScreen;