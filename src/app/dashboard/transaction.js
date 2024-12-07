import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';

export default function OrderSummary() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Text style={styles.headerText}>Order summary</Text>
        <Text style={styles.subHeaderText}>Your information is secure and encrypted</Text>

        {/* Shipping Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping discount applied!</Text>
          <Text style={styles.addressText}>
            Allyn Cambaya (+63)93******15
            {'\n'}Scions Subdivision, Cagayan de Oro, Phase 1, Block 2, Lot 5
            {'\n'}Canito-An, Cagayan de Oro, Misamis Oriental, Philippines
          </Text>
        </View>

        {/* Product Details */}
        <View style={styles.productSection}>
          <Image
            source={{ uri: 'https://dummyimage.com/100x100/ccc/fff&text=Product' }} // Replace with product image URL
            style={styles.productImage}
          />
          <View>
            <Text style={styles.productTitle}>
              Baseus Enock H17/C17 3.5mm Lateral In Ear Headset White-TypeC
            </Text>
            <Text style={styles.productPrice}>₱229.00</Text>
            <Text style={styles.discountedPrice}>₱619.49</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>Subtotal: ₱229.00</Text>
          <Text style={styles.summaryText}>Shipping: ₱125.00</Text>
          <Text style={styles.summaryText}>Shipping discount: -₱80.00</Text>
          <Text style={styles.totalText}>Total: ₱274.00</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <TouchableOpacity style={styles.placeOrderButton}>
        <Text style={styles.placeOrderText}>Place order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  addressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  productSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#1E88E5',
  },
  discountedPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  orderSummary: {
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 14,
    marginVertical: 2,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  placeOrderButton: {
    backgroundColor: '#FDAD00',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 16,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
