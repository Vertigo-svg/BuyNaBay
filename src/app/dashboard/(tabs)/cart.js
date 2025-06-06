import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { createClient } from '@supabase/supabase-js'; 
import { Ionicons } from '@expo/vector-icons'; 


const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';
const supabase = createClient(supabaseUrl, supabaseKey); 

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); 

  
  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart')
      .select('id, itemname, price, image'); 

    if (error) {
      console.error('Error fetching cart items:', error.message);
      Alert.alert('Error', 'Failed to fetch cart items.'); 
    } else {
      setCartItems(data); 
    }
  };

  
  const removeFromCart = async (id) => {
    const { error } = await supabase.from('cart').delete().match({ id }); 

    if (error) {
      console.error('Error removing item:', error.message);
      Alert.alert('Error', 'Failed to remove the item.'); 
      Alert.alert('Success', 'Item removed from cart.'); 
      fetchCartItems(); 
    }
  };

 
  useEffect(() => {
    fetchCartItems(); 
   
    const subscription = supabase
      .channel('cart-changes') 
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'cart' },
        (payload) => {
          console.log('Change received!', payload);
          fetchCartItems(); 
        }
      )
      .subscribe(); 

  
    return () => {
      supabase.removeChannel(subscription); 
    };
  }, []); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/BuyNaBay.png')}
            style={styles.logo}
          /> 
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

    
      <Text style={styles.formHeader}>My Cart</Text>

    
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()} 
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Your cart is empty.</Text>
        } 
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
                <Ionicons name="trash-bin-outline" size={20} color="#FF6F00" />
                <Text style={styles.removeText}>Remove</Text> 
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41', 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 20, 
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
  formHeader: {
    fontSize: 35, 
    color: '#FFF',
    fontWeight: '900', 
    fontFamily: 'Poppins', 
    textAlign: 'center', 
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 10, 
    marginBottom: 15, 
    padding: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 3, 
  },
  itemImage: {
    width: 80, 
    height: 80, 
    borderRadius: 10,
    marginRight: 15, 
  },
  itemDetails: {
    flex: 1, 
    justifyContent: 'space-between', 
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600', 
    color: '#333',
  },
  itemPrice: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#FDAD00', 
  },
  removeButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start', 
    backgroundColor: '#FFF3E0', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 20, 
  },
  removeText: {
    color: '#FDAD00', 
    fontSize: 14, 
    fontWeight: '600', 
    marginLeft: 5, 
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 18, 
    color: '#999', 
    marginTop: 50, 
  },
});
