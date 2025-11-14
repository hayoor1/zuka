import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await AsyncStorage.setItem('userToken', 'mock-token');
      await AsyncStorage.setItem('hasSeenAuth', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await AsyncStorage.setItem('userToken', 'mock-token');
      await AsyncStorage.setItem('hasSeenAuth', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    await AsyncStorage.setItem('hasSeenAuth', 'true');
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#2a1039', '#4b0f7b', '#6b1f9b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#f8d572', '#f6c248']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoGradient}
            >
              <Text style={styles.logo}>ZUKA</Text>
            </LinearGradient>
            <Text style={styles.tagline}>Nigeria's Luxury Fashion</Text>
          </View>

          {/* Auth Card */}
          <View style={styles.authCard}>
            {/* Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isSignIn && styles.toggleButtonActive]}
                onPress={() => setIsSignIn(true)}
              >
                <Text style={[styles.toggleText, isSignIn && styles.toggleTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isSignIn && styles.toggleButtonActive]}
                onPress={() => setIsSignIn(false)}
              >
                <Text style={[styles.toggleText, !isSignIn && styles.toggleTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            {!isSignIn && (
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {isSignIn && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Sign In/Up Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={isSignIn ? handleSignIn : handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={['#2a1039', '#4b0f7b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Button */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuest}
            >
              <LinearGradient
                colors={['#f8e4b8', '#e3c268']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.guestButtonGradient}
              >
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#4b0f7b" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={20} color="#4b0f7b" />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Join Zuka & Get</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="diamond-outline" size={20} color="#e3c268" />
                <Text style={styles.benefitText}>Earn Royale Points</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="gift-outline" size={20} color="#e3c268" />
                <Text style={styles.benefitText}>Exclusive Rewards</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="star-outline" size={20} color="#e3c268" />
                <Text style={styles.benefitText}>Early Access</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4b0f7b',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  authCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4b0f7b',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4b0f7b',
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  guestButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  guestButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#4b0f7b',
    fontSize: 16,
    fontWeight: '700',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b0f7b',
  },
  benefitsContainer: {
    alignItems: 'center',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
});

