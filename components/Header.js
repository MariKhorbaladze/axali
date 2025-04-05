import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../utils/authContext';

const Header = ({ title, showLogout = false, navigation }) => {
  const { logout } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>MyMarket</Text>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {showLogout && (
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoContainer: {
    width: 100,
    height: 40,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fc0'
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 4,
  },
});

export default Header;