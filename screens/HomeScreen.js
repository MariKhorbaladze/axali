import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, ScrollView, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('მოთხოვნის დაწყება...');
      
      const endpoints = [
        {
          url: 'https://api.mymarket.ge/api/ka/products',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            limit: 20,
            page: 1,
            sort: 'newest'
          })
        },
        {
          url: 'https://api.mymarket.ge/api/product/products',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        },
        {
          url: 'https://api.mymarket.ge/api/v1/products',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      ];
      
      let response;
      let endpointIndex = 0;
      let success = false;
      
      while (!success && endpointIndex < endpoints.length) {
        const endpoint = endpoints[endpointIndex];
        try {
          console.log(`ვცდით endpoint #${endpointIndex + 1}: ${endpoint.url}`);
          
          response = await fetch(endpoint.url, {
            method: endpoint.method,
            headers: endpoint.headers,
            body: endpoint.method === 'POST' ? endpoint.body : undefined
          });
          
          if (response.ok) {
            success = true;
            console.log(`წარმატებით დაუკავშირდა endpoint-ს: ${endpoint.url}`);
          } else {
            console.log(`endpoint-ს დაბრუნების კოდი: ${response.status}`);
            endpointIndex++;
          }
        } catch (error) {
          console.log(`endpoint შეცდომა: ${error.message}`);
          endpointIndex++;
        }
      }
      
      if (!success) {
        throw new Error('ვერცერთი API endpoint არ იმუშავა');
      }
      
      console.log('სტატუსი კოდი:', response.status);
      
      const responseText = await response.text();
      
      if (responseText.length > 1000) {
        console.log('API პასუხი (ტექსტური, პირველი 1000 სიმბოლო):', responseText.substring(0, 1000) + '...');
      } else {
        console.log('API პასუხი (ტექსტური):', responseText);
      }
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('API პასუხი (JSON):', JSON.stringify(responseData, null, 2));
      } catch (parseError) {
        console.error('JSON პარსინგის შეცდომა:', parseError);
        setError('JSON პარსინგის შეცდომა: ' + parseError.message);
        setApiResponse({ rawText: responseText });
        setIsLoading(false);
        return;
      }
      
      setApiResponse(responseData);
      
      console.log('პასუხის ტიპი:', typeof responseData);
      
      let foundProducts = [];
      
      const topLevelKeys = Object.keys(responseData || {});
      console.log('ზედა დონის გასაღებები:', topLevelKeys);
      
      if (responseData && typeof responseData === 'object') {
        for (const key of topLevelKeys) {
          if (Array.isArray(responseData[key])) {
            console.log(`ნაპოვნია მასივი ველში "${key}" (${responseData[key].length} ელემენტი)`);
            
            if (responseData[key].length > 0) {
              console.log(`პირველი ელემენტის ველები:`, Object.keys(responseData[key][0]));
              
              const isProductArray = responseData[key][0] && (
                responseData[key][0].title || 
                responseData[key][0].name || 
                responseData[key][0].product_title ||
                responseData[key][0].price || 
                responseData[key][0].photos || 
                responseData[key][0].thumbnail_photo ||
                responseData[key][0].main_photo ||
                responseData[key][0].images
              );
              
              if (isProductArray) {
                console.log(`ველში "${key}" ნაპოვნია პროდუქტების მსგავსი მონაცემები`);
                foundProducts = responseData[key];
                break;
              }
            }
          } else if (responseData[key] && typeof responseData[key] === 'object') {
            const nestedKeys = Object.keys(responseData[key]);
            console.log(`ჩადგმული ობიექტი ველში "${key}", გასაღებები:`, nestedKeys);
            
            if (key === 'data' && responseData[key].products && Array.isArray(responseData[key].products)) {
              console.log(`ნაპოვნია პროდუქტები data.products ველში (${responseData[key].products.length} ელემენტი)`);
              foundProducts = responseData[key].products;
              break;
            }
            
            if (key === 'result' && responseData[key].products && Array.isArray(responseData[key].products)) {
              console.log(`ნაპოვნია პროდუქტები result.products ველში (${responseData[key].products.length} ელემენტი)`);
              foundProducts = responseData[key].products;
              break;
            }
            
            for (const nestedKey of nestedKeys) {
              if (Array.isArray(responseData[key][nestedKey])) {
                console.log(`ნაპოვნია მასივი ველში "${key}.${nestedKey}" (${responseData[key][nestedKey].length} ელემენტი)`);
                
                if (responseData[key][nestedKey].length > 0) {
                  console.log(`პირველი ელემენტის ველები:`, Object.keys(responseData[key][nestedKey][0] || {}));
                  
                  const isProductArray = responseData[key][nestedKey][0] && (
                    responseData[key][nestedKey][0].title || 
                    responseData[key][nestedKey][0].name || 
                    responseData[key][nestedKey][0].product_title ||
                    responseData[key][nestedKey][0].price || 
                    responseData[key][nestedKey][0].photos || 
                    responseData[key][nestedKey][0].thumbnail_photo ||
                    responseData[key][nestedKey][0].main_photo ||
                    responseData[key][nestedKey][0].images
                  );
                  
                  if (isProductArray) {
                    console.log(`ველში "${key}.${nestedKey}" ნაპოვნია პროდუქტების მსგავსი მონაცემები`);
                    foundProducts = responseData[key][nestedKey];
                    break;
                  }
                }
              }
            }
            
            if (foundProducts.length > 0) break;
          }
        }
      }
      
      if (responseData && responseData.products && Array.isArray(responseData.products)) {
        console.log(`ნაპოვნია პროდუქტები მთავარ products ველში (${responseData.products.length} ელემენტი)`);
        foundProducts = responseData.products;
      }
      
      else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        console.log(`ნაპოვნია პროდუქტები items ველში (${responseData.items.length} ელემენტი)`);
        foundProducts = responseData.items;
      }
      
      else if (responseData && responseData.data && responseData.data.products && Array.isArray(responseData.data.products)) {
        console.log(`ნაპოვნია პროდუქტები data.products ველში (${responseData.data.products.length} ელემენტი)`);
        foundProducts = responseData.data.products;
      }
      
      else if (responseData && responseData.result && responseData.result.products && Array.isArray(responseData.result.products)) {
        console.log(`ნაპოვნია პროდუქტები result.products ველში (${responseData.result.products.length} ელემენტი)`);
        foundProducts = responseData.result.products;
      }
      
      console.log(`ნაპოვნია ${foundProducts.length} პროდუქტი`);
      setProducts(foundProducts);
      
      if (foundProducts.length === 0) {
        setError('პროდუქცია ვერ მოიძებნა (API პასუხის სტრუქტურას წარწერაში ნახავთ)');
      }
    } catch (err) {
      console.error('API შეცდომა:', err);
      setError(err.message || 'მონაცემების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setIsLoading(false);
    }
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
    console.log('პროდუქტის სრული ობიექტი:', JSON.stringify(item, null, 2));
    
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      console.log('ნაპოვნია photos მასივი:', item.photos.length);
      return item.photos.map(photo => {
        console.log('ფოტო ობიექტი:', photo);
        if (typeof photo === 'string') return photo;
        return photo.url || photo.thumbnailUrl || photo.src || photo.path || photo;
      });
    }
    
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      console.log('ნაპოვნია images მასივი:', item.images.length);
      return item.images.map(image => {
        if (typeof image === 'string') return image;
        return image.url || image.thumbnailUrl || image.src || image.path || image;
      });
    }
    
    if (item.thumbnail_photo) {
      console.log('ნაპოვნია thumbnail_photo:', item.thumbnail_photo);
      const thumbUrl = typeof item.thumbnail_photo === 'string' 
        ? item.thumbnail_photo 
        : (item.thumbnail_photo.url || item.thumbnail_photo.path || JSON.stringify(item.thumbnail_photo));
      return [thumbUrl];
    }
    
    if (item.main_photo) {
      console.log('ნაპოვნია main_photo:', item.main_photo);
      const mainUrl = typeof item.main_photo === 'string' 
        ? item.main_photo 
        : (item.main_photo.url || item.main_photo.path || JSON.stringify(item.main_photo));
      return [mainUrl];
    }
    
    if (item.primary_photo) {
      console.log('ნაპოვნია primary_photo:', item.primary_photo);
      const primaryUrl = typeof item.primary_photo === 'string' 
        ? item.primary_photo 
        : (item.primary_photo.url || item.primary_photo.path || JSON.stringify(item.primary_photo));
      return [primaryUrl];
    }
    
    if (item.image) {
      console.log('ნაპოვნია image ველი:', item.image);
      const imgUrl = typeof item.image === 'string' 
        ? item.image 
        : (item.image.url || item.image.thumbnailUrl || item.image.src || item.image.path || JSON.stringify(item.image));
      return [imgUrl];
    }
    
    if (item.thumbnail) {
      console.log('ნაპოვნია thumbnail ველი:', item.thumbnail);
      const thumbUrl = typeof item.thumbnail === 'string' 
        ? item.thumbnail 
        : (item.thumbnail.url || item.thumbnail.path || JSON.stringify(item.thumbnail));
      return [thumbUrl];
    }
    
    if (item.thumbnail_photos && Array.isArray(item.thumbnail_photos) && item.thumbnail_photos.length > 0) {
      console.log('ნაპოვნია thumbnail_photos მასივი:', item.thumbnail_photos.length);
      return item.thumbnail_photos.map(thumb => {
        if (typeof thumb === 'string') return thumb;
        return thumb.url || thumb.path || thumb.src || JSON.stringify(thumb);
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
            return value.map(v => {
              if (typeof v === 'string') return v;
              return v.url || v.path || v.src || JSON.stringify(v);
            });
          } else if (typeof value === 'object' && value !== null) {
            const imgUrl = value.url || value.path || value.src;
            if (imgUrl) {
              console.log(`გამოყენებულია ${key}.url/path/src ველი:`, imgUrl);
              return [imgUrl];
            }
          }
        }
      }
    }
    
    console.log('ვერ მოიძებნა ფოტო პროდუქტში, ID:', item.id);
    console.log('ველები:', Object.keys(item));
    
    return ['https://via.placeholder.com/400x300?text=No+Image'];
  };

  const getThumbnailUrl = (item) => {
    const images = getProductImages(item);
    return images[0];
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₾';
    
    return parseFloat(price).toFixed(2).replace(/\.00$/, '') + ' ₾';
  };

  const getRating = (item) => {
    if (item.rating !== undefined) {
      return item.rating;
    }
    
    if (item.stars !== undefined) {
      return item.stars;
    }
    
    if (item.rate !== undefined) {
      return item.rate;
    }
    
    return (Math.random() * 3 + 2).toFixed(1);
  };

  const RatingStars = ({ rating, size = 16 }) => {
    const numRating = parseFloat(rating) || 0;
    const maxStars = 5;
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(maxStars)].map((_, index) => {
          if (index + 1 <= numRating) {
            return <Ionicons key={index} name="star" size={size} color="#FFD700" />;
          }
          else if (index + 0.5 <= numRating) {
            return <Ionicons key={index} name="star-half" size={size} color="#FFD700" />;
          }
          else {
            return <Ionicons key={index} name="star-outline" size={size} color="#FFD700" />;
          }
        })}
        <Text style={styles.ratingText}>{numRating.toFixed(1)}</Text>
      </View>
    );
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

  const renderItem = ({ item }) => (
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
          
          <RatingStars rating={getRating(item)} size={14} />
          
          {item.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
                source={{ uri: images[currentImageIndex] }} 
                style={styles.detailImage}
                resizeMode="contain"
              />
              
              {images.length > 1 && (
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
                    style={[
                      styles.thumbnailWrapper,
                      currentImageIndex === index ? styles.activeThumbnail : null
                    ]}
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
                <RatingStars rating={getRating(selectedProduct)} size={18} />
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
              
              {selectedProduct.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>აღწერა:</Text>
                  <Text style={styles.descriptionText}>{selectedProduct.description}</Text>
                </View>
              )}
              
              {selectedProduct.attributes && selectedProduct.attributes.length > 0 && (
                <View style={styles.attributesContainer}>
                  <Text style={styles.attributesTitle}>მახასიათებლები:</Text>
                  {selectedProduct.attributes.map((attr, index) => (
                    <View key={index} style={styles.attributeRow}>
                      <Text style={styles.attributeName}>{attr.name}:</Text>
                      <Text style={styles.attributeValue}>{attr.value}</Text>
                    </View>
                  ))}
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
              
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.contactButtonText}>დაკავშირება</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>პროდუქტები</Text>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff5722" />
          <Text style={styles.loaderText}>იტვირთება...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 8,
    color: '#333',
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
    marginBottom: 8,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
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
  
  // მოდალის სტილები
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
    marginBottom: 12,
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
    marginTop: 16,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  }
});

export default ProductList;