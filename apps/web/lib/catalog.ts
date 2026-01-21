import type { Product } from '@gemcart/core';

export type Gender = 'men' | 'women' | 'kids' | 'unisex';
export type Category =
  | 'tshirts'
  | 'hoodies'
  | 'trousers'
  | 'pants'
  | 'skirts'
  | 'dresses'
  | 'shoes'
  | 'bags'
  | 'jewellery'
  | 'rings'
  | 'activewear'
  | 'swimwear'
  | 'lingerie'
  | 'beauty'
  | 'outerwear'
  | 'nativewear';

export type CatalogProduct = Product & {
  gender: Gender;
  category: Category;
  imageUrl: string;
  brand: string;
};

// Note: Using source.unsplash.com category queries (royalty-free demo). Images rotate but remain valid.
export const catalog: CatalogProduct[] = [
  {
    id: 'm-top-tee-1',
    slug: 'mens-classic-tee',
    name: 'Mens Classic Tee',
    description: 'Soft crew neck cotton tee',
    priceNGN: 850000,
    images: [],
    tags: ['tee','tshirt'],
    sizes: ['S','M','L','XL'],
    colors: ['black','white','green'],
    inStock: true,
    gender: 'men',
    category: 'tshirts',
    brand: 'Luxe Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'm-top-hoodie-1',
    slug: 'lagos-street-hoodie',
    name: 'Lagos Street Hoodie',
    description: 'Cozy fleece hoodie for cool nights',
    priceNGN: 1950000,
    images: [],
    tags: ['hoodie'],
    sizes: ['M','L','XL'],
    colors: ['black','grey'],
    inStock: true,
    gender: 'men',
    category: 'hoodies',
    brand: 'Naija Street',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'm-trouser-1',
    slug: 'tech-flex-joggers',
    name: 'Tech Flex Joggers',
    description: 'Stretch joggers with zip pockets',
    priceNGN: 1450000,
    images: [],
    tags: ['joggers','trousers'],
    sizes: ['S','M','L','XL'],
    colors: ['black','navy'],
    inStock: true,
    gender: 'men',
    category: 'trousers',
    brand: 'Urban Motion',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'm-shoes-1',
    slug: 'naija-runner-sneakers',
    name: 'Naija Runner Sneakers',
    description: 'Lightweight everyday sneakers',
    priceNGN: 2350000,
    images: [],
    tags: ['sneakers','shoes'],
    sizes: ['41','42','43','44'],
    colors: ['white','black'],
    inStock: true,
    gender: 'men',
    category: 'shoes',
    brand: 'Kicks & Co',
    imageUrl: 'https://via.placeholder.com/900x900/570a70/e49b09?text=Naija+Runner+Sneakers',
  },
  {
    id: 'w-top-tee-1',
    slug: 'naija-heritage-tee',
    name: 'Naija Heritage Tee',
    description: 'Relaxed fit tee with heritage print',
    priceNGN: 920000,
    images: [],
    tags: ['tee','tshirt'],
    sizes: ['XS','S','M','L'],
    colors: ['white','green','black'],
    inStock: true,
    gender: 'women',
    category: 'tshirts',
    brand: 'Naija Street',
    imageUrl: 'https://via.placeholder.com/900x900/570a70/e49b09?text=Heritage+Tee',
  },
  {
    id: 'w-dress-1',
    slug: 'ankara-fusion-dress',
    name: 'Ankara Fusion Dress',
    description: 'Modern silhouette with Ankara accents',
    priceNGN: 2850000,
    images: [],
    tags: ['dress','ankara'],
    sizes: ['S','M','L'],
    colors: ['multi'],
    inStock: true,
    gender: 'women',
    category: 'dresses',
    brand: 'Ankara Vibes',
    imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'w-shoes-1',
    slug: 'elevate-heels',
    name: 'Elevate Heels',
    description: 'Elegant heels for nights out',
    priceNGN: 1750000,
    images: [],
    tags: ['heels','shoes'],
    sizes: ['37','38','39','40'],
    colors: ['black','nude'],
    inStock: true,
    gender: 'women',
    category: 'shoes',
    brand: 'Luxe Steps',
    imageUrl: 'https://via.placeholder.com/900x900/570a70/e49b09?text=Brand+Edit',
  },
  {
    id: 'w-trouser-1',
    slug: 'high-rise-tailored-trousers',
    name: 'High-Rise Tailored Trousers',
    description: 'Sharp cut with comfortable stretch',
    priceNGN: 1680000,
    images: [],
    tags: ['pants','tailored'],
    sizes: ['S','M','L'],
    colors: ['black','khaki'],
    inStock: true,
    gender: 'women',
    category: 'pants',
    brand: 'Modern Muse',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'w-skirt-1',
    slug: 'pleated-midi-skirt',
    name: 'Pleated Midi Skirt',
    description: 'Flowy pleated skirt for day-to-night styling',
    priceNGN: 1420000,
    images: [],
    tags: ['skirts','pleated'],
    sizes: ['S','M','L'],
    colors: ['black','cream'],
    inStock: true,
    gender: 'women',
    category: 'skirts',
    brand: 'Modern Muse',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'jewel-1',
    slug: 'adire-bead-necklace',
    name: 'Adire Bead Necklace',
    description: 'Hand-inspired beaded necklace',
    priceNGN: 480000,
    images: [],
    tags: ['jewellery','necklace'],
    sizes: [],
    colors: ['multi'],
    inStock: true,
    gender: 'women',
    category: 'jewellery',
    brand: 'Heritage Gems',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ring-1',
    slug: 'signature-gold-ring',
    name: 'Signature Gold Ring',
    description: 'Minimal gold ring with polished finish',
    priceNGN: 560000,
    images: [],
    tags: ['rings','jewellery'],
    sizes: ['6','7','8'],
    colors: ['gold'],
    inStock: true,
    gender: 'unisex',
    category: 'rings',
    brand: 'Heritage Gems',
    imageUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=900&q=80',
  },
  // Activewear
  {
    id: 'w-active-1',
    slug: 'naija-gym-set',
    name: 'Naija Gym Set',
    description: 'Sports bra and leggings combo',
    priceNGN: 1250000,
    images: [],
    tags: ['activewear','gym'],
    sizes: ['XS','S','M','L'],
    colors: ['black','green'],
    inStock: true,
    gender: 'women',
    category: 'activewear',
    brand: 'Urban Motion',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'm-active-1',
    slug: 'mens-track-jacket',
    name: 'Men\'s Track Jacket',
    description: 'Athletic track jacket with Nigerian colors',
    priceNGN: 1850000,
    images: [],
    tags: ['activewear','jacket'],
    sizes: ['M','L','XL','XXL'],
    colors: ['green','white'],
    inStock: true,
    gender: 'men',
    category: 'activewear',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  // Swimwear
  {
    id: 'w-swim-1',
    slug: 'beach-vibes-bikini',
    name: 'Beach Vibes Bikini',
    description: 'Two-piece swimsuit with print',
    priceNGN: 980000,
    images: [],
    tags: ['swimwear','beach'],
    sizes: ['S','M','L'],
    colors: ['multi','green'],
    inStock: true,
    gender: 'women',
    category: 'swimwear',
    brand: 'Coco Beach',
    imageUrl: 'https://via.placeholder.com/900x900/570a70/e49b09?text=Brand+Edit',
  },
  // Bags & Accessories
  {
    id: 'w-bag-1',
    slug: 'lagos-tote-bag',
    name: 'Lagos Tote Bag',
    description: 'Spacious leather tote perfect for everyday',
    priceNGN: 1450000,
    images: [],
    tags: ['bags','tote'],
    sizes: [],
    colors: ['brown','black'],
    inStock: true,
    gender: 'women',
    category: 'bags',
    brand: 'Luxe Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'w-bag-2',
    slug: 'crossbody-mini',
    name: 'Crossbody Mini Bag',
    description: 'Compact crossbody for essentials',
    priceNGN: 850000,
    images: [],
    tags: ['bags','crossbody'],
    sizes: [],
    colors: ['black','gold'],
    inStock: true,
    gender: 'women',
    category: 'bags',
    brand: 'Luxe Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  // Native Wear
  {
    id: 'w-trad-1',
    slug: 'ankara-maxi-dress',
    name: 'Ankara Maxi Dress',
    description: 'Flowing maxi with authentic Ankara print',
    priceNGN: 3200000,
    images: [],
    tags: ['nativewear','ankara'],
    sizes: ['S','M','L','XL'],
    colors: ['multi'],
    inStock: true,
    gender: 'women',
    category: 'nativewear',
    brand: 'Ankara Vibes',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'm-trad-1',
    slug: 'agbada-set',
    name: 'Classic Agbada Set',
    description: 'Traditional Agbada with embroidery',
    priceNGN: 4500000,
    images: [],
    tags: ['nativewear','agbada'],
    sizes: ['M','L','XL'],
    colors: ['white','gold'],
    inStock: true,
    gender: 'men',
    category: 'nativewear',
    brand: 'Royal Agbada',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  // Outerwear
  {
    id: 'w-outer-1',
    slug: 'bomber-jacket-gold',
    name: 'Gold Trim Bomber',
    description: 'Satin bomber with gold accents',
    priceNGN: 2150000,
    images: [],
    tags: ['outerwear','jacket'],
    sizes: ['S','M','L'],
    colors: ['black','green'],
    inStock: true,
    gender: 'women',
    category: 'outerwear',
    brand: 'Naija Street',
    imageUrl: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'm-outer-1',
    slug: 'denim-jacket',
    name: 'Distressed Denim Jacket',
    description: 'Classic denim with modern fit',
    priceNGN: 1950000,
    images: [],
    tags: ['outerwear','denim'],
    sizes: ['M','L','XL'],
    colors: ['blue','black'],
    inStock: true,
    gender: 'men',
    category: 'outerwear',
    brand: 'Urban Motion',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  // Beauty
  {
    id: 'beauty-1',
    slug: 'glow-serum',
    name: 'Nigerian Glow Serum',
    description: 'Natural ingredients for radiant skin',
    priceNGN: 680000,
    images: [],
    tags: ['beauty','skincare'],
    sizes: ['30ml'],
    colors: [],
    inStock: true,
    gender: 'unisex',
    category: 'beauty',
    brand: 'Pure Essence',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'beauty-2',
    slug: 'matte-lipstick-set',
    name: 'Matte Lipstick Collection',
    description: 'Set of 5 vibrant shades',
    priceNGN: 950000,
    images: [],
    tags: ['beauty','makeup'],
    sizes: [],
    colors: ['multi'],
    inStock: true,
    gender: 'women',
    category: 'beauty',
    brand: 'Pure Essence',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
  },
  // Kids
  {
    id: 'kids-1',
    slug: 'kids-ankara-dress',
    name: 'Girls Ankara Dress',
    description: 'Cute dress with traditional prints',
    priceNGN: 780000,
    images: [],
    tags: ['kids','dress'],
    sizes: ['2-3Y','4-5Y','6-7Y'],
    colors: ['multi'],
    inStock: true,
    gender: 'kids',
    category: 'dresses',
    brand: 'Little Stars',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kids-2',
    slug: 'boys-shorts-set',
    name: 'Boys Casual Set',
    description: 'T-shirt and shorts combo',
    priceNGN: 650000,
    images: [],
    tags: ['kids','casual'],
    sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'],
    colors: ['green','white'],
    inStock: true,
    gender: 'kids',
    category: 'tshirts',
    brand: 'Little Stars',
    imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=900&q=80',
  },
];

export function listProducts(gender?: Gender, category?: Category, brand?: string): CatalogProduct[] {
  return catalog.filter(p =>
    (!gender || p.gender === gender) &&
    (!category || p.category === category) &&
    (!brand || p.brand === brand)
  );
}

export function listBrands(): string[] {
  const brands = new Set(catalog.map(p => p.brand));
  return Array.from(brands).sort();
}

export function listBrandStats(): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  catalog.forEach((product) => {
    counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getBySlug(slug: string): CatalogProduct | undefined {
  return catalog.find(p => p.slug === slug);
}
