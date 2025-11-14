import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatNGN } from '../lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const total = 2800000;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            placeholderTextColor="#999"
            multiline
          />
          <View style={styles.row}>
            <TextInput
              placeholder="City"
              style={[styles.input, styles.halfInput]}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="State"
              style={[styles.input, styles.halfInput]}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="card-outline" size={24} color="#4b0f7b" />
            <Text style={styles.paymentText}>Paystack</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="card-outline" size={24} color="#4b0f7b" />
            <Text style={styles.paymentText}>Flutterwave</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatNGN(2800000)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatNGN(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            // Handle checkout
            router.push('/');
          }}
        >
          <LinearGradient
            colors={['#2a1039', '#4b0f7b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutText}>Place Order</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    color: '#333',
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

