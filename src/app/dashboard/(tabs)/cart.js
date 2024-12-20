import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have Ionicons for icons

// Initialize Supabase client
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from Supabase
  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart') // Fetch from 'cart' table
      .select('id, itemname, price, image'); // Select only specific fields

    if (error) {
      console.error('Error fetching cart items:', error.message);
      Alert.alert('Error', 'Failed to fetch cart items.');
    } else {
      setCartItems(data); // Set the fetched data to state
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (id) => {
    const { error } = await supabase.from('cart').delete().match({ id });
    if (error) {
      console.error('Error removing item:', error.message);
      Alert.alert('Error', 'Failed to remove the item.');
    } else {
      Alert.alert('Success', 'Item removed from cart.');
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchCartItems(); // Initial fetch

    const subscription = supabase
      .channel('cart-changes') // Create a unique channel name
      .on(
        'postgres_changes', // Listen to Postgres changes
        { event: '*', schema: 'public', table: 'cart' }, // Listen to all events (INSERT, UPDATE, DELETE) on 'cart' table
        (payload) => {
          console.log('Change received!', payload);
          fetchCartItems(); // Refresh the cart whenever a change is detected
        }
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.image || 'https://example.com/placeholder.png' }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.itemname}</Text>
              <Text style={styles.itemPrice}>
                {new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(item.price)}
              </Text>
              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-bin-outline" size={24} color="red" />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Your cart is empty.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFECB3',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FF6F00',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF6F00',
    marginTop: 5,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  removeText: {
    color: 'red',
    marginLeft: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});
