import React, { useState, useEffect } from 'react';
import { View, Alert, Text, FlatList, StyleSheet, ActivityIndicator, Button, ScrollView, Image, TouchableOpacity, Modal, Dimensions, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import CartScreen from './CartScreen'; // Import the CartScreen component

const { width } = Dimensions.get('window');

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  
  useEffect(() => {
    const backAction = () => {
      if (isCartVisible) {
        setIsCartVisible(false);
        return true; 
      }
      if (selectedProduct) {
        setSelectedProduct(null);
        return true; 
      }
      return false; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isCartVisible, selectedProduct]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("კალათა განახლდა:", cart);
  }, [cart]);
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('მოთხოვნის დაწყება...');

      const response = await axios.post('https://api.mymarket.ge/api/v1/products');

      if (response.data && response.data.data && Array.isArray(response.data.data.Prs)) {
        const productsWithIds = response.data.data.Prs.map((product, index) => {
          if (!product.id && product.id !== 0) {
            return { ...product, id: `product_${index}` };
          }
          return product;
        });
        setProducts(productsWithIds);
      } else {
        setError('მონაცემების ფორმატი არასწორია');
        console.error('API პასუხის არასწორი ფორმატი:', response.data);
      }

    } catch (err) {
      console.error('API შეცდომა:', err);
      setError(err.message || 'მონაცემების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToCart = (product) => {
    console.log('დასამატებელი პროდუქტი:', product);

    if (!product) {
      console.error('პროდუქტი არ არის განსაზღვრული');
      Alert.alert('შეცდომა', 'პროდუქტის დამატება ვერ მოხერხდა');
      return;
    }

    if (!product.id && product.id !== 0) {
      const tempId = `temp_${product.title || 'product'}_${Date.now()}`;
      console.log(`პროდუქტს არ აქვს ID, ვქმნით დროებით ID: ${tempId}`);
      
      const productWithId = { ...product, id: tempId };

      const existingProductIndex = cart.findIndex(item => item.id === tempId);
      
      if (existingProductIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...productWithId, quantity: 1 }]);
      }
    } else {
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
    
    Alert.alert('წარმატებით დაემატა', 'პროდუქტი კალათაში დაემატა');
  };

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error('პროდუქტის ID არ არის მითითებული');
      return;
    }
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!productId) {
      console.error('პროდუქტის ID არ არის მითითებული');
      return;
    }
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    setIsCartVisible(false);
  };

  const calculateTotal = () => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) return 0;
    
    return cart.reduce((total, item) => {
      if (!item) return total;
      const price = parseFloat(item.price || item.cost || 0);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const ResponseDebugView = ({ response }) => {
    if (!response) return null;

    const renderObject = (obj, level = 0) => {
      if (!obj || typeof obj !== 'object') {
        return <Text style={styles.debugValue}>{String(obj)}</Text>;
      }

      const keys = Object.keys(obj);
      return (
        <View style={{ marginLeft: level * 10 }}>
          {keys.map(key => (
            <View key={key}>
              <Text style={styles.debugKey}>{key}:
                {Array.isArray(obj[key])
                  ? ` [Array: ${obj[key].length} ელემენტი]`
                  : typeof obj[key] === 'object' && obj[key] !== null
                    ? ' [Object]'
                    : ` ${String(obj[key]).substring(0, 50)}`
                }
              </Text>
            </View>
          ))}
        </View>
      );
    };

    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>API პასუხის სტრუქტურა:</Text>
        <ScrollView style={styles.debugScroll}>
          {renderObject(response)}
        </ScrollView>
      </View>
    );
  };

  const getProductImages = (item) => {
    if (!item) return ['https://via.placeholder.com/400x300?text=No+Image'];
    
    console.log('პროდუქტის სრული ობიექტი:', JSON.stringify(item, null, 2));

    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      console.log('ნაპოვნია photos მასივი:', item.photos.length);
      return item.photos.map(photo => {
        console.log('ფოტო ობიექტი:', photo);
        if (typeof photo === 'string') return photo;
        return photo.url || photo.thumbnailUrl || photo.src || photo.path || photo;
      });
    }
    
    const photoKeys = Object.keys(item).filter(key =>
      key.includes('photo') || key.includes('image') || key.includes('picture') || key.includes('thumbnail')
    );

    if (photoKeys.length > 0) {
      console.log('ნაპოვნია შესაძლო ფოტოს ველები:', photoKeys);
      for (const key of photoKeys) {
        const value = item[key];
        if (value) {
          if (typeof value === 'string' && (value.includes('http') || value.includes('/') || value.includes('.jpg') || value.includes('.png'))) {
            console.log(`გამოყენებულია ${key} ველი:`, value);
            return [value];
          } else if (Array.isArray(value) && value.length > 0) {
            console.log(`გამოყენებულია ${key} მასივი:`, value.length);
          }
        }
      }
    }

    return ['https://via.placeholder.com/400x300?text=No+Image'];
  };

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

  const handleProductPress = (item) => {
    setCurrentImageIndex(0);
    setSelectedProduct(item);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const goToPreviousImage = () => {
    if (!selectedProduct) return;

    const images = getProductImages(selectedProduct);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    if (!selectedProduct) return;

    const images = getProductImages(selectedProduct);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.productCard}>
          <Image
            source={{ uri: getThumbnailUrl(item) }}
            style={styles.productImage}
            resizeMode="cover"
          />

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
              {item.title || item.name || 'უსახელო პროდუქტი'}
            </Text>

            <Text style={styles.productPrice}>
              {formatPrice(item.price || item.cost)}
            </Text>

            {item.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            )}
            <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={() => addToCart(item)}
              >
                <Ionicons name="cart-outline" size={16} color="#fff" />
                <Text style={styles.addToCartButtonText}>კალათაში დამატება</Text>
              </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  const renderProductDetails = () => {
    if (!selectedProduct) return null;

    const images = getProductImages(selectedProduct);

    return (
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        onRequestClose={closeProductDetails}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeProductDetails} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>პროდუქტის დეტალები</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.imageSliderContainer}>
              <Image
                source={{ uri: getThumbnailUrl(selectedProduct) }}
                style={styles.detailImage}
                resizeMode="contain"
              />

              {images.length > 0 && (
                <>
                  <TouchableOpacity
                    style={[styles.imageNavButton, styles.prevButton]}
                    onPress={goToPreviousImage}
                  >
                    <Ionicons name="chevron-back" size={30} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.imageNavButton, styles.nextButton]}
                    onPress={goToNextImage}
                  >
                    <Ionicons name="chevron-forward" size={30} color="#fff" />
                  </TouchableOpacity>

                  <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>
                      {currentImageIndex + 1}/{images.length}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {images.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.thumbnailsContainer}
                contentContainerStyle={styles.thumbnailsContent}
              >
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.detailInfoContainer}>
              <Text style={styles.detailTitle}>
                {selectedProduct.title || selectedProduct.name || 'უსახელო პროდუქტი'}
              </Text>
              
              <View style={styles.ratingPriceRow}>
                <Text style={styles.detailPrice}>
                  {formatPrice(selectedProduct.price || selectedProduct.cost)}
                </Text>
              </View>

              {selectedProduct.location && (
                <View style={styles.detailLocation}>
                  <Ionicons name="location" size={16} color="#666" />
                  <Text style={styles.detailLocationText}>{selectedProduct.location}</Text>
                </View>
              )}

              {(selectedProduct.seller || selectedProduct.user) && (
                <View style={styles.sellerContainer}>
                  <Text style={styles.sellerTitle}>გამყიდველი:</Text>
                  <Text style={styles.sellerName}>
                    {(selectedProduct.seller && selectedProduct.seller.name) ||
                     (selectedProduct.user && selectedProduct.user.name) ||
                     'უცნობი გამყიდველი'}
                  </Text>
                </View>
              )}

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.addToCartDetailButton}
                  onPress={() => {
                    addToCart(selectedProduct);
                  }}
                >
                  <Ionicons name="cart" size={18} color="#fff" />
                  <Text style={styles.contactButtonText}>კალათაში დამატება</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="call" size={18} color="#fff" />
                  <Text style={styles.contactButtonText}>დაკავშირება</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderCartModal = () => {
    return (
      <Modal
        visible={isCartVisible}
        animationType="slide"
        onRequestClose={() => setIsCartVisible(false)}
      >
        <CartScreen 
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          closeCart={() => setIsCartVisible(false)}
          calculateTotal={calculateTotal}
        />
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>პროდუქტები</Text>
        <TouchableOpacity 
          style={styles.cartButton} 
          onPress={() => setIsCartVisible(true)}
        >
          <Ionicons name="cart-outline" size={24} color="#333" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff5722" />
          <Text style={styles.loaderText}>იტვირთება...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                {error || 'პროდუქცია ვერ მოიძებნა'}
              </Text>
              <ResponseDebugView response={apiResponse} />
              <Button
                title="ხელახლა ცდა"
                onPress={fetchProducts}
                color="#ff5722"
              />
            </View>
          }
        />
      )}

      {renderProductDetails()}
      {renderCartModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  addToCartDetailButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 14,
  },
  addToCartButton: {
    backgroundColor: '#ff5722',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginTop: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48.5%',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: '#666',
  },
  debugContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugScroll: {
    maxHeight: 200,
  },
  debugKey: {
    fontSize: 12,
    color: '#333',
    marginBottom: 3,
  },
  debugValue: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    elevation: 2,
    paddingTop: 30,
  },
  closeButton: {
    paddingTop: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    paddingTop: 30,
  },
  placeholder: {
    width: 24,
  },
  modalContent: {
    paddingBottom: 20,
  },
  imageSliderContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
  },
  thumbnailsContainer: {
    marginTop: 10,
    height: 70,
  },
  thumbnailsContent: {
    paddingHorizontal: 10,
  },
  thumbnailWrapper: {
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#ff5722',
    borderWidth: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  detailInfoContainer: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  detailLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  descriptionContainer: {
    marginTop: 10,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  attributesContainer: {
    marginBottom: 16,
  },
  attributesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  attributeRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attributeName: {
    fontSize: 14,
    color: '#666',
    width: '40%',
  },
  attributeValue: {
    fontSize: 14,
    color: '#333',
    width: '60%',
    fontWeight: '500',
  },
  sellerContainer: {
    marginBottom: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  sellerName: {
    fontSize: 14,
    color: '#555',
  },
  contactButton: {
    backgroundColor: '#ff5722',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 14,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  }
});

export default ProductList;
