import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function Navbar() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = 2;
  const wishlistCount = 5;
  const rewardPoints = 420;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <LinearGradient
        colors={['#2a1039', '#4b0f7b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBar}
      >
        <Text style={styles.topBarText}>
          ₦50k+ orders ship same-day in Lagos • Earn Royale points on every checkout
        </Text>
      </LinearGradient>

      {/* Main Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <LinearGradient
            colors={['#f8d572', '#f6c248']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logo}>ZUKA</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.rightSection}>
          {/* Search */}
          <TouchableOpacity
            onPress={() => setSearchOpen(!searchOpen)}
            style={styles.iconButton}
          >
            <Ionicons name="search" size={22} color="#4b0f7b" />
          </TouchableOpacity>

          {/* Reward Points */}
          <TouchableOpacity
            onPress={() => router.push('/rewards')}
            style={styles.rewardBadge}
          >
            <LinearGradient
              colors={['#f8e4b8', '#e3c268']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rewardGradient}
            >
              <Ionicons name="diamond" size={14} color="#4b0f7b" />
              <Text style={styles.rewardText}>{rewardPoints}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Wishlist */}
          <TouchableOpacity
            onPress={() => router.push('/wishlist')}
            style={styles.iconButton}
          >
            <View>
              <Ionicons name="heart-outline" size={22} color="#4b0f7b" />
              {wishlistCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{wishlistCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Cart */}
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            style={styles.iconButton}
          >
            <View>
              <Ionicons name="bag-outline" size={22} color="#4b0f7b" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* User */}
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={styles.iconButton}
          >
            <Ionicons name="person-outline" size={22} color="#4b0f7b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {searchOpen && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for products, brands, categories..."
            style={styles.searchInput}
            placeholderTextColor="#999"
            autoFocus
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6ff',
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 20,
      },
    }),
  },
  topBar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  topBarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  logoGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4b0f7b',
    letterSpacing: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  rewardBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  rewardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  rewardText: {
    color: '#4b0f7b',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e3c268',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#4b0f7b',
    fontSize: 9,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
});

