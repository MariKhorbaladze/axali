import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ cart, updateQuantity, removeFromCart, clearCart, closeCart, calculateTotal }) => {
  useEffect(() => {
    const backAction = () => {
      closeCart();
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); 
  }, [closeCart]);

  const getThumbnailUrl = (item) => {
    if (!item) return 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
    
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      if (item.photos[0] && typeof item.photos[0] === 'object' && item.photos[0].thumbs) {
        return item.photos[0].thumbs;
      }
    }
    
    return 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₾';
    return parseFloat(price).toFixed(2).replace(/\.00$/, '') + ' ₾';
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: getThumbnailUrl(item) }} 
        style={styles.cartItemImage} 
      />
      
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={2}>{item.title || item.name || 'უსახელო პროდუქტი'}</Text>
        <Text style={styles.cartItemPrice}>{formatPrice(item.price || item.cost)}</Text>
      </View>
      
      <View style={styles.cartItemActions}>
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeCart} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ჩემი კალათა</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>გასუფთავება</Text>
        </TouchableOpacity>
      </View>

      {!cart || cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartText}>კალათა ცარიელია</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>ჯამური თანხა:</Text>
              <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
            </View>
            
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>შეკვეთის განთავსება</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  closeButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#ff5722',
    fontWeight: '500',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  cartList: {
    paddingVertical: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 1,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  cartItemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  quantityButton: {
    backgroundColor: '#ff5722',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    marginTop: 8,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;