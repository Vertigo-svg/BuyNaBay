import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Initialize Supabase client with the URL and key for database interaction
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co'; 
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ItemList() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]); // Stores items fetched from the database
  const [refreshing, setRefreshing] = useState(false); // State to manage pull-to-refresh action
  const [searchVisible, setSearchVisible] = useState(false); // Toggle visibility of search bar
  const [searchText, setSearchText] = useState(''); // Stores the text entered in the search bar
  const [selectedCategory, setSelectedCategory] = useState(null); // Stores the selected category for filtering items
  const [likedItems, setLikedItems] = useState({}); // Maps item IDs to their liked status (true/false)

  // Function to fetch items from the database based on selected category
  const fetchItems = async (category) => {
    let query = supabase.from('items').select('*');
    if (category) {
      query = query.eq('category', category); // Filters items based on category if selected
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data); // Updates items state with fetched data
    }
  };

  // Function to fetch liked items (i.e., items added to cart)
  const fetchLikedItems = async () => {
    const { data: cartItems, error } = await supabase.from('cart').select('itemname');
    if (error) {
      console.error('Error fetching liked items:', error);
    } else {
      const likedItemsMap = {};
      cartItems.forEach((like) => {
        likedItemsMap[like.itemname] = true; // Marks items in the cart as liked
      });
      setLikedItems(likedItemsMap); // Updates liked items state
    }
  };

  // Refresh handler: fetch items and liked items on pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true); // Starts refreshing
    await fetchItems(selectedCategory); // Fetches items based on the selected category
    await fetchLikedItems(); // Fetches liked items (cart)
    setRefreshing(false); // Stops refreshing
  };

  // Effect hook to fetch items and liked items when the component is mounted or category changes
  useEffect(() => {
    fetchItems(selectedCategory);
    fetchLikedItems();
  }, [selectedCategory]);

  // Toggle like/unlike functionality for items
  const toggleLike = async (item) => {
    const isLiked = likedItems[item.id];

    if (isLiked) {
      // Remove item from cart if it’s already liked
      const { error } = await supabase.from('cart').delete().eq('item_id', item.id);
      if (error) {
        console.error('Error removing from cart:', error.message);
      } else {
        setLikedItems((prev) => ({ ...prev, [item.id]: false })); // Update liked status
        console.log('Item removed from cart');
      }
    } else {
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('id')
        .eq('itemname', item.itemname)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking cart:', checkError.message);
        return;
      }

      if (existingItem) {
        console.log('Item already exists in the cart.');
      } else {
        // Add item to cart if it doesn't exist
        const { error } = await supabase.from('cart').insert([
          {
            itemname: item.itemname,
            description: item.description,
            price: item.price,
            category: item.category,
            address: item.address,
            image: item.image || 'https://example.com/placeholder.png', // Default image if not provided
          },
        ]);

        if (error) {
          console.error('Error adding to cart:', error.message);
        } else {
          setLikedItems((prev) => ({ ...prev, [item.id]: true })); // Update liked status
          console.log('Item added to cart successfully');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with logo, search bar toggle, and notifications */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
          <FontAwesome name="bars" size={24} color="#FDAD00" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/OfficialBuyNaBay.png')} style={styles.logoImage} />
          {searchVisible ? (
            <TextInput
              style={styles.searchBar}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              autoFocus
            />
          ) : (
            <Text style={styles.logoText}>BuyNaBay</Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={styles.iconButton}>
            <FontAwesome name="search" size={24} color="#FDAD00" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="#FDAD00" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category row for filtering items */}
      <View style={styles.categoryContainer}>
        {[
          { name: 'Books', image: require('../../../../products/2.png') },
          { name: 'Shoes', image: require('../../../../products/3.png') },
          { name: 'Clothes', image: require('../../../../products/4.png') },
          { name: 'Foods', image: require('../../../../products/5.png') },
        ].map((category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => setSelectedCategory(category.name)}
            style={[styles.categoryButton, selectedCategory === category.name && styles.activeCategory]}
          >
            <View style={styles.categoryContent}>
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={[styles.categoryText, selectedCategory === category.name && styles.activeCategoryText]}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* FlatList to display items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.itemname}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>
              {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.price)}
            </Text>
            <Text style={styles.itemCategory}>
              <Ionicons name="pricetag" size={16} color="#666" /> Category: {item.category}
            </Text>
            <Text style={styles.itemAddress}>
              <Ionicons name="location-outline" size={16} color="#666" /> Address: {item.address}
            </Text>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={() => toggleLike(item)} style={styles.icon}>
                <FontAwesome
                  name={likedItems[item.id] ? 'heart' : 'heart-o'}
                  size={24}
                  color={likedItems[item.id] ? 'red' : 'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('inbox')} style={styles.icon}>
                <FontAwesome name="comments-o" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('cart')} style={styles.icon}>
                <Ionicons name="cart-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Pull-to-refresh functionality
        }
      />
    </View>
  );
}

// Style definitions for layout and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFECB3', // Light background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#1B1B41', // Dark header background
    marginBottom: 10,
    zIndex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  iconButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
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
  searchBar: {
    width: '60%',
    height: 40,
    borderRadius: 20,
    paddingLeft: 16,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    backgroundColor: '#FFECB3', // Light background for categories
  },
  categoryButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    width: 80,
  },
  categoryContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryText: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  activeCategory: {
    backgroundColor: '#FDAD00', // Active category background color
  },
  activeCategoryText: {
    color: '#FFF',
  },
  itemContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFF3E0', // Light item background color
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1B1B41',
  },
  itemDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFAD1F', // Price color
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 8,
    borderRadius: 12,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 16,
  },
});
