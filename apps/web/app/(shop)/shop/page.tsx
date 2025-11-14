'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@gemcart/ui';
import { listProducts, type Gender, type Category } from '../../../lib/catalog';
import { ProductCard } from '../../../components/ProductCard';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  ChevronDown,
  Grid3x3,
  List,
  X
} from 'lucide-react';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [gender, setGender] = useState<Gender | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under-500k' | '500k-1m' | '1m-2m' | 'over-2m'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSale, setShowSale] = useState(false);

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
      panel: 'bg-gradient-to-br from-[#fff0fa] via-[#ffeef6] to-[#fff8f9]',
      heading: 'text-[#c12e6d]',
      subtext: 'text-[#a83b84]',
      accentChip: 'bg-[#ffe5f2] text-[#c12e6d]',
      filterButton: 'bg-white/70 border border-pink-100 text-[#c12e6d]',
      filterButtonActive: 'bg-[#c12e6d] text-white border-none'
    },
    men: {
      panel: 'bg-gradient-to-br from-[#0d1024] via-[#1c1a2f] to-[#312547] text-white',
      heading: 'text-white',
      subtext: 'text-white/70',
      accentChip: 'bg-[#201b34] text-[#f3c16d]',
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
    
    // If gender changed, reset category to 'all' to show only relevant categories
    if (newGender !== gender) {
      setGender(newGender);
      setCategory('all');
    } else {
      setGender(newGender);
    }
    
    setShowSale(false);
    setSortBy('featured');
    
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMap: Record<string, Category> = {
        'jewellery': 'jewellery',
        'accessories': 'jewellery',
        'footwear': 'shoes',
        'shoes': 'shoes',
        'tops': 'tops',
        'dresses': 'dresses',
        'trousers': 'trousers',
        'traditional': 'traditional',
        'activewear': 'activewear',
        'swimwear': 'swimwear',
        'outerwear': 'outerwear',
        'bags': 'bags',
        'beauty': 'beauty',
        'lingerie': 'lingerie'
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

  let products = listProducts(gender === 'all' ? undefined : gender, category === 'all' ? undefined : category)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
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

  if (searchParams.get('category') || searchParams.get('gender') || searchParams.get('filter')) {
    const genderParam = searchParams.get('gender');
    const categoryParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');
    
    let filterValue: string | null = null;
    if (filterParam === 'sale') {
      filterValue = 'Sale';
    } else if (filterParam === 'new') {
      filterValue = 'New Arrivals';
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
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 brand-card border border-white/60 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-medium">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-900 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => {
                        setCategory(c.key);
                        // Update URL when category changes
                        const url = new URL(window.location.href);
                        if (c.key === 'all') {
                          url.searchParams.delete('category');
                        } else {
                          url.searchParams.set('category', c.key);
                        }
                        window.history.pushState({}, '', url.toString());
                      }}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-lg transition-all ${
                        category === c.key
                          ? 'bg-brand-gradient text-white shadow-md'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span className={`text-sm font-medium ${category === c.key ? 'text-white' : 'text-gray-700'}`}>
                        {c.label}
                      </span>
                      {category === c.key && (
                        <span className="ml-auto text-white text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.key}
                      onClick={() => setPriceRange(range.key as any)}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-lg transition-all ${
                        priceRange === range.key
                          ? 'bg-brand-gradient text-white shadow-md'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span className={`text-sm font-medium ${priceRange === range.key ? 'text-white' : 'text-gray-700'}`}>
                        {range.label}
                      </span>
                      {priceRange === range.key && (
                        <span className="ml-auto text-white text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setGender('all');
                  setCategory('all');
                  setPriceRange('all');
                  setShowSale(false);
                  setSortBy('featured');
                  window.history.pushState({}, '', '/shop');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Header Bar */}
            <div className={`mb-8 rounded-3xl border border-white/60 p-6 transition-colors ${
              showSale 
                ? 'bg-gradient-to-br from-[#ff6b6b] via-[#ff8787] to-[#ff5252] text-white' 
                : searchParams.get('filter') === 'new'
                ? 'bg-gradient-to-br from-[#4b0f7b] via-[#6b1f9b] to-[#4b0f7b] text-white'
                : category === 'jewellery'
                ? 'bg-gradient-to-br from-[#fff7e1] via-[#ffe9c5] to-[#fff7e1]'
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
                     category === 'jewellery' ? 'Accessories Collection' :
                     gender === 'women' ? 'Feminine Edit' : gender === 'men' ? 'Masculine Edit' : 'All Collections'}
                  </p>
                  <h1 className={`text-3xl font-semibold mt-2 ${
                    showSale || searchParams.get('filter') === 'new' 
                      ? 'text-white' 
                      : activeTheme.heading
                  }`}>
                  {showSale ? 'Sale Items' : 
                   searchParams.get('filter') === 'new' ? 'New Arrivals' :
                   gender !== 'all' ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection` :
                   category !== 'all' ? categories.find(c => c.key === category)?.label :
                   'All Products'}
                  </h1>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
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
                    {category === 'jewellery' && (
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
                              e.currentTarget.src = 'https://via.placeholder.com/200x200/f5f5f5/999999?text=Zuka'; 
                            }} 
                          />
                        </div>
                        <div className="flex-1">
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
              <div className="flex flex-col items-center justify-center py-24">
                <ShoppingBag className="mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-sm text-gray-600 mb-6">Try adjusting your filters</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setGender('all');
                    setCategory('all');
                    setPriceRange('all');
                    setShowSale(false);
                    setSortBy('featured');
                    window.history.pushState({}, '', '/shop');
                  }}
                  className="bg-black text-white hover:bg-gray-900"
                >
                  Clear All Filters
                </Button>
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
