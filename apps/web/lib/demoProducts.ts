import type { Product } from '@gemcart/core';

export const demoProducts: Product[] = [
  { 
    id: 'p1', 
    slug: 'gemcart-classic-tee', 
    name: 'GemCart Classic Tee', 
    description: 'Premium cotton tee with embroidered logo', 
    priceNGN: 850000, 
    images: [], 
    tags: ['tees', 'essentials'], 
    sizes: ['S','M','L','XL'], 
    colors: ['black', 'white', 'green'], 
    inStock: true 
  },
  { 
    id: 'p2', 
    slug: 'lagos-vibes-hoodie', 
    name: 'Lagos Vibes Hoodie', 
    description: 'Cozy streetwear hoodie with Lagos skyline print', 
    priceNGN: 1950000, 
    images: [], 
    tags: ['hoodies', 'streetwear'], 
    sizes: ['M','L','XL'], 
    colors: ['black', 'grey'], 
    inStock: true 
  },
  {
    id: 'p3',
    slug: 'naija-pride-snapback',
    name: 'Naija Pride Snapback',
    description: 'Adjustable snapback with Nigerian flag accents',
    priceNGN: 550000,
    images: [],
    tags: ['accessories', 'hats'],
    sizes: ['One Size'],
    colors: ['green', 'white'],
    inStock: true
  },
  {
    id: 'p4',
    slug: 'ankara-fusion-bomber',
    name: 'Ankara Fusion Bomber',
    description: 'Modern bomber jacket with Ankara fabric details',
    priceNGN: 2850000,
    images: [],
    tags: ['jackets', 'premium'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['multi'],
    inStock: true
  },
  {
    id: 'p5',
    slug: 'gem-level-joggers',
    name: 'Gem Level Joggers',
    description: 'Comfortable joggers with gem rank patches',
    priceNGN: 1450000,
    images: [],
    tags: ['bottoms', 'streetwear'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['black', 'grey', 'navy'],
    inStock: true
  },
  {
    id: 'p6',
    slug: 'afrobeat-graphic-tee',
    name: 'Afrobeat Graphic Tee',
    description: 'Bold graphic tee celebrating Afrobeat culture',
    priceNGN: 950000,
    images: [],
    tags: ['tees', 'graphics'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white'],
    inStock: true
  }
];

export function getProductById(id: string) {
  return demoProducts.find(p => p.id === id);
}

export function getProductBySlug(slug: string) {
  return demoProducts.find(p => p.slug === slug);
}