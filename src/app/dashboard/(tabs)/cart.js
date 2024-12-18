import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Cart = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Cart is Empty!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for the cart screen
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Black text color
  },
});

export default Cart;
