import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Navbar } from '../../components/Navbar';
import { ProductCard } from '../../components/ProductCard';
import { ValueProps } from '../../components/ValueProps';
import { listProducts } from '../../lib/catalog';

const { width } = Dimensions.get('window');

const heroSlides = [
  {
    title: "Welcome to Zuka",
    subtitle: "Nigeria's Premium Fashion Destination",
    description: "Experience couture, ready-to-wear, accessories and rare collectibles curated by our stylists.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Luxury Edit for Him",
    subtitle: "Modern Tailoring, Edges and Craft",
    description: "Discover elevated pieces with sharp masculine lines blended with Zuka's royal palette.",
    cta: "Explore Menswear",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Play & Win Rewards",
    subtitle: "Up to ₦100,000 in Prizes",
    description: "Unlock exclusive rewards, VIP fitting experiences and atelier previews while you shop.",
    cta: "Start Playing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
  },
];

const categories = [
  {
    name: "Women's Couture",
    image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
    href: "/shop?gender=women",
  },
  {
    name: "Men's Atelier",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    href: "/shop?gender=men",
  },
  {
    name: "Kids' Wear",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    href: "/shop?gender=kids",
  },
  {
    name: "Traditional Wear",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    href: "/shop?category=traditional",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const womensEdit = listProducts('women').slice(0, 4);
  const mensEdit = listProducts('men').slice(0, 4);
  const featuredProducts = listProducts().slice(0, 8);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      scrollViewRef.current?.scrollTo({
        x: currentSlide * width,
        animated: true,
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const renderHeroSlide = (slide: typeof heroSlides[0], index: number) => (
    <View key={index} style={styles.heroSlide}>
      <Image source={{ uri: slide.image }} style={styles.heroImage} />
      <LinearGradient
        colors={['rgba(75, 15, 123, 0.85)', 'rgba(42, 16, 57, 0.70)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroOverlay}
      />
      <View style={styles.heroContent}>
        <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
        <Text style={styles.heroTitle}>{slide.title}</Text>
        <Text style={styles.heroDescription}>{slide.description}</Text>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push('/shop')}
        >
          <LinearGradient
            colors={['#f4d79d', '#e49b09']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroButtonGradient}
          >
            <Text style={styles.heroButtonText}>{slide.cta}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Navbar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentSlide(slide);
            }}
          >
            {heroSlides.map((slide, index) => renderHeroSlide(slide, index))}
          </ScrollView>
          <View style={styles.dotsContainer}>
            {heroSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Value Props */}
        <ValueProps />

        {/* Shop by Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.badge}>CURATED WORLDS</Text>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <Text style={styles.sectionSubtitle}>
              Blend your persona with Zuka's purple-gold signature.
            </Text>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => router.push(item.href)}
              >
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.categoryOverlay}
                />
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.name}
          />
        </View>

        {/* Women's Luxury Edit */}
        <View style={[styles.section, styles.feminineSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.feminineBadge}>FOR HER</Text>
            <Text style={styles.feminineTitle}>La Maison Femme</Text>
            <Text style={styles.feminineSubtitle}>
              Lilac hues, rose gold trims and sumptuous silk silhouettes.
            </Text>
          </View>
          <FlatList
            data={womensEdit}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            renderItem={({ item }) => (
              <ProductCard
                id={item.id}
                name={item.name}
                price={item.priceNGN}
                imageUrl={item.imageUrl}
                slug={item.slug}
                tone="feminine"
                rating={4.7}
                reviewCount={180}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Men's Luxury Edit */}
        <LinearGradient
          colors={['#15182b', '#1c1a2f', '#312547']}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.masculineBadge}>FOR HIM</Text>
            <Text style={styles.masculineTitle}>Gentlemen's Atelier</Text>
            <Text style={styles.masculineSubtitle}>
              Structured tailoring, midnight velvets, and satin accents.
            </Text>
          </View>
          <FlatList
            data={mensEdit}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            renderItem={({ item }) => (
              <ProductCard
                id={item.id}
                name={item.name}
                price={item.priceNGN}
                imageUrl={item.imageUrl}
                slug={item.slug}
                tone="masculine"
                rating={4.8}
                reviewCount={142}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </LinearGradient>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Zuka Curated Spotlight</Text>
            <Text style={styles.sectionSubtitle}>
              Exclusive drops from our designer vault.
            </Text>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.priceNGN}
                imageUrl={product.imageUrl}
                slug={product.slug}
                rating={4.5}
                reviewCount={150}
              />
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
  heroContainer: {
    height: 500,
    position: 'relative',
  },
  heroSlide: {
    width,
    height: 500,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 60,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 42,
  },
  heroDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButton: {
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  heroButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#570a70',
    fontSize: 16,
    fontWeight: '700',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 32,
    backgroundColor: '#e49b09',
  },
  section: {
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  feminineSection: {
    backgroundColor: '#fff0fa',
  },
  sectionHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  badge: {
    fontSize: 10,
    color: '#570a70',
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
  categoriesList: {
    paddingHorizontal: 4,
    gap: 12,
  },
  categoryCard: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  categoryName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  productsList: {
    paddingHorizontal: 4,
    gap: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  feminineBadge: {
    fontSize: 10,
    color: '#e246a4',
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700',
  },
  feminineTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e246a4',
    marginBottom: 8,
  },
  feminineSubtitle: {
    fontSize: 16,
    color: '#a83b84',
    textAlign: 'center',
    maxWidth: 300,
  },
  masculineBadge: {
    fontSize: 10,
    color: '#e49b09',
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700',
  },
  masculineTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  masculineSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    maxWidth: 300,
  },
});

