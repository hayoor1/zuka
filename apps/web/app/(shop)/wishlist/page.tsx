'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Badge } from '@gemcart/ui';
import { listProducts } from '../../../lib/catalog';
import { ProductCard } from '../../../components/ProductCard';
import { Heart, Sparkles, Gift } from 'lucide-react';

type Tone = 'feminine' | 'masculine' | 'neutral';

const mapTone = (gender: string): Tone => {
  if (gender === 'women') return 'feminine';
  if (gender === 'men') return 'masculine';
  return 'neutral';
};

export default function WishlistPage() {
  const initialFavorites = useMemo(
    () =>
      listProducts()
        .slice(0, 6)
        .map((product) => ({
          ...product,
          tone: mapTone(product.gender)
        })),
    []
  );
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const recommended = listProducts().slice(6, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5fb] via-[#fdf3ff] to-[#fffaf2] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="bg-brand-gold-gradient text-brand-purple border-0 text-xs tracking-[0.5em] mb-4">
            Wishlist
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-brand-purple">Your Favourites</h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Handpicked pieces waiting for their moment. Blend them with new arrivals or move them straight to cart.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-3xl border border-white/60 bg-white/95 p-12 text-center shadow-xl shadow-[#4b0f7b]/10">
            <Heart className="mx-auto mb-6 h-12 w-12 text-brand-purple" />
            <h3 className="text-xl font-semibold text-brand-purple mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save purple & gold essentials to keep them close.</p>
            <Link href="/shop">
              <Button className="bg-brand-gradient text-white hover:opacity-90">
                Explore Collections
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-brand-purple shadow-md hover:text-red-500"
                    aria-label="Remove favourite"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.priceNGN}
                    imageUrl={product.imageUrl}
                    slug={product.slug}
                    tone={product.tone as Tone}
                    rating={4.8}
                    reviewCount={150}
                    onQuickAdd={() => {}}
                  />
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/60 bg-gradient-to-r from-[#fff5de] to-[#ffe3f7] p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 text-brand-purple">
                  <Sparkles className="h-6 w-6" />
                  <span className="uppercase tracking-[0.4em] text-xs">Reminder</span>
                </div>
                <h2 className="text-2xl font-semibold text-brand-purple mt-2">We hold wishlist pieces for 24h</h2>
                <p className="text-gray-700 mt-2">
                  Reserve your favourites before they leave the atelier. Move to cart or set a private alert.
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-white text-brand-purple border border-brand-purple/10">
                  Set Alert
                </Button>
                <Link href="/cart">
                  <Button className="bg-brand-gradient text-white">Move All to Cart</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="h-5 w-5 text-brand-purple" />
            <h3 className="text-xl font-semibold text-brand-purple">Fresh Picks for You</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.priceNGN}
                imageUrl={product.imageUrl}
                slug={product.slug}
                tone={mapTone(product.gender)}
                rating={4.6}
                reviewCount={120}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

