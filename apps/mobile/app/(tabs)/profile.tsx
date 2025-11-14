import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Navbar } from '../../components/Navbar';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { icon: 'person-outline', label: 'My Profile', color: '#4b0f7b', href: null },
  { icon: 'bag-outline', label: 'My Orders', color: '#4b0f7b', href: null },
  { icon: 'heart-outline', label: 'Wishlist', color: '#c12e6d', href: '/wishlist' },
  { icon: 'diamond-outline', label: 'Rewards & Points', color: '#e3c268', href: '/rewards' },
  { icon: 'trophy-outline', label: 'Leaderboard', color: '#4b0f7b', href: '/ranks' },
  { icon: 'chatbubble-outline', label: 'Shopping Buddy', color: '#10b981', href: '/pet' },
  { icon: 'settings-outline', label: 'Settings', color: '#666', href: null },
  { icon: 'help-circle-outline', label: 'Help & Support', color: '#666', href: null },
];

export default function ProfilePage() {
  const router = useRouter();
  const rewardPoints = 420;
  const userName = 'John Doe';

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#2a1039', '#4b0f7b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#f8d572', '#f6c248']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="diamond" size={16} color="#e3c268" />
            <Text style={styles.pointsText}>{rewardPoints} Royale Points</Text>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => item.href && router.push(item.href)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8ff',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 32,
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4b0f7b',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    fontSize: 14,
    color: '#e3c268',
    fontWeight: '600',
  },
  menuContainer: {
    padding: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

