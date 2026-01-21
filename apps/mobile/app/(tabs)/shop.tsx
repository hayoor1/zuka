import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';
import { ProductCard } from '../../components/ProductCard';
import { listProducts, type Gender, type Category } from '../../lib/catalog';
import { Ionicons } from '@expo/vector-icons';

export default function ShopPage() {
  const [gender, setGender] = useState<Gender | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get available categories based on selected gender
  const getAvailableCategories = (): Array<{ key: Category | 'all'; label: string }> => {
    const allCategories: Array<{ key: Category | 'all'; label: string }> = [
      { key: 'all', label: 'All Categories' },
      { key: 'tops', label: 'Tops' },
      { key: 'dresses', label: 'Dresses' },
      { key: 'trousers', label: 'Bottoms' },
      { key: 'shoes', label: 'Shoes' },
      { key: 'traditional', label: 'Traditional Wear' },
      { key: 'activewear', label: 'Activewear' },
      { key: 'swimwear', label: 'Swimwear' },
      { key: 'outerwear', label: 'Outerwear' },
      { key: 'bags', label: 'Bags & Accessories' },
      { key: 'jewellery', label: 'Jewellery' },
      { key: 'beauty', label: 'Beauty & Care' },
      { key: 'lingerie', label: 'Lingerie' },
    ];

    if (gender === 'all') {
      return allCategories;
    }

    // Filter categories to only show those that have products for the selected gender
    const availableCategories = allCategories.filter(cat => {
      if (cat.key === 'all') return true;
      const productsForCategory = listProducts(gender, cat.key as Category);
      return productsForCategory.length > 0;
    });

    return availableCategories;
  };

  const categories = getAvailableCategories();

  let products = listProducts(gender === 'all' ? undefined : gender, category === 'all' ? undefined : category)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getReviewCount = (productId: string): number => {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = ((hash << 5) - hash) + productId.charCodeAt(i);
      hash = hash & hash;
    }
    return 50 + (Math.abs(hash) % 200);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shop</Text>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
          >
            <Ionicons name="filter" size={20} color="#570a70" />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>Gender</Text>
            <View style={styles.filterRow}>
              {(['all', 'women', 'men', 'kids'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => {
                    setGender(g);
                    // Reset category when gender changes to show only relevant categories
                    setCategory('all');
                  }}
                  style={[
                    styles.filterChip,
                    gender === g && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      gender === g && styles.filterChipTextActive,
                    ]}
                  >
                    {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                  {gender === g && (
                    <Ionicons name="checkmark" size={14} color="#fff" style={{ marginLeft: 4 }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => {
                      setCategory(c.key);
                      // Reset to 'all' if gender changes and category becomes invalid
                      if (gender !== 'all' && c.key !== 'all') {
                        const productsForCategory = listProducts(gender, c.key as Category);
                        if (productsForCategory.length === 0) {
                          setCategory('all');
                        }
                      }
                    }}
                    style={[
                      styles.filterChip,
                      category === c.key && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        category === c.key && styles.filterChipTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                    {category === c.key && (
                      <Ionicons name="checkmark" size={14} color="#fff" style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.priceNGN}
              imageUrl={product.imageUrl}
              slug={product.slug}
              rating={4.5}
              reviewCount={getReviewCount(product.id)}
            />
          ))}
        </View>

        {products.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#570a70',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#570a70',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0d4ff',
  },
  filterChipActive: {
    backgroundColor: '#570a70',
    borderColor: '#570a70',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

