import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const valueProps = [
  {
    icon: 'truck-outline',
    title: 'Free Shipping',
    description: 'On orders over ₦50,000',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Secure Payment',
    description: '100% secure transactions',
  },
  {
    icon: 'refresh-outline',
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: 'diamond-outline',
    title: 'Rewards Program',
    description: 'Earn points on every purchase',
  },
];

export function ValueProps() {
  return (
    <View style={styles.container}>
      {valueProps.map((prop, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.iconContainer}>
            <Ionicons name={prop.icon as any} size={24} color="#570a70" />
          </View>
          <Text style={styles.title}>{prop.title}</Text>
          <Text style={styles.description}>{prop.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  item: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3e9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

