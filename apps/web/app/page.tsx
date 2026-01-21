'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@gemcart/ui';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { listProducts, listBrandStats } from '../lib/catalog';
import { 
  ArrowRight, 
  Shield, 
  Truck, 
  Crown,
  Gift
} from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getReviewCount = (productId: string): number => {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = ((hash << 5) - hash) + productId.charCodeAt(i);
      hash = hash & hash;
    }
    return 50 + (Math.abs(hash) % 200);
  };

  const categories = [
    { name: "Women's Fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop", href: "/shop?gender=women", count: "2.4k+" },
    { name: "Men's Collection", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop", href: "/shop?gender=men", count: "1.8k+" },
    { name: "African Native", image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=800&fit=crop", href: "/shop?category=nativewear", count: "890+" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600&h=800&fit=crop", href: "/shop?category=jewellery", count: "1.2k+" },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop", href: "/shop?category=shoes", count: "760+" },
    { name: "Beauty & Care", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop", href: "/shop?category=beauty", count: "540+" },
  ];

  const trendingItems = [
    { title: "Lagos Street Style", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop", tag: "Trending" },
    { title: "Ankara Modern", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop", tag: "New Drop" },
    { title: "Evening Luxe", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop", tag: "Bestseller" },
  ];

  const trustBadges = [
    { icon: Shield, label: "100% Authentic", desc: "Verified brands only" },
    { icon: Truck, label: "Fast Delivery", desc: "Same-day in Lagos" },
    { icon: Gift, label: "Easy Returns", desc: "30-day guarantee" },
    { icon: Crown, label: "Royale Rewards", desc: "Earn on every order" },
  ];

  const featuredProducts = useMemo(() => listProducts().slice(0, 8), []);
  const newArrivals = useMemo(() => listProducts().slice(8, 16), []);
  const brandDirectory = useMemo(() => listBrandStats(), []);

  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-900 overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════════════════
            HERO SECTION - Full Screen Immersive
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-end overflow-hidden pt-32">
          {/* Background - Fashion Editorial Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1200&fit=crop&q=90"
              alt="Fashion Models on Runway"
              fill
              className="object-cover object-top"
              priority
            />
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 pb-20 pt-20">
            <div className="max-w-xl">
              {/* Main Headline */}
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5 text-white ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
                Your Fashion
                <span className="block text-[#e49b09]">Warehouse</span>
              </h1>

              {/* Subheadline */}
              <p className={`text-base text-white/80 max-w-md mb-8 leading-relaxed ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                Shop 200+ curated African brands. From Lagos streetwear to premium luxury.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-wrap gap-3 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                <Link href="/shop?gender=women">
                  <Button size="lg" className="bg-white text-black hover:bg-[#e49b09] rounded-none px-8 h-12 text-sm font-semibold uppercase tracking-wider">
                    Shop Women
                  </Button>
                </Link>
                <Link href="/shop?gender=men">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none px-8 h-12 text-sm font-semibold uppercase tracking-wider">
                    Shop Men
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            TRUST BADGES - Clean Strip
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-4 bg-[#f8f8f8] border-y border-gray-200">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <badge.icon className="h-4 w-4 text-[#570a70]" />
                  <span className="text-xs font-medium text-gray-700">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            CATEGORIES GRID - Shop by Category
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-[1400px] px-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                Shop by Category
              </h2>
              <Link href="/shop" className="text-sm font-medium text-[#570a70] hover:underline">
                View All
              </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, i) => (
                <Link 
                  key={i} 
                  href={category.href}
                  className="group relative aspect-[3/4] overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            TRENDING NOW - Horizontal Scroll
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-[#f8f8f8]">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                Trending Now
              </h2>
              <Link href="/shop?filter=trending" className="text-sm font-medium text-[#570a70] hover:underline">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingItems.map((item, i) => (
                <Link 
                  key={i} 
                  href="/shop"
                  className="group relative aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase">
                      {item.tag}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <span className="text-white/80 text-sm font-medium group-hover:underline">
                      Shop Now →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            FEATURED PRODUCTS - Grid
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                Bestsellers
              </h2>
              <Link href="/shop?filter=bestsellers" className="text-sm font-medium text-[#570a70] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.priceNGN}
                  imageUrl={product.imageUrl}
                  slug={product.slug}
                  brand={product.brand}
                  rating={4.5}
                  reviewCount={getReviewCount(product.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            BRAND SHOWCASE - Clean Grid
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-[#f8f8f8]">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                Shop by Brand
              </h2>
              <Link href="/brands" className="text-sm font-medium text-[#570a70] hover:underline">
                A-Z of Brands
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {brandDirectory.map((brand) => (
                <Link 
                  key={brand.name} 
                  href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="group flex flex-col items-center justify-center py-6 px-4 bg-white border border-gray-200 hover:border-[#570a70] transition-all"
                >
                  <span className="text-gray-900 font-semibold text-sm text-center group-hover:text-[#570a70] transition-colors">
                    {brand.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{brand.count} items</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            EDITORIAL SPLIT - Gender Collections
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Women */}
            <Link href="/shop?gender=women" className="group relative h-[500px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&h=1200&fit=crop"
                alt="Women's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-bold text-white mb-4">WOMEN</h3>
                <span className="text-white text-sm font-medium border-b border-white pb-1 group-hover:border-[#e49b09] group-hover:text-[#e49b09] transition-colors">
                  SHOP NOW
                </span>
              </div>
            </Link>

            {/* Men */}
            <Link href="/shop?gender=men" className="group relative h-[500px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&h=1200&fit=crop"
                alt="Men's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-bold text-white mb-4">MEN</h3>
                <span className="text-white text-sm font-medium border-b border-white pb-1 group-hover:border-[#e49b09] group-hover:text-[#e49b09] transition-colors">
                  SHOP NOW
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            NEW ARRIVALS - Product Grid
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                New In
              </h2>
              <Link href="/shop?filter=new" className="text-sm font-medium text-[#570a70] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.priceNGN}
                  imageUrl={product.imageUrl}
                  slug={product.slug}
                  brand={product.brand}
                  rating={4.5}
                  reviewCount={getReviewCount(product.id)}
                  badge="New"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            REWARDS CALLOUT - Clean Banner
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#570a70]">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Crown className="h-5 w-5 text-[#e49b09]" />
                  <span className="text-[#e49b09] text-sm font-bold uppercase tracking-wider">Zuka Royale</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Earn rewards every time you shop
                </h2>
                <p className="text-white/70 text-sm">
                  Join for free and start earning points, get early access to sales and exclusive perks.
                </p>
              </div>
              <Link href="/rewards">
                <Button size="lg" className="bg-white text-[#570a70] hover:bg-[#e49b09] hover:text-black rounded-none px-8 h-12 text-sm font-semibold uppercase tracking-wider">
                  Join Now – It's Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            NEWSLETTER - Clean Footer CTA
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#f8f8f8] border-t border-gray-200">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="max-w-xl mx-auto text-center" suppressHydrationWarning>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3">
                Get 10% Off Your First Order
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Subscribe for exclusive deals, new arrivals, and fashion inspiration.
              </p>
              <form className="flex flex-col sm:flex-row gap-3" suppressHydrationWarning>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#570a70] text-sm"
                  suppressHydrationWarning
                />
                <Button type="submit" className="bg-[#570a70] text-white hover:bg-[#3d074e] rounded-none px-8 h-12 text-sm font-semibold uppercase tracking-wider">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-gray-400 mt-3">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════════════════ */}
        <footer className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-[1400px] px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {/* Help */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Help & Information</h4>
                <ul className="space-y-2">
                  {['Help', 'Track Order', 'Delivery & Returns', 'Sitemap'].map((item) => (
                    <li key={item}>
                      <Link href="/help" className="text-xs text-gray-600 hover:text-[#570a70] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">About Zuka</h4>
                <ul className="space-y-2">
                  {['About Us', 'Careers', 'Corporate Responsibility', 'Investors'].map((item) => (
                    <li key={item}>
                      <Link href="/about" className="text-xs text-gray-600 hover:text-[#570a70] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* More */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">More From Zuka</h4>
                <ul className="space-y-2">
                  {['Mobile & Apps', 'Zuka Royale', 'Gift Vouchers', 'Black Friday'].map((item) => (
                    <li key={item}>
                      <Link href="/" className="text-xs text-gray-600 hover:text-[#570a70] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shopping */}
              <div className="col-span-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Shopping From</h4>
                <p className="text-xs text-gray-600 mb-4">
                  You're in <span className="font-semibold">Nigeria</span>
                </p>
                <p className="text-xs text-gray-400">
                  Some items may have additional charges and taxes on checkout.
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/brand/zuka-wordmark-trimmed.png"
                  alt="Zuka"
                  width={80}
                  height={26}
                  className="h-6 w-auto"
                />
                <span className="text-xs text-gray-400">© 2026 Zuka</span>
              </div>
              <div className="flex items-center gap-6">
                {['Privacy & Cookies', 'Terms & Conditions', 'Accessibility'].map((item) => (
                  <Link key={item} href="#" className="text-xs text-gray-400 hover:text-[#570a70] transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
