import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatNGN } from '../lib/utils';

const cartItems = [
  {
    id: '1',
    name: 'Mens Classic Tee',
    price: 850000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    size: 'M',
    color: 'Black',
  },
  {
    id: '2',
    name: 'Lagos Street Hoodie',
    price: 1950000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    size: 'L',
    color: 'Black',
  },
];

export default function CartPage() {
  const router = useRouter();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4b0f7b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push('/shop')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.size} • {item.color}
                  </Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>{formatNGN(item.price)}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity style={styles.quantityButton}>
                        <Ionicons name="remove" size={16} color="#333" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.quantityButton}>
                        <Ionicons name="add" size={16} color="#333" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.removeButton}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatNGN(subtotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {shipping === 0 ? 'Free' : formatNGN(shipping)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatNGN(total)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push('/checkout')}
          >
            <LinearGradient
              colors={['#2a1039', '#4b0f7b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6ff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4b0f7b',
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
    color: '#4b0f7b',
    marginTop: 24,
  },
  shopButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#4b0f7b',
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b0f7b',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4b0f7b',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#f3e9ff',
    borderWidth: 1,
    borderColor: '#e0d4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b0f7b',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  summary: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#4b0f7b',
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b0f7b',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0e6ff',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4b0f7b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4b0f7b',
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0e6ff',
  },
  checkoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  checkoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

