import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './utils/authContext';
import { CartProvider } from './utils/cartContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <AppNavigator />
          </View>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
