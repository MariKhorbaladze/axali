// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
// import axios from 'axios';

// const API_URL = 'https://api.mymarket.ge/api/ka/products';

// const MyMarketApp = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       setRefreshing(true);
//       setError(null);
      
//       const response = await axios.get(API_URL, {
//         params: {
//           Page: 1,
//           PageSize: 20,
//           Sort: 'date_desc' 
//         },
//         timeout: 10000
//       });
      
//       if (response.data?.data?.items) {
//         setProducts(response.data.data.items);
//       } else {
//         throw new Error('Invalid API response structure');
//       }
//     } catch (error) {
//       console.error('API error:', error);
//       setError('Failed to load products. Please try again later.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const renderProductItem = ({ item }) => (
//     <View style={styles.productCard}>
//       <Image 
//         source={{ uri: item.image }} 
//         style={styles.productImage}
//         resizeMode="cover"
//       />
//       <View style={styles.productInfo}>
//         <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        
//         <View style={styles.priceContainer}>
//           <Text style={styles.productPrice}>{item.price} ₾</Text>
//           {item.old_price && (
//             <Text style={styles.oldPrice}>{item.old_price} ₾</Text>
//           )}
//         </View>
        
//         <Text style={styles.productLocation}>{item.city}</Text>
//         <Text style={styles.productDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
//       </View>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FF6B00" />
//         <Text style={styles.loadingText}>Loading products...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <Text style={styles.retryText} onPress={fetchProducts}>
//           Tap to retry
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={products}
//       renderItem={renderProductItem}
//       keyExtractor={item => item.id.toString()}
//       contentContainerStyle={styles.listContent}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={fetchProducts}
//           colors={['#FF6B00']}
//           tintColor="#FF6B00"
//         />
//       }
//       ListEmptyComponent={
//         <View style={styles.emptyContainer}>
//           <Text>No products found</Text>
//         </View>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#555',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   retryText: {
//     color: '#FF6B00',
//     fontSize: 16,
//   },
//   listContent: {
//     padding: 10,
//   },
//   productCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     marginBottom: 15,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   productImage: {
//     width: '100%',
//     height: 200,
//   },
//   productInfo: {
//     padding: 15,
//   },
//   productTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   productPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FF6B00',
//     marginRight: 10,
//   },
//   oldPrice: {
//     fontSize: 14,
//     color: '#999',
//     textDecorationLine: 'line-through',
//   },
//   productLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   productDate: {
//     fontSize: 12,
//     color: '#999',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
// });

// export default MyMarketApp;