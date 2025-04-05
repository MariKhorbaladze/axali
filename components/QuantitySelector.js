import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onDecrease}
      >
        <Ionicons name="remove" size={16} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.quantity}>{quantity}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={onIncrease}
      >
        <Ionicons name="add" size={16} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  button: {
    padding: 6,
    backgroundColor: '#f0f0f0',
  },
  quantity: {
    paddingHorizontal: 12,
    fontWeight: 'bold',
  },
});

export default QuantitySelector;