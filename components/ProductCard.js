// // import React from 'react';
// // import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useCart } from '../utils/cartContext';

// // const ProductCard = ({ product, onPress }) => {
// //   const { addToCart } = useCart();

// //   return (
// //     <TouchableOpacity style={styles.card} onPress={onPress}>
// //       <Image
// //         source={{ uri: product.image }}
// //         style={styles.image}
// //         resizeMode="contain"
// //       />
// //       <View style={styles.content}>
// //         <Text style={styles.title} numberOfLines={2}>
// //           {product.title}
// //         </Text>
// //         <Text style={styles.category}>{product.category}</Text>
// //         <View style={styles.footer}>
// //           <Text style={styles.price}>{product.price.toFixed(2)} ₾</Text>
// //           <TouchableOpacity
// //             style={styles.addButton}
// //             onPress={(e) => {
// //               e.stopPropagation();
// //               addToCart(product);
// //             }}
// //           >
// //             <Ionicons name="cart-outline" size={20} color="#333" />
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   card: {
// //     backgroundColor: 'white',
// //     borderRadius: 8,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //     margin: 8,
// //     overflow: 'hidden',
// //     width: '45%',
// //   },
// //   image: {
// //     height: 150,
// //     width: '100%',
// //     backgroundColor: '#f9f9f9',
// //   },
// //   content: {
// //     padding: 12,
// //   },
// //   title: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     marginBottom: 4,
// //   },
// //   category: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginBottom: 8,
// //   },
// //   footer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   price: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   addButton: {
// //     backgroundColor: '#fc0',
// //     borderRadius: 20,
// //     padding: 6,
// //   },
// // });

// // export default ProductCard;

// import React from 'react';
// import { 
//   View, 
//   Text, 
//   Image, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Dimensions,
//   Alert
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');
// const cardWidth = (width - 24) / 2;


// const ProductCard = ({ product }) => {
//   const { id, title, price, image, discount } = product;
  
//   const handleAddToCart = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem('cart');
//       const existingItems = jsonValue != null ? JSON.parse(jsonValue) : [];
      
//       const existingItemIndex = existingItems.findIndex(item => item.id === id);
      
//       if (existingItemIndex !== -1) {
//         existingItems[existingItemIndex].quantity += 1;
//       } else {
//         existingItems.push({ ...product, quantity: 1 });
//       }
      
//       await AsyncStorage.setItem('cart', JSON.stringify(existingItems));
//       Alert.alert('წარმატება', 'პროდუქტი დაემატა კალათაში');
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('შეცდომა', 'პროდუქტის დამატება ვერ მოხერხდა');
//     }
//   };

//   return (
//     <View style={styles.card}>
//       {discount > 0 && (
//         <View style={styles.discountBadge}>
//           <Text style={styles.discountText}>-{discount}%</Text>
//         </View>
        
//       )}
//       <TouchableOpacity 
//   style={styles.addToCartButton}
//   onPress={handleAddToCart}
// >
//   <Ionicons name="cart" size={18} color="#fff" />
//   <Text style={styles.addToCartButtonText}>კალათაში დამატება</Text>
// </TouchableOpacity>
      
//       <Image
//         source={{ uri: image }}
//         style={styles.image}
//         resizeMode="cover"
//       />
      
//       <View style={styles.cardContent}>
//         <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
//         <View style={styles.priceContainer}>
//           <Text style={styles.price}>{price.toFixed(2)} ₾</Text>
//           {discount > 0 && (
//             <Text style={styles.oldPrice}>
//               {(price / (1 - discount / 100)).toFixed(2)} ₾
//             </Text>
//           )}
//         </View>
        
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={handleAddToCart}
//         >
//           <Ionicons name="cart" size={18} color="#fff" />
//           <Text style={styles.addButtonText}>კალათში</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// const addToCart = (product) => {
//   const existingProduct = cart.find(item => item.id === product.id);
  
//   if (existingProduct) {
//     const updatedCart = cart.map(item => 
//       item.id === product.id 
//         ? { ...item, quantity: item.quantity + 1 } 
//         : item
//     );
//     setCart(updatedCart);
//   } else {
//     setCart([...cart, { ...product, quantity: 1 }]);
//   }
  
//   Alert.alert(
//     "წარმატებით დაემატა",
//     `"${product.title || product.name || 'პროდუქტი'}" დაემატა კალათში`,
//     [{ text: "კარგი", style: "default" }]
//   );
// };

// const removeFromCart = (productId) => {
//   setCart(cart.filter(item => item.id !== productId));
// };

// const updateQuantity = (productId, newQuantity) => {
//   if (newQuantity <= 0) {
//     removeFromCart(productId);
//     return;
//   }
  
//   const updatedCart = cart.map(item => 
//     item.id === productId 
//       ? { ...item, quantity: newQuantity } 
//       : item
//   );
//   setCart(updatedCart);
// };

// const renderCartContent = () => {
//   return (
//     <Modal
//       visible={isCartVisible}
//       animationType="slide"
//       onRequestClose={() => setIsCartVisible(false)}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={() => setIsCartVisible(false)} style={styles.closeButton}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>ჩემი კალათა</Text>
//           <View style={styles.placeholder} />
//         </View>

//         <FlatList
//           data={cart}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.cartItem}>
//               <Image 
//                 source={{ uri: getThumbnailUrl(item) }} 
//                 style={styles.cartItemImage} 
//               />
              
//               <View style={styles.cartItemInfo}>
//                 <Text style={styles.cartItemTitle}>{item.title || item.name}</Text>
//                 <Text style={styles.cartItemPrice}>{formatPrice(item.price)}</Text>
                
//                 <View style={styles.quantityContainer}>
//                   <TouchableOpacity 
//                     onPress={() => updateQuantity(item.id, item.quantity - 1)}
//                     style={styles.quantityButton}
//                   >
//                     <Text style={styles.quantityButtonText}>-</Text>
//                   </TouchableOpacity>
                  
//                   <Text style={styles.quantityText}>{item.quantity}</Text>
                  
//                   <TouchableOpacity 
//                     onPress={() => updateQuantity(item.id, item.quantity + 1)}
//                     style={styles.quantityButton}
//                   >
//                     <Text style={styles.quantityButtonText}>+</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
              
//               <TouchableOpacity 
//                 onPress={() => removeFromCart(item.id)}
//                 style={styles.removeButton}
//               >
//                 <Ionicons name="trash-outline" size={20} color="#ff5722" />
//               </TouchableOpacity>
//             </View>
//           )}
//           ListEmptyComponent={
//             <View style={styles.emptyCartContainer}>
//               <Ionicons name="cart-outline" size={80} color="#ddd" />
//               <Text style={styles.emptyCartText}>კალათა ცარიელია</Text>
//               <Button 
//                 title="პროდუქტებზე დაბრუნება" 
//                 onPress={() => setIsCartVisible(false)}
//                 color="#ff5722" 
//               />
//             </View>
//           }
//         />
        
//         {cart.length > 0 && (
//           <View style={styles.cartFooter}>
//             <View style={styles.totalContainer}>
//               <Text style={styles.totalText}>ჯამი:</Text>
//               <Text style={styles.totalPrice}>
//                 {formatPrice(
//                   cart.reduce((total, item) => 
//                     total + parseFloat(item.price || 0) * item.quantity, 0
//                   )
//                 )}
//               </Text>
//             </View>
            
//             <TouchableOpacity style={styles.checkoutButton}>
//               <Text style={styles.checkoutButtonText}>შეკვეთის გაფორმება</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: cardWidth,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     overflow: 'hidden',
//     margin: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#e53935',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     zIndex: 1,
//   },
//   discountText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   image: {
//     width: '100%',
//     height: cardWidth,
//   },
//   cardContent: {
//     padding: 12,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 6,
//     height: 40,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#0066cc',
//     marginRight: 6,
//   },
//   oldPrice: {
//     fontSize: 12,
//     color: '#999',
//     textDecorationLine: 'line-through',
//   },
//   addButton: {
//     backgroundColor: '#0066cc',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//     marginLeft: 4,
//   },
// });

// export default ProductCard;