import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../utils/cartContext';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>{item.price.toFixed(2)} ₾</Text>
        
        <View style={styles.actions}>
          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              } else {
                removeFromCart(item.id);
              }
            }}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
          />
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.subtotal}>
        {(item.price * item.quantity).toFixed(2)} ₾
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: '#666',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
  subtotal: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
});

export default CartItem;