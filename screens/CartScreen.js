import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartItem from '../components/CartItem';
import { useCart } from '../utils/cartContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, totalAmount, clearCart } = useCart();

  const handleCheckout = () => {
    Alert.alert(
      'გადახდა',
      'ეს არის დემო ფუნქცია. რეალურ აპლიკაციაში აქ გადახდის პროცესი იქნებოდა.',
      [
        {
          text: 'დახურვა',
          style: 'cancel',
        },
        {
          text: 'შეკვეთის დადასტურება',
          onPress: () => {
            Alert.alert('წარმატებული შეკვეთა', 'თქვენი შეკვეთა მიღებულია!');
            clearCart();
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'კალათის გასუფთავება',
      'ნამდვილად გსურთ კალათის გასუფთავება?',
      [
        {
          text: 'გაუქმება',
          style: 'cancel',
        },
        {
          text: 'გასუფთავება',
          onPress: clearCart,
          style: 'destructive',
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>თქვენი კალათა ცარიელია</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>დაბრუნება მაღაზიაში</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          კალათა ({cartItems.length} პროდუქტი)
        </Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>ჯამური თანხა:</Text>
          <Text style={styles.summaryValue}>{totalAmount.toFixed(2)} ₾</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>გადახდა</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartList: {
    padding: 16,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#fc0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 16,
  },
  shopButton: {
    backgroundColor: '#fc0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CartScreen;