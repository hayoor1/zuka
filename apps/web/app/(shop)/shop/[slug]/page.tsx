'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button, Badge } from '@gemcart/ui';
import { formatNGN } from '@gemcart/core';
import { getBySlug, listProducts } from '../../../../lib/catalog';
import { StarRating } from '../../../../components/StarRating';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { ProductCard } from '../../../../components/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Check,
  Package
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getBySlug(params.slug);
  
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

  // All hooks must be called before any conditional returns
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return notFound();

  const images = [
    product.imageUrl,
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
  ];

  const relatedProducts = listProducts(product.gender, product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/shop?category=${product.category}` },
    { label: product.name }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
              <Image 
                src={images[currentImage]} 
                alt={product.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover" 
                priority
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                  e.currentTarget.src = 'https://via.placeholder.com/600x600/f5f5f5/999999?text=Zuka'; 
                }} 
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {product.inStock && (
                <Badge className="absolute top-4 left-4 bg-black text-white border-0">New Arrival</Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                      currentImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      fill 
                      sizes="100px"
                      className="object-cover" 
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                        e.currentTarget.src = 'https://via.placeholder.com/100x100/f5f5f5/999999?text=Zuka'; 
                      }} 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <Badge variant="default" className="mb-3 text-xs">{product.gender.toUpperCase()}</Badge>
              <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={4.5} showNumber reviewCount={127} size="md" />
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-semibold text-gray-900">{formatNGN(product.priceNGN)}</span>
                <span className="text-xl text-gray-400 line-through">{formatNGN(product.priceNGN * 1.3)}</span>
                <Badge className="bg-red-500 text-white border-0">30% OFF</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Earn {Math.floor(product.priceNGN / 10000)} reward points with this purchase
              </p>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color: {selectedColor}</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2.5 rounded-lg border-2 transition-colors ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Size: {selectedSize}</h3>
                  <button className="text-sm text-gray-600 hover:text-gray-900">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <form action="/cart/add" method="post" className="flex-1">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="quantity" value={quantity} />
                <input type="hidden" name="size" value={selectedSize} />
                <input type="hidden" name="color" value={selectedColor} />
                <Button type="submit" size="lg" className="w-full bg-black text-white hover:bg-gray-900">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </form>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? 'bg-red-50 text-red-600' : ''}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button size="lg" variant="secondary">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Stock Status */}
            {product.inStock && (
              <div className="flex items-center gap-2 text-green-600 mb-8">
                <Check className="h-5 w-5" />
                <span className="font-medium">In Stock - Ready to Ship</span>
              </div>
            )}

            {/* Benefits */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Free shipping on orders above ₦50,000</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Secure payment & authentic products</span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Estimated delivery: 2-4 business days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                Experience luxury and comfort with our {product.name}. Crafted with premium materials 
                and attention to detail, this piece is designed to elevate your wardrobe. Whether you&apos;re 
                dressing up for a special occasion or keeping it casual, this versatile item adapts to 
                your style needs.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Premium quality materials</li>
                <li>• Available in multiple colors and sizes</li>
                <li>• Machine washable</li>
                <li>• Imported</li>
                <li>• Model is wearing size M</li>
                <li>• Fits true to size</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Care Instructions</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Machine wash cold with like colors</li>
                <li>• Do not bleach</li>
                <li>• Tumble dry low</li>
                <li>• Cool iron if needed</li>
                <li>• Do not dry clean</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12 tracking-tight">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={relatedProduct.priceNGN}
                imageUrl={relatedProduct.imageUrl}
                slug={relatedProduct.slug}
                tone={relatedProduct.gender === 'women' ? 'feminine' : relatedProduct.gender === 'men' ? 'masculine' : 'neutral'}
                rating={4.5}
                reviewCount={getReviewCount(relatedProduct.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
