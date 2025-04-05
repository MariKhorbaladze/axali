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
  ScrollView,
} from 'react-native';
import { useAuth } from '../utils/authContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('შეცდომა', 'გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('შეცდომა', 'პაროლები არ ემთხვევა');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name, email, password);
      if (!result.success) {
        Alert.alert('შეცდომა', result.error || 'რეგისტრაციის შეცდომა');
      }
    } catch (error) {
      Alert.alert('შეცდომა', 'რეგისტრაციის დროს მოხდა შეცდომა');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>შექმენით ანგარიში</Text>

          <Text style={styles.label}>სახელი</Text>
          <TextInput
            style={styles.input}
            placeholder="თქვენი სახელი"
            value={name}
            onChangeText={setName}
          />

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
            placeholder="პაროლი"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>გაიმეორეთ პაროლი</Text>
          <TextInput
            style={styles.input}
            placeholder="გაიმეორეთ პაროლი"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <Text style={styles.registerButtonText}>რეგისტრაცია</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>უკვე გაქვთ ანგარიში? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>შესვლა</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
  registerButton: {
    backgroundColor: '#fc0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;