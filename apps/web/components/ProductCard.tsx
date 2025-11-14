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
      price: 'text-[#4b0f7b]',
      points: 'bg-[#f3e9ff] text-[#4b0f7b]',
      pill: 'bg-[#f9f2ff] text-[#4b0f7b]',
      quickAdd: 'from-[#4b0f7b] to-[#321052]',
      icon: 'text-[#4b0f7b]'
    },
    feminine: {
      price: 'text-[#c12e6d]',
      points: 'bg-[#ffe8f3] text-[#c12e6d]',
      pill: 'bg-[#fff2f9] text-[#c12e6d]',
      quickAdd: 'from-[#ff7ac0] to-[#d94fa0]',
      icon: 'text-[#c12e6d]'
    },
    masculine: {
      price: 'text-[#f2c46c]',
      points: 'bg-[#1f1e2c] text-[#f2c46c]',
      pill: 'bg-[#1c1b29] text-[#f2c46c]',
      quickAdd: 'from-[#0f172a] to-[#3f2c59]',
      icon: 'text-[#f2c46c]'
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
              e.currentTarget.src = 'https://via.placeholder.com/600x600/f5f5f5/999999?text=Zuka';
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
            } hover:scale-110 ${isWishlisted ? 'text-[#e04c7c]' : palette.icon}`}
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

