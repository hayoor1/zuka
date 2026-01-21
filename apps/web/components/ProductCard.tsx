'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge } from '@gemcart/ui';
import { formatNGN } from '@gemcart/core';
import { StarRating } from './StarRating';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useState } from 'react';

type Tone = 'neutral' | 'feminine' | 'masculine';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  slug: string;
  brand?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  className?: string;
  onQuickAdd?: () => void;
  tone?: Tone;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  slug,
  brand,
  badge,
  rating = 4.5,
  reviewCount = 0,
  className = '',
  onQuickAdd,
  tone = 'neutral'
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toneStyles: Record<Tone, { price: string; points: string; pill: string; quickAdd: string; icon: string }> = {
    neutral: {
      price: 'text-[#570a70]',
      points: 'bg-[#e6daea] text-[#570a70]',
      pill: 'bg-[#f1e9f4] text-[#570a70]',
      quickAdd: 'from-[#570a70] to-[#3d074e]',
      icon: 'text-[#570a70]'
    },
    feminine: {
      price: 'text-[#e246a4]',
      points: 'bg-[#f6c8e4] text-[#e246a4]',
      pill: 'bg-[#f9daed] text-[#e246a4]',
      quickAdd: 'from-[#b21af5] to-[#e246a4]',
      icon: 'text-[#e246a4]'
    },
    masculine: {
      price: 'text-[#e49b09]',
      points: 'bg-[#2f063d] text-[#e49b09]',
      pill: 'bg-[#260432] text-[#e49b09]',
      quickAdd: 'from-[#3d074e] to-[#570a70]',
      icon: 'text-[#e49b09]'
    }
  };

  const palette = toneStyles[tone];

  const badgeColors: Record<string, string> = {
    'Sale': 'bg-red-500 text-white',
    'New': 'bg-black text-white',
    'Hot': 'bg-orange-500 text-white',
    'Premium': 'bg-gray-900 text-white',
    'Luxury': 'bg-gray-900 text-white',
    'Limited': 'bg-amber-500 text-black',
    'Bestseller': 'bg-blue-500 text-white',
    'Trending': 'bg-purple-600 text-white'
  };

  return (
    <Card 
      className={`group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e: any) => {
              e.currentTarget.src = '/brand/zuka-portrait-trimmed.png';
            }}
          />
          
          {badge && (
            <Badge className={`absolute top-3 left-3 border-0 text-xs font-medium ${badgeColors[badge] || 'bg-gray-900 text-white'}`}>
              {badge}
            </Badge>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } hover:scale-110 ${isWishlisted ? 'text-[#e246a4]' : palette.icon}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {onQuickAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd();
              }}
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${palette.quickAdd} text-white py-3 font-medium text-sm transition-all ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
              }`}
            >
              <ShoppingBag className="inline h-4 w-4 mr-1" />
              Quick Add
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/shop/${slug}`}>
          {brand && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">
              {brand}
            </p>
          )}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-brand-purple transition-colors">
            {name}
          </h3>
        </Link>
        
        <StarRating rating={rating} reviewCount={reviewCount} size="sm" className="mb-3" />

        <div className="flex items-baseline justify-between">
          <div>
            <span className={`text-lg font-semibold ${palette.price}`}>{formatNGN(price)}</span>
            {originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {formatNGN(originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${palette.points}`}>
          <Sparkles className="h-3 w-3" />
          <span className="font-medium">Earn {Math.floor(price / 10000)} pts</span>
        </div>
      </div>
    </Card>
  );
}

