import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Navbar } from '../components/Navbar';
import * as Clipboard from 'expo-clipboard';

export default function RewardsPage() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const currentPoints = 420;
  const nextTierPoints = 1000;
  const progressPercentage = (currentPoints / nextTierPoints) * 100;

  const activeRewards = [
    {
      id: '1',
      title: 'Welcome to Zuka',
      description: 'Exclusive discount for new members',
      code: 'ZUKA10',
      value: '10% OFF',
      expiresIn: '7 days',
      type: 'discount',
    },
    {
      id: '2',
      title: 'Free Delivery',
      description: 'On your next purchase',
      value: 'Free Shipping',
      expiresIn: '14 days',
      type: 'shipping',
    },
    {
      id: '3',
      title: 'Birthday Month Special',
      description: 'Celebrate with us',
      code: 'BDAY20',
      value: '20% OFF',
      expiresIn: '30 days',
      type: 'exclusive',
    },
  ];

  const pointsRewards = [
    { points: 500, reward: '₦5,000 OFF', available: true },
    { points: 1000, reward: '₦12,000 OFF', available: true },
    { points: 2000, reward: '₦30,000 OFF', available: false },
    { points: 5000, reward: 'VIP Access + ₦100,000 OFF', available: false },
  ];

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    Alert.alert('Copied!', `Coupon code ${code} copied to clipboard`);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#10b981', '#eab308', '#10b981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerBadge}>
              <Ionicons name="star" size={16} color="#fff" />
              <Text style={styles.headerBadgeText}>Rewards Hub</Text>
            </View>
            <Text style={styles.headerTitle}>Zuka Rewards</Text>
            <Text style={styles.headerSubtitle}>Turn your shopping into savings</Text>
          </View>
        </LinearGradient>

        {/* Points Overview */}
        <View style={styles.pointsCard}>
          <LinearGradient
            colors={['#fff7e1', '#fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pointsGradient}
          >
            <View style={styles.pointsHeader}>
              <View style={styles.pointsIconContainer}>
                <Ionicons name="diamond" size={32} color="#fff" />
              </View>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsLabel}>Your Points Balance</Text>
                <Text style={styles.pointsSubtext}>Keep earning to unlock more rewards</Text>
              </View>
            </View>

            <View style={styles.pointsDisplay}>
              <Text style={styles.pointsValue}>{currentPoints}</Text>
              <Text style={styles.pointsUnit}>points</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Progress to Gold Tier</Text>
                <Text style={styles.progressValue}>{nextTierPoints - currentPoints} points to go</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#eab308', '#f59e0b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                />
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/shop')}
              >
                <LinearGradient
                  colors={['#eab308', '#f59e0b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="bag-outline" size={20} color="#333" />
                  <Text style={styles.actionButtonText}>Shop & Earn</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButtonSecondary}
                onPress={() => router.push('/games')}
              >
                <Ionicons name="flash-outline" size={20} color="#570a70" />
                <Text style={styles.actionButtonSecondaryText}>Play Games</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Active Coupons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ticket-outline" size={24} color="#eab308" />
            <Text style={styles.sectionTitle}>Your Active Coupons</Text>
          </View>

          {activeRewards.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardContent}>
                <View
                  style={[
                    styles.rewardIcon,
                    reward.type === 'discount' && styles.rewardIconDiscount,
                    reward.type === 'shipping' && styles.rewardIconShipping,
                    reward.type === 'exclusive' && styles.rewardIconExclusive,
                  ]}
                >
                  <Ionicons
                    name={
                      reward.type === 'discount'
                        ? 'pricetag-outline'
                        : reward.type === 'shipping'
                        ? 'gift-outline'
                        : 'sparkles-outline'
                    }
                    size={24}
                    color={
                      reward.type === 'discount'
                        ? '#eab308'
                        : reward.type === 'shipping'
                        ? '#3b82f6'
                        : '#10b981'
                    }
                  />
                </View>
                <View style={styles.rewardDetails}>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>

                  {reward.code && (
                    <TouchableOpacity
                      style={styles.codeContainer}
                      onPress={() => copyCode(reward.code!)}
                    >
                      <Text style={styles.codeText}>{reward.code}</Text>
                      <Ionicons
                        name={copiedCode === reward.code ? 'checkmark-circle' : 'copy-outline'}
                        size={20}
                        color={copiedCode === reward.code ? '#10b981' : '#eab308'}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.rewardMeta}>
                    <View style={styles.rewardBadge}>
                      <Text style={styles.rewardBadgeText}>{reward.value}</Text>
                    </View>
                    <View style={styles.rewardExpiry}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.rewardExpiryText}>Expires in {reward.expiresIn}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.useButton}
                onPress={() => router.push('/shop')}
              >
                <Text style={styles.useButtonText}>Use</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Redeem Points */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy-outline" size={24} color="#eab308" />
            <Text style={styles.sectionTitle}>Redeem Points</Text>
          </View>

          <View style={styles.redeemGrid}>
            {pointsRewards.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.redeemCard,
                  !item.available && styles.redeemCardDisabled,
                ]}
              >
                <View style={styles.redeemHeader}>
                  <View style={styles.redeemPoints}>
                    <Ionicons
                      name="diamond"
                      size={20}
                      color={item.available ? '#eab308' : '#999'}
                    />
                    <Text
                      style={[
                        styles.redeemPointsValue,
                        !item.available && styles.redeemPointsValueDisabled,
                      ]}
                    >
                      {item.points}
                    </Text>
                  </View>
                  {item.available && (
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableBadgeText}>Available</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.redeemReward}>{item.reward}</Text>
                <Text style={styles.redeemDescription}>
                  Discount voucher for your next purchase
                </Text>
                {item.available ? (
                  <TouchableOpacity style={styles.redeemButton}>
                    <Text style={styles.redeemButtonText}>Redeem Now</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.redeemDisabled}>
                    <Ionicons name="flash-outline" size={14} color="#999" />
                    <Text style={styles.redeemDisabledText}>
                      {item.points - currentPoints} more points needed
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  pointsCard: {
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eab308',
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pointsGradient: {
    padding: 24,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  pointsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eab308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#666',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    gap: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#eab308',
  },
  pointsUnit: {
    fontSize: 20,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#eab308',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '700',
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0d4ff',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonSecondaryText: {
    color: '#570a70',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIconDiscount: {
    backgroundColor: '#fef3c7',
  },
  rewardIconShipping: {
    backgroundColor: '#dbeafe',
  },
  rewardIconExclusive: {
    backgroundColor: '#d1fae5',
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0e0e0',
  },
  codeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'monospace',
  },
  rewardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  rewardBadge: {
    backgroundColor: '#eab308',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  rewardExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardExpiryText: {
    fontSize: 12,
    color: '#666',
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#570a70',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  redeemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  redeemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#eab308',
  },
  redeemCardDisabled: {
    opacity: 0.6,
    borderColor: '#e0e0e0',
  },
  redeemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  redeemPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  redeemPointsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#eab308',
  },
  redeemPointsValueDisabled: {
    color: '#999',
  },
  availableBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  redeemReward: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  redeemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  redeemButton: {
    backgroundColor: '#eab308',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '700',
  },
  redeemDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  redeemDisabledText: {
    fontSize: 12,
    color: '#999',
  },
});

