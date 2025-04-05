import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    if (email === 'user@example.com' && password === 'password') {
      const userData = { id: 1, email, name: 'დემო მომხმარებელი' };
      try {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } catch (error) {
        console.log('Error saving user data:', error);
        return { success: false, error: 'მონაცემების შენახვის შეცდომა' };
      }
    }
    return { success: false, error: 'არასწორი ელფოსტა ან პაროლი' };
  };

  const register = async (name, email, password) => {
    // რეალურ აპში აქ API მოთხოვნა უნდა გაიგზავნოს
    try {
      const userData = { id: Date.now(), email, name };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log('Error during registration:', error);
      return { success: false, error: 'რეგისტრაციის შეცდომა' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};