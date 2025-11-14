'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@gemcart/ui';
import { Navbar } from '../components/Navbar';
import { ValueProps } from '../components/ValueProps';
import { ProductCard } from '../components/ProductCard';
import { listProducts } from '../lib/catalog';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  type HeroTone = 'feminine' | 'masculine' | 'neutral';

  const heroSlides: Array<{
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    image: string;
    tone: HeroTone;
  }> = [
    {
      title: "Welcome to Zuka",
      subtitle: "Nigeria's Premium Fashion Destination",
      description: "Experience couture, ready-to-wear, accessories and rare collectibles curated by our stylists.",
      cta: "Shop Now",
      tone: 'feminine' as const,
      image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80"
    },
    {
      title: "Luxury Edit for Him",
      subtitle: "Modern Tailoring, Edges and Craft",
      description: "Discover elevated pieces with sharp masculine lines blended with Zuka's royal palette.",
      cta: "Explore Menswear",
      tone: 'masculine' as const,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80"
    },
    {
      title: "Play & Win Rewards",
      subtitle: "Up to ₦100,000 in Prizes",
      description: "Unlock exclusive rewards, VIP fitting experiences and atelier previews while you shop.",
      cta: "Start Playing",
      tone: 'neutral' as const,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  type CategoryTone = 'feminine' | 'masculine' | 'neutral';

  const categories: Array<{
    name: string;
    image: string;
    href: string;
    tone: CategoryTone;
  }> = [
    {
      name: "Women's Couture",
      image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
      href: "/shop?gender=women",
      tone: 'feminine' as const
    },
    {
      name: "Men's Atelier",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      href: "/shop?gender=men",
      tone: 'masculine' as const
    },
    {
      name: "Kids' Wear",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
      href: "/shop?gender=kids",
      tone: 'neutral' as const
    },
    {
      name: "Traditional Wear",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      href: "/shop?category=traditional",
      tone: 'feminine' as const
    },
    {
      name: "Activewear",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
      href: "/shop?category=activewear",
      tone: 'masculine' as const
    },
    {
      name: "Beauty & Care",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
      href: "/shop?category=beauty",
      tone: 'feminine' as const
    },
    {
      name: "Bags & Accessories",
      image: "https://images.unsplash.com/photo-1522312298940-653d2b79dbb5?auto=format&fit=crop&w=900&q=80",
      href: "/shop?category=bags",
      tone: 'neutral' as const
    },
    {
      name: "Luxury Shoes",
      image: "https://images.unsplash.com/photo-1503508343067-7d79c8985d2b?auto=format&fit=crop&w=900&q=80",
      href: "/shop?category=shoes",
      tone: 'masculine' as const
    }
  ];

  // Memoize product lists to avoid re-processing catalog on every render
  const womensEdit = useMemo(() => listProducts('women').slice(0, 4), []);
  const mensEdit = useMemo(() => listProducts('men').slice(0, 4), []);
  const featuredProducts = useMemo(() => listProducts().slice(0, 8), []);

  const toneOverlays: Record<'feminine' | 'masculine' | 'neutral', string> = {
    feminine: 'from-[#ffbedd]/80 via-[#f6bfff]/35 to-[#2a1039]/90',
    masculine: 'from-[#050816]/85 via-[#1f1933]/70 to-[#4b0f7b]/80',
    neutral: 'from-black/70 via-black/40 to-transparent'
  };

  const categoryOverlays: Record<'feminine' | 'masculine' | 'neutral', string> = {
    feminine: 'from-[#ffcee1]/70 via-transparent to-transparent',
    masculine: 'from-[#120c2c]/80 via-transparent to-transparent',
    neutral: 'from-black/60 via-transparent to-transparent'
  };

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Carousel */}
        <section className="relative h-[620px] md:h-[720px] overflow-hidden rounded-b-[48px] bg-black">
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${toneOverlays[slide.tone]} z-10`} />
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                      <p className="text-sm text-white/90 mb-4 tracking-[0.25em] uppercase">
                        {slide.subtitle}
                      </p>
                      <h1 className="text-5xl md:text-[4.75rem] font-semibold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
                        {slide.description}
                      </p>
                      <Link href="/shop">
                        <Button size="lg" className="bg-brand-gold-gradient text-brand-purple hover:opacity-90 px-8 py-6 text-base font-semibold">
                          {slide.cta}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 transition-all rounded-full ${
                  index === currentSlide ? 'w-10 bg-brand-gold-gradient' : 'w-3 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Value Props */}
        <ValueProps />

        {/* Shop by Category */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-brand-gold-gradient text-brand-purple border-0 mb-4 text-xs uppercase tracking-[0.4em]">
                Curated Worlds
              </Badge>
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-brand-purple tracking-tight">Shop by Category</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Blend your persona with Zuka’s purple-gold signature. Choose a universe tailored for every mood.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.name} href={category.href}>
                  <div className="group cursor-pointer overflow-hidden rounded-3xl border border-white/40 shadow-[0_15px_35px_rgba(26,5,48,0.12)]">
                    <div className="aspect-square relative overflow-hidden bg-gray-50">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${categoryOverlays[category.tone]} group-hover:opacity-100 transition-opacity`} />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <h3 className="text-2xl font-semibold text-white drop-shadow-lg">{category.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Women's Luxury Edit */}
        <section className="py-20 bg-gradient-to-br from-[#fff0fa] via-[#fbe7ff] to-[#fff5f6]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-[#c12e6d] mb-3">for her</p>
                <h2 className="text-4xl font-semibold text-[#c12e6d]">La Maison Femme</h2>
                <p className="text-[#a83b84] mt-3 max-w-xl">Lilac hues, rose gold trims and sumptuous silk silhouettes curated for the modern muses.</p>
              </div>
              <Link href="/shop?gender=women" className="text-[#c12e6d] font-semibold inline-flex items-center">
                Explore womenswear
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {womensEdit.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.priceNGN}
                  imageUrl={product.imageUrl}
                  slug={product.slug}
                  tone="feminine"
                  rating={4.7}
                  reviewCount={180}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Men's Luxury Edit */}
        <section className="py-20 bg-masculine-gradient text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-brand-gold mb-3">for him</p>
                <h2 className="text-4xl font-semibold text-white">Gentlemen's Atelier</h2>
                <p className="text-white/80 mt-3 max-w-xl">Structured tailoring, midnight velvets, and satin accents inspired by Lagos nights.</p>
              </div>
              <Link href="/shop?gender=men" className="text-brand-gold font-semibold inline-flex items-center">
                Tailored menswear
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {mensEdit.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.priceNGN}
                  imageUrl={product.imageUrl}
                  slug={product.slug}
                  tone="masculine"
                  rating={4.8}
                  reviewCount={142}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-gradient-to-b from-[#fbf8ff] to-[#fffdf7]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-semibold text-brand-purple mb-2 tracking-tight">Zuka Curated Spotlight</h2>
                <p className="text-gray-600 text-lg">Exclusive drops from our designer vault — limited quantities blended with purple & gold finishes.</p>
              </div>
              <Link href="/shop" className="hidden md:flex items-center text-brand-purple hover:text-brand-gold transition-colors font-semibold">
                View All
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/shop">
                <Button size="lg" className="bg-brand-gradient text-white hover:opacity-90">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Gamification Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-brand-gold-gradient text-brand-purple border-0 mb-4 text-xs uppercase tracking-[0.4em]">
                Experiential
              </Badge>
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-brand-purple tracking-tight">Shop, Play & Win</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Couture meets play. Spin, game and climb the Royale ranks to unlock atelier fittings and cash prizes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/games">
                <div className="group cursor-pointer rounded-3xl border border-[#f1e7ff] bg-white/80 p-8 hover:shadow-xl transition-all">
                  <h3 className="text-xl font-semibold mb-2 text-brand-purple group-hover:text-brand-gold transition-colors">Play Games</h3>
                  <p className="text-gray-600 mb-4 text-sm">Snake, Tetris & Royale dash earn up to 1,000 points daily.</p>
                  <div className="flex items-center text-sm text-brand-purple font-semibold">
                    <span>Learn more</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link href="/rewards">
                <div className="group cursor-pointer rounded-3xl border border-[#f9efd8] bg-gradient-to-br from-[#fff7e1] to-[#ffe9c5] p-8 hover:shadow-xl transition-all">
                  <h3 className="text-xl font-semibold mb-2 text-brand-purple group-hover:text-brand-gold transition-colors">Redeem Rewards</h3>
                  <p className="text-gray-700 mb-4 text-sm">Turn Royale points into atelier credits, accessories & cash vouchers.</p>
                  <div className="flex items-center text-sm text-brand-purple font-semibold">
                    <span>Learn more</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link href="/ranks">
                <div className="group cursor-pointer rounded-3xl border border-[#201727] bg-masculine-gradient p-8 text-white hover:shadow-xl transition-all">
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-brand-gold transition-colors">Weekly Contest</h3>
                  <p className="text-white/80 mb-4 text-sm">Top 10 Royale members win ₦100k + VIP styling slots weekly.</p>
                  <div className="flex items-center text-sm text-brand-gold font-semibold">
                    <span>Learn more</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 bg-brand-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,220,167,0.5),_transparent_45%)]" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-white text-brand-purple border-0 mb-4 text-xs uppercase tracking-[0.5em]">
              Newsletter
            </Badge>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">Join the Zuka Family</h2>
            <p className="text-lg md:text-xl mb-10 text-white/80 leading-relaxed max-w-2xl mx-auto">
              Receive private invitations to drops, studio previews and earn bonus Royale points for every story you unlock.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" suppressHydrationWarning>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                suppressHydrationWarning
              />
              <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-100 whitespace-nowrap px-8 font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
