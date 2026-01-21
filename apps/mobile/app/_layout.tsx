import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate loading time for splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const hasSeenAuth = await AsyncStorage.getItem('hasSeenAuth');
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!hasSeenAuth) {
        setIsAuthenticated(false);
      } else if (userToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#3d074e', '#570a70', '#943aa2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(255,255,255,0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 32,
              }}
            >
              <LinearGradient
                colors={['#f2cd84', '#e49b09']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="large" color="#570a70" />
              </LinearGradient>
            </View>
            <ActivityIndicator size="large" color="#e49b09" />
          </View>
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fbf8ff' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="auth" />
        ) : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="shop/[slug]" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="ranks" />
            <Stack.Screen name="rewards" />
            <Stack.Screen name="pet" />
            <Stack.Screen name="games/[id]" />
          </>
        )}
      </Stack>
    </>
  );
}
