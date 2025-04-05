import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../utils/cartContext';
import { fetchProductById } from '../utils/api';
import QuantitySelector from '../components/QuantitySelector';

const ProductDetailScreen = ({ route, navigation }) => {
  const product = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fullProduct, setFullProduct] = useState(null);

  useEffect(() => {
    const loadFullProductDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(product.id);
        setFullProduct(data);
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!product.description || product.description.length < 60) {
      loadFullProductDetails();
    } else {
      setFullProduct(product);
    }
  }, [product.id]);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      ...fullProduct,
      quantity,
    };

    addToCart(productToAdd);
    Alert.alert(
      'წარმატებული მოქმედება',
      'პროდუქტი წარმატებით დაემატა კალათაში',
      [{ text: 'OK' }]
    );
  };

  if (loading && !fullProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc0" />
      </View>
    );
  }

  const displayProduct = fullProduct || product;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: displayProduct.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{displayProduct.title}</Text>
        <Text style={styles.price}>{displayProduct.price.toFixed(2)} ₾</Text>
        <Text style={styles.category}>{displayProduct.category}</Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={18} color="#f1c40f" />
          <Text style={styles.rating}>
            {displayProduct.rating?.rate || 4.5} (
            {displayProduct.rating?.count || 120} შეფასება)
          </Text>
        </View>

        <Text style={styles.descriptionTitle}>აღწერა</Text>
        <Text style={styles.description}>{displayProduct.description}</Text>

        <View style={styles.actionContainer}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>რაოდენობა:</Text>
            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              onIncrease={() => setQuantity(quantity + 1)}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={20} color="#333" />
            <Text style={styles.addButtonText}>კალათში დამატება</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f9f9f9',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    marginLeft: 4,
    color: '#666',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 24,
  },
  actionContainer: {
    marginTop: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityTitle: {
    marginRight: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#fc0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;