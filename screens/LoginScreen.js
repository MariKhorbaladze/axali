import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../utils/authContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('შეცდომა', 'გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('შეცდომა', result.error || 'დალოგინების შეცდომა');
      }
    } catch (error) {
      Alert.alert('შეცდომა', 'დალოგინების დროს მოხდა შეცდომა');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>MyMarket</Text>
        <Text style={styles.appName}>მაიმარკეტი</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>ელფოსტა</Text>
        <TextInput
          style={styles.input}
          placeholder="თქვენი ელფოსტა"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>პაროლი</Text>
        <TextInput
          style={styles.input}
          placeholder="თქვენი პაროლი"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.loginButtonText}>შესვლა</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>არ გაქვთ ანგარიში? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>რეგისტრაცია</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.demoNotice}>
        <Text style={styles.demoText}>
          დემო მონაცემები: user@example.com / password
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fc0',
  },
  appName: {
    fontSize: 18,
    marginTop: 10,
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#fc0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#333',
    fontWeight: 'bold',
  },
  demoNotice: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  demoText: {
    color: '#666',
    fontSize: 12,
  },
});

export default LoginScreen;