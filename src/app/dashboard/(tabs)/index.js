import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Initialize Supabase client
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co'; 
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ItemList() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedItems, setLikedItems] = useState({}); // Track liked items

  // Fetch items from Supabase
  const fetchItems = async (category) => {
    let query = supabase.from('items').select('*');
    if (category) {
      query = query.eq('category', category); // Filter by category if specified
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data);
    }
  };

  // Fetch liked items
  const fetchLikedItems = async () => {
    const { data: cartItems, error } = await supabase.from('cart').select('itemname'); // Use 'itemname' instead of 'item_id'
    if (error) {
      console.error('Error fetching liked items:', error);
    } else {
      const likedItemsMap = {};
      cartItems.forEach((like) => {
        likedItemsMap[like.itemname] = true; // Assuming 'itemname' is the identifier for a liked item
      });
      setLikedItems(likedItemsMap);
    }
  };
  

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems(selectedCategory);
    await fetchLikedItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchItems(selectedCategory);
    fetchLikedItems();
  }, [selectedCategory]);

  // Toggle like status and save to cart
  const toggleLike = async (item) => {
    const isLiked = likedItems[item.id];
  
    if (isLiked) {
      // Remove from cart if already liked
      const { error } = await supabase.from('cart').delete().eq('item_id', item.id);
      if (error) {
        console.error('Error removing from cart:', error.message);
      } else {
        setLikedItems((prev) => ({ ...prev, [item.id]: false }));
        console.log('Item removed from cart');
      }
    } else {
      // Check if the item already exists in the cart to avoid duplicates
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('id') // Use 'id' to check for existing entries
        .eq('itemname', item.itemname) // Assuming itemname is unique or a suitable key for matching
        .single();
  
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking cart:', checkError.message);
        return;
      }
  
      if (existingItem) {
        console.log('Item already exists in the cart.');
      } else {
        // Add item to cart if it doesn't already exist
        const { error } = await supabase.from('cart').insert([
          {
            itemname: item.itemname,
            description: item.description,
            price: item.price,
            category: item.category,
            address: item.address,
            image: item.image || 'https://example.com/placeholder.png',
          },
        ]);
  
        if (error) {
          console.error('Error adding to cart:', error.message);
        } else {
          setLikedItems((prev) => ({ ...prev, [item.id]: true }));
          console.log('Item added to cart successfully');
        }
      }
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
          <FontAwesome name="bars" size={24} color="black" />
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
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Row */}
      <View style={styles.categoryRow}>
        {[
          { name: 'Books', image: require('../../../../products/10.png') },
          { name: 'Shoes', image: require('../../../../products/11.png') },
          { name: 'Clothes', image: require('../../../../products/12.png') },
          { name: 'Foods', image: require('../../../../products/13.png') },
        ].map((category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => setSelectedCategory(category.name)}
            style={styles.categoryButton}
          >
            <Image source={category.image} style={styles.categoryImage} />
            <Text style={[styles.categoryText, selectedCategory === category.name && styles.activeCategoryText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
            <Text style={styles.itemCategory}>Category: {item.category}</Text>
            <Text style={styles.itemAddress}>Address: {item.address}</Text>
            <Image source={{ uri: item.image || 'https://example.com/placeholder.png' }} style={styles.itemImage} />
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFECB3' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoImage: { width: 30, height: 30, marginRight: 8 },
  logoText: { fontSize: 24, fontWeight: 'bold' },
  searchBar: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, flex: 1 },
  itemContainer: { marginTop: 15, padding: 15, backgroundColor: '#FFF', borderRadius: 5, borderWidth: 1, borderColor: '#FF6F00' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemImage: { width: '100%', height: 200, borderRadius: 5, marginBottom: 10, resizeMode: 'cover' },
  iconsContainer: { flexDirection: 'row', marginTop: 10 },
  icon: { marginRight: 20 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  categoryButton: { alignItems: 'center', width: 70 },
  categoryImage: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  activeCategoryText: { fontWeight: 'bold', color: '#FF6F00' },
});
