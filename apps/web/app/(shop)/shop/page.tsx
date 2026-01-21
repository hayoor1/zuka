'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@gemcart/ui';
import { listProducts, listBrandStats, type Gender, type Category } from '../../../lib/catalog';
import { ProductCard } from '../../../components/ProductCard';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  X
} from 'lucide-react';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [gender, setGender] = useState<Gender | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [brand, setBrand] = useState<string | 'all'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under-500k' | '500k-1m' | '1m-2m' | 'over-2m'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSale, setShowSale] = useState(false);
  
  // Collapsible filter sections
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    brand: false,
    category: false,
    price: false,
  });

  const toggleFilter = (filterName: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const themePresets: Record<'all' | 'women' | 'men', {
    panel: string;
    heading: string;
    subtext: string;
    accentChip: string;
    filterButton: string;
    filterButtonActive: string;
  }> = {
    all: {
      panel: 'bg-white',
      heading: 'text-brand-purple',
      subtext: 'text-gray-600',
      accentChip: 'bg-brand-gold-gradient text-brand-purple',
      filterButton: 'bg-white border border-gray-200 text-gray-700',
      filterButtonActive: 'bg-brand-gradient text-white border-none'
    },
    women: {
      panel: 'bg-gradient-to-br from-[#f9daed] via-[#f6c8e4] to-[#f1e9f4]',
      heading: 'text-[#e246a4]',
      subtext: 'text-[#943aa2]',
      accentChip: 'bg-[#f6c8e4] text-[#e246a4]',
      filterButton: 'bg-white/70 border border-[#f6c8e4] text-[#e246a4]',
      filterButtonActive: 'bg-[#e246a4] text-white border-none'
    },
    men: {
      panel: 'bg-gradient-to-br from-[#3d074e] via-[#570a70] to-[#943aa2] text-white',
      heading: 'text-white',
      subtext: 'text-white/70',
      accentChip: 'bg-[#2f063d] text-[#e49b09]',
      filterButton: 'bg-[#1f1b2c] border border-white/10 text-white',
      filterButtonActive: 'bg-brand-gold-gradient text-brand-purple border-none'
    }
  };

  const activeTheme =
    gender === 'women' ? themePresets.women : gender === 'men' ? themePresets.men : themePresets.all;

  const activeCardTone: 'neutral' | 'feminine' | 'masculine' =
    gender === 'women' ? 'feminine' : gender === 'men' ? 'masculine' : 'neutral';

  useEffect(() => {
    // Set gender from URL param first
    const genderParam = searchParams.get('gender');
    const newGender = (genderParam === 'women' || genderParam === 'men' || genderParam === 'kids' || genderParam === 'unisex') 
      ? (genderParam as Gender) 
      : 'all';
    const brandParam = searchParams.get('brand');
    const newBrand = brandParam ? decodeURIComponent(brandParam) : 'all';
    
    // If gender changed, reset category to 'all' to show only relevant categories
    if (newGender !== gender) {
      setGender(newGender);
      setCategory('all');
    } else {
      setGender(newGender);
    }
    setBrand(newBrand);
    
    setShowSale(false);
    setSortBy('featured');
    
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMap: Record<string, Category> = {
        // T-Shirts & Tops
        'tshirts': 'tshirts',
        'tshirt': 'tshirts',
        't-shirt': 'tshirts',
        't-shirts': 'tshirts',
        'tees': 'tshirts',
        'tops': 'tshirts',
        't-shirts-vests': 'tshirts',
        // Shirts
        'shirts': 'tshirts',
        'blouses': 'tshirts',
        'blouses-shirts': 'tshirts',
        // Polo
        'polo': 'tshirts',
        'polo-shirts': 'tshirts',
        // Hoodies
        'hoodies': 'hoodies',
        'hoodie': 'hoodies',
        'sweatshirts': 'hoodies',
        'hoodies-sweatshirts': 'hoodies',
        // Trousers & Pants
        'trousers': 'trousers',
        'trousers-chinos': 'trousers',
        'trousers-leggings': 'trousers',
        'chinos': 'trousers',
        'pants': 'pants',
        // Jeans
        'jeans': 'trousers',
        // Shorts
        'shorts': 'trousers',
        // Joggers
        'joggers': 'trousers',
        // Skirts
        'skirt': 'skirts',
        'skirts': 'skirts',
        // Dresses
        'dresses': 'dresses',
        'dress': 'dresses',
        // Native Wear
        'nativewear': 'nativewear',
        'native-wear': 'nativewear',
        'traditional': 'nativewear',
        'african-native-wear': 'nativewear',
        // Outerwear
        'outerwear': 'outerwear',
        'jackets': 'outerwear',
        'coats': 'outerwear',
        'jackets-coats': 'outerwear',
        // Knitwear
        'knitwear': 'hoodies',
        // Suits
        'suits': 'trousers',
        'suits-tailoring': 'trousers',
        'tailoring': 'trousers',
        // Jewellery & Accessories
        'jewellery': 'jewellery',
        'jewelry': 'jewellery',
        'rings': 'rings',
        'ring': 'rings',
        'necklaces': 'jewellery',
        'earrings': 'jewellery',
        'bracelets': 'jewellery',
        'watches': 'jewellery',
        'sunglasses': 'jewellery',
        'hair-accessories': 'jewellery',
        'scarves': 'jewellery',
        'belts': 'jewellery',
        'ties': 'jewellery',
        'hats': 'jewellery',
        'caps-hats': 'jewellery',
        // Bags
        'bags': 'bags',
        'bags-wallets': 'bags',
        'accessories': 'bags',
        // Shoes
        'footwear': 'shoes',
        'shoes': 'shoes',
        'heels': 'shoes',
        'sandals': 'shoes',
        'trainers': 'shoes',
        'boots': 'shoes',
        'flats': 'shoes',
        'loafers': 'shoes',
        'slides': 'shoes',
        'slides-slippers': 'shoes',
        'smart-shoes': 'shoes',
        // Activewear
        'activewear': 'activewear',
        'sportswear': 'activewear',
        'gym': 'activewear',
        // Swimwear
        'swimwear': 'swimwear',
        'swim': 'swimwear',
        // Beauty
        'beauty': 'beauty',
        'skincare': 'beauty',
        'makeup': 'beauty',
        // Lingerie
        'lingerie': 'lingerie',
        'underwear': 'lingerie',
        // Clothing (general)
        'clothing': 'tshirts',
      };
      
      const mappedCategory = categoryMap[categoryParam.toLowerCase()];
      if (mappedCategory) {
        setCategory(mappedCategory);
      }
    }
    
    const filterParam = searchParams.get('filter');
    if (filterParam === 'sale') {
      setShowSale(true);
    } else if (filterParam === 'new') {
      setSortBy('newest');
    }
  }, [searchParams]);

  // Get available categories based on selected gender
  const getAvailableCategories = (): Array<{ key: Category | 'all'; label: string }> => {
    const allCategories: Array<{ key: Category | 'all'; label: string }> = [
      { key: 'all', label: 'All Categories' },
      { key: 'tshirts', label: 'T-Shirts' },
      { key: 'hoodies', label: 'Hoodies' },
      { key: 'trousers', label: 'Trousers' },
      { key: 'pants', label: 'Pants' },
      { key: 'skirts', label: 'Skirts' },
      { key: 'dresses', label: 'Dresses' },
      { key: 'nativewear', label: 'African Native Wear' },
      { key: 'shoes', label: 'Shoes' },
      { key: 'bags', label: 'Bags' },
      { key: 'jewellery', label: 'Jewellery' },
      { key: 'rings', label: 'Rings' },
      { key: 'activewear', label: 'Activewear' },
      { key: 'outerwear', label: 'Outerwear' },
      { key: 'swimwear', label: 'Swimwear' },
      { key: 'beauty', label: 'Beauty & Care' },
      { key: 'lingerie', label: 'Lingerie' },
    ];

    if (gender === 'all' && brand === 'all') {
      return allCategories;
    }

    // Filter categories to only show those that have products for the selected gender
    const availableCategories = allCategories.filter(cat => {
      if (cat.key === 'all') return true;
      const productsForCategory = listProducts(
        gender === 'all' ? undefined : gender,
        cat.key as Category,
        brand === 'all' ? undefined : brand
      );
      return productsForCategory.length > 0;
    });

    return availableCategories;
  };

  const categories = getAvailableCategories();
  const brandOptions = listBrandStats();

  const priceRanges = [
    { key: 'all', label: 'All Prices' },
    { key: 'under-500k', label: 'Under ₦500,000' },
    { key: '500k-1m', label: '₦500,000 - ₦1,000,000' },
    { key: '1m-2m', label: '₦1,000,000 - ₦2,000,000' },
    { key: 'over-2m', label: 'Over ₦2,000,000' },
  ];

  // Helper function to generate deterministic review count based on product ID
  const getReviewCount = (productId: string): number => {
    // Create a simple hash from product ID to get consistent value
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = ((hash << 5) - hash) + productId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Return value between 50-250 based on hash
    return 50 + (Math.abs(hash) % 200);
  };

  let products = listProducts(
    gender === 'all' ? undefined : gender,
    category === 'all' ? undefined : category,
    brand === 'all' ? undefined : brand
  )
    .filter((p) => {
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  
  if (showSale) {
    products = products.filter((_, index) => index % 2 === 0);
  }

  if (priceRange !== 'all') {
    products = products.filter(p => {
      switch(priceRange) {
        case 'under-500k': return p.priceNGN < 500000;
        case '500k-1m': return p.priceNGN >= 500000 && p.priceNGN < 1000000;
        case '1m-2m': return p.priceNGN >= 1000000 && p.priceNGN < 2000000;
        case 'over-2m': return p.priceNGN >= 2000000;
        default: return true;
      }
    });
  }

  products = [...products].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.priceNGN - b.priceNGN;
      case 'price-high': return b.priceNGN - a.priceNGN;
      case 'newest': return b.id.localeCompare(a.id);
      default: return 0;
    }
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];

  if (searchParams.get('category') || searchParams.get('gender') || searchParams.get('filter') || searchParams.get('brand')) {
    const genderParam = searchParams.get('gender');
    const categoryParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');
    const brandParam = searchParams.get('brand');
    
    let filterValue: string | null = null;
    if (filterParam === 'sale') {
      filterValue = 'Sale';
    } else if (filterParam === 'new') {
      filterValue = 'New Arrivals';
    } else if (brandParam) {
      filterValue = decodeURIComponent(brandParam);
    } else if (genderParam) {
      filterValue = genderParam.charAt(0).toUpperCase() + genderParam.slice(1);
    } else if (categoryParam) {
      filterValue = categoryParam;
    }
    
    if (filterValue) {
      breadcrumbItems.push({ label: filterValue, href: `/shop?${searchParams.toString()}` });
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Filters Sidebar - Collapsible */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 bg-white border border-gray-200 rounded-lg max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold uppercase tracking-wider">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search - Always visible */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#570a70] focus:border-[#570a70]"
                  />
                </div>
              </div>

              {/* Brand Filter - Collapsible */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleFilter('brand')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Brand</span>
                  <div className="flex items-center gap-2">
                    {brand !== 'all' && (
                      <span className="text-xs bg-[#570a70] text-white px-2 py-0.5 rounded-full">1</span>
                    )}
                    {expandedFilters.brand ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>
                {expandedFilters.brand && (
                  <div className="px-4 pb-4 space-y-1">
                    <button
                      onClick={() => {
                        setBrand('all');
                        const url = new URL(window.location.href);
                        url.searchParams.delete('brand');
                        window.history.pushState({}, '', url.toString());
                      }}
                      className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                        brand === 'all' ? 'text-[#570a70] font-medium bg-[#570a70]/5' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All Brands {brand === 'all' && '✓'}
                    </button>
                    {brandOptions.map((brandOption) => (
                      <button
                        key={brandOption.name}
                        onClick={() => {
                          setBrand(brandOption.name);
                          const url = new URL(window.location.href);
                          url.searchParams.set('brand', brandOption.name);
                          window.history.pushState({}, '', url.toString());
                        }}
                        className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors flex justify-between ${
                          brand === brandOption.name ? 'text-[#570a70] font-medium bg-[#570a70]/5' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span>{brandOption.name}</span>
                        <span className="text-gray-400">{brandOption.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter - Collapsible */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleFilter('category')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Category</span>
                  <div className="flex items-center gap-2">
                    {category !== 'all' && (
                      <span className="text-xs bg-[#570a70] text-white px-2 py-0.5 rounded-full">1</span>
                    )}
                    {expandedFilters.category ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>
                {expandedFilters.category && (
                  <div className="px-4 pb-4 space-y-1">
                    {categories.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => {
                          setCategory(c.key);
                          const url = new URL(window.location.href);
                          if (c.key === 'all') {
                            url.searchParams.delete('category');
                          } else {
                            url.searchParams.set('category', c.key);
                          }
                          window.history.pushState({}, '', url.toString());
                        }}
                        className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                          category === c.key ? 'text-[#570a70] font-medium bg-[#570a70]/5' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {c.label} {category === c.key && '✓'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter - Collapsible */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleFilter('price')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Price</span>
                  <div className="flex items-center gap-2">
                    {priceRange !== 'all' && (
                      <span className="text-xs bg-[#570a70] text-white px-2 py-0.5 rounded-full">1</span>
                    )}
                    {expandedFilters.price ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>
                {expandedFilters.price && (
                  <div className="px-4 pb-4 space-y-1">
                    {priceRanges.map((range) => (
                      <button
                        key={range.key}
                        onClick={() => setPriceRange(range.key as any)}
                        className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                          priceRange === range.key ? 'text-[#570a70] font-medium bg-[#570a70]/5' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {range.label} {priceRange === range.key && '✓'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              <div className="p-4">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setGender('all');
                    setCategory('all');
                    setBrand('all');
                    setPriceRange('all');
                    setShowSale(false);
                    setSortBy('featured');
                    setExpandedFilters({ brand: false, category: false, price: false });
                    window.history.pushState({}, '', '/shop');
                  }}
                  className="w-full text-sm text-gray-500 hover:text-[#570a70] transition-colors py-2"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Header Bar */}
            <div className={`mb-8 rounded-3xl border border-white/60 p-6 transition-colors ${
              showSale 
                ? 'bg-gradient-to-br from-[#ff6b6b] via-[#ff8787] to-[#ff5252] text-white' 
                : searchParams.get('filter') === 'new'
                ? 'bg-gradient-to-br from-[#570a70] via-[#943aa2] to-[#570a70] text-white'
                : category === 'jewellery' || category === 'rings'
                ? 'bg-gradient-to-br from-[#f7e1b5] via-[#f2cd84] to-[#f7e1b5]'
                : activeTheme.panel
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className={`text-xs uppercase tracking-[0.5em] ${
                    showSale || searchParams.get('filter') === 'new' 
                      ? 'text-white/90' 
                      : activeTheme.subtext
                  }`}>
                    {showSale ? 'Limited Time Offer' : 
                     searchParams.get('filter') === 'new' ? 'Latest Drops' :
                     brand !== 'all' ? 'Brand Spotlight' :
                     category === 'jewellery' || category === 'rings' ? 'Accessories Collection' :
                     gender === 'women' ? 'Feminine Edit' : gender === 'men' ? 'Masculine Edit' : 'All Collections'}
                  </p>
                  <h1 className={`text-3xl font-semibold mt-2 ${
                    showSale || searchParams.get('filter') === 'new' 
                      ? 'text-white' 
                      : activeTheme.heading
                  }`}>
                  {showSale ? 'Sale Items' : 
                   searchParams.get('filter') === 'new' ? 'New Arrivals' :
                   brand !== 'all' ? brand :
                   gender !== 'all' ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection` :
                   category !== 'all' ? categories.find(c => c.key === category)?.label :
                   'All Products'}
                  </h1>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    {brand !== 'all' && !showSale && (
                      <span className="text-[10px] uppercase tracking-[0.4em] px-3 py-1 rounded-full bg-brand-gradient text-white">
                        Brand Edit
                      </span>
                    )}
                    {gender !== 'all' && !showSale && searchParams.get('filter') !== 'new' && (
                      <span className={`text-[10px] uppercase tracking-[0.4em] px-3 py-1 rounded-full ${activeTheme.accentChip}`}>
                        {gender === 'women' ? 'Rose Quartz' : 'Obsidian Luxe'}
                      </span>
                    )}
                    {showSale && (
                      <span className="text-sm text-white font-semibold bg-white/20 px-4 py-1 rounded-full">
                        Up to 30% off!
                      </span>
                    )}
                    {searchParams.get('filter') === 'new' && (
                      <span className="text-sm text-white font-semibold bg-white/20 px-4 py-1 rounded-full">
                        Fresh from the atelier
                      </span>
                    )}
                    {(category === 'jewellery' || category === 'rings') && (
                      <span className="text-[10px] uppercase tracking-[0.4em] px-3 py-1 rounded-full bg-brand-gold-gradient text-brand-purple">
                        Curated Selection
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white/80 border border-white/60 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple font-medium"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-purple pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600'}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {products.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.priceNGN}
                      imageUrl={product.imageUrl}
                      slug={product.slug}
                      brand={product.brand}
                      tone={activeCardTone}
                      badge={showSale ? 'Sale' : undefined}
                      rating={4.5}
                      reviewCount={getReviewCount(product.id)}
                    />
                  ) : (
                    <Card key={product.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                            onError={(e: any) => { 
                              e.currentTarget.src = '/brand/zuka-portrait-trimmed.png'; 
                            }} 
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                            {product.brand}
                          </p>
                          <Link href={`/shop/${product.slug}`}>
                            <h3 className="font-medium text-gray-900 hover:text-gray-600 transition-colors mb-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-semibold text-gray-900">{product.priceNGN.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</span>
                            </div>
                            <Button size="sm" className="bg-black text-white hover:bg-gray-900">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                ))}
              </div>
            ) : (
              /* Coming Soon / Empty State */
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="relative w-full max-w-md aspect-square mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#570a70]/10 via-[#943aa2]/5 to-[#e246a4]/10 rounded-3xl" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#570a70] flex items-center justify-center mb-6">
                      <ShoppingBag className="h-10 w-10 text-white" />
                    </div>
                    <div className="bg-[#e49b09] text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                      Coming Soon
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {category !== 'all' 
                        ? categories.find(c => c.key === category)?.label || 'This Category'
                        : 'New Products'}
                    </h3>
                    <p className="text-gray-500 text-center max-w-xs mb-6">
                      We're curating amazing {gender !== 'all' ? `${gender}'s ` : ''}pieces for this collection. Check back soon!
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/shop">
                        <Button className="bg-[#570a70] text-white hover:bg-[#3d074e]">
                          Browse All Products
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setGender('all');
                          setCategory('all');
                          setBrand('all');
                          setPriceRange('all');
                          setShowSale(false);
                          setSortBy('featured');
                          window.history.pushState({}, '', '/shop');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Notify Me Section */}
                <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 text-center">Get notified when we launch</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Be the first to know when new items drop</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#570a70]"
                    />
                    <Button className="bg-[#570a70] text-white hover:bg-[#3d074e] whitespace-nowrap">
                      Notify Me
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Load More */}
            {products.length > 0 && (
              <div className="mt-16 text-center">
                <Button size="lg" className="bg-brand-gradient text-white hover:opacity-90">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
