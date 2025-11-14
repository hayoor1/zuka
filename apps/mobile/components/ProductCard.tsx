import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatNGN } from '../lib/utils';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

type Tone = 'neutral' | 'feminine' | 'masculine';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  slug: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  tone?: Tone;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  slug,
  badge,
  rating = 4.5,
  reviewCount = 0,
  tone = 'neutral',
}: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toneStyles: Record<Tone, { price: string; points: string; icon: string }> = {
    neutral: {
      price: '#4b0f7b',
      points: '#f3e9ff',
      icon: '#4b0f7b',
    },
    feminine: {
      price: '#c12e6d',
      points: '#ffe8f3',
      icon: '#c12e6d',
    },
    masculine: {
      price: '#f2c46c',
      points: '#1f1e2c',
      icon: '#f2c46c',
    },
  };

  const palette = toneStyles[tone];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/shop/${slug}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={isWishlisted ? '#e04c7c' : palette.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({reviewCount})</Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: palette.price }]}>
            {formatNGN(price)}
          </Text>
          {originalPrice && (
            <Text style={styles.originalPrice}>{formatNGN(originalPrice)}</Text>
          )}
        </View>

        {/* Points */}
        <View style={[styles.pointsContainer, { backgroundColor: palette.points }]}>
          <Ionicons name="sparkles" size={12} color={palette.price} />
          <Text style={[styles.pointsText, { color: palette.price }]}>
            Earn {Math.floor(price / 10000)} pts
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    minHeight: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 2,
  },
  reviews: {
    fontSize: 11,
    color: '#999',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  pointsText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

