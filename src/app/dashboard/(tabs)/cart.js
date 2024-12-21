import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { createClient } from '@supabase/supabase-js'; // Import Supabase to interact with the database
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the trash icon

// Initialize Supabase client with the URL and API key
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';
const supabase = createClient(supabaseUrl, supabaseKey); // Create a Supabase client instance

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); // State to hold cart items

  // Function to fetch cart items from the Supabase database
  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart') // Select the 'cart' table
      .select('id, itemname, price, image'); // Fetch specific columns (id, itemname, price, image)

    if (error) {
      console.error('Error fetching cart items:', error.message);
      Alert.alert('Error', 'Failed to fetch cart items.'); // Display an error if fetching fails
    } else {
      setCartItems(data); // Set the fetched data into state
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (id) => {
    const { error } = await supabase.from('cart').delete().match({ id }); // Delete the item by its ID

    if (error) {
      console.error('Error removing item:', error.message);
      Alert.alert('Error', 'Failed to remove the item.'); // Show an error if deletion fails
    } else {
      Alert.alert('Success', 'Item removed from cart.'); // Show success alert after removal
      fetchCartItems(); // Refresh the cart after removal
    }
  };

  // UseEffect hook to fetch cart items and set up real-time updates
  useEffect(() => {
    fetchCartItems(); // Fetch cart items on component mount

    // Subscribe to listen for real-time updates on the cart table
    const subscription = supabase
      .channel('cart-changes') // Create a channel for real-time events
      .on(
        'postgres_changes', // Listen to any changes (insert, update, delete) in the cart table
        { event: '*', schema: 'public', table: 'cart' },
        (payload) => {
          console.log('Change received!', payload); // Log changes to the console
          fetchCartItems(); // Refresh the cart items when changes occur
        }
      )
      .subscribe(); // Start subscribing to real-time updates

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription); // Remove the real-time subscription
    };
  }, []); // Empty dependency array ensures this effect runs only once (on component mount)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Header containing the app logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/BuyNaBay.png')} style={styles.logo} /> {/* App logo */}
          <Text style={styles.logoText}>BuyNaBay</Text> {/* App name */}
        </View>
      </View>

      {/* Cart header */}
      <Text style={styles.formHeader}>My Cart</Text>

      {/* FlatList to display cart items */}
      <FlatList
        data={cartItems} // Bind cartItems data to the list
        keyExtractor={(item) => item.id.toString()} // Set key for each list item using the item ID
        ListEmptyComponent={<Text style={styles.emptyMessage}>Your cart is empty.</Text>} // Display message if cart is empty
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {/* Displaying item image */}
            <Image
              source={{ uri: item.image || 'https://example.com/placeholder.png' }} // Default image if no image is provided
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              {/* Display item name */}
              <Text style={styles.itemName}>{item.itemname}</Text>
              {/* Display item price */}
              <Text style={styles.itemPrice}>
                {new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(item.price)} {/* Format the price in PHP currency format */}
              </Text>
              {/* Remove button */}
              <TouchableOpacity
                onPress={() => removeFromCart(item.id)} // Call removeFromCart function on press
                style={styles.removeButton}
              >
                <Ionicons name="trash-bin-outline" size={20} color="#FF6F00" /> {/* Trash icon */}
                <Text style={styles.removeText}>Remove</Text> {/* Remove button text */}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Styles for layout and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41', // Set background color for the container
    paddingHorizontal: 20, // Horizontal padding
    paddingBottom: 20, // Bottom padding
  },
  header: {
    flexDirection: 'row', // Arrange header content in a row
    justifyContent: 'center', // Center the content horizontally
    alignItems: 'center', // Align items vertically in the center
    marginTop: 20, // Margin from the top
    marginBottom: 20, // Margin from the bottom
  },
  logoContainer: {
    flexDirection: 'row', // Arrange logo and text in a row
    alignItems: 'center', // Vertically center the logo and text
  },
  logo: {
    width: 30,
    height: 40,
    resizeMode: 'contain', // Ensure logo scales without distortion
    marginRight: 10, // Space between logo and text
  },
  logoText: {
    fontSize: 22, // Font size for the logo text
    color: '#FFF', // Text color white
    fontFamily: 'Poppins_700Bold', // Use bold font style for the text
  },
  formHeader: {
    fontSize: 35, // Font size for the cart header
    color: '#FFF', // Text color white
    fontWeight: '900', // Bold font weight
    fontFamily: 'Poppins', // Use Poppins font
    textAlign: 'center', // Center align the header text
    marginBottom: 20, // Margin from the bottom
  },
  itemContainer: {
    flexDirection: 'row', // Arrange item image and details in a row
    backgroundColor: '#FFF', // Background color of the item container
    borderRadius: 10, // Border radius for rounded corners
    marginBottom: 15, // Space between items
    padding: 15, // Padding inside each item container
    shadowColor: '#000', // Shadow color
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for depth effect
    elevation: 3, // Elevation for Android shadow
  },
  itemImage: {
    width: 80, // Set width for the item image
    height: 80, // Set height for the item image
    borderRadius: 10, // Round the image corners
    marginRight: 15, // Space between image and item details
  },
  itemDetails: {
    flex: 1, // Allow the item details to take up remaining space
    justifyContent: 'space-between', // Distribute space between item name, price, and remove button
  },
  itemName: {
    fontSize: 18, // Font size for item name
    fontWeight: '600', // Semi-bold font weight
    color: '#333', // Dark gray text color for better readability
  },
  itemPrice: {
    fontSize: 16, // Font size for item price
    fontWeight: 'bold', // Bold font weight
    color: '#FDAD00', // Use orange color for price to make it stand out
  },
  removeButton: {
    flexDirection: 'row', // Arrange the trash icon and text in a row
    alignItems: 'center', // Vertically center the items
    alignSelf: 'flex-start', // Align to the start (left side)
    backgroundColor: '#FFF3E0', // Light orange background for the remove button
    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 10, // Horizontal padding
    borderRadius: 20, // Rounded corners
  },
  removeText: {
    color: '#FDAD00', // Text color for the remove button
    fontSize: 14, // Font size for the remove button text
    fontWeight: '600', // Semi-bold font weight
    marginLeft: 5, // Space between icon and text
  },
  emptyMessage: {
    textAlign: 'center', // Center align the empty message text
    fontSize: 18, // Font size for the empty message
    color: '#999', // Light gray color for the message
    marginTop: 50, // Margin from the top to space it out
  },
});
