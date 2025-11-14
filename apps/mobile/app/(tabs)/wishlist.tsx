import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Navbar } from '../../components/Navbar';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistPage() {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>
            Start adding items you love to your wishlist
          </Text>
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

