'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@gemcart/ui';
import { 
  ShoppingBag, 
  Search,
  Menu,
  X,
  User,
  Heart,
  Package,
  Gem,
  LogOut,
  UserCircle,
  Gamepad2
} from 'lucide-react';

type Gender = 'women' | 'men';
type CategoryKey = 'sale' | 'new-in' | 'clothing' | 'shoes' | 'accessories' | 'brands' | 'native-wear';

// Category mega menu data for Women
const womenMegaMenus: Record<CategoryKey, { columns: { title: string; items: { name: string; href: string; highlight?: boolean }[] }[]; featured?: { image: string; title: string; href: string; comingSoon?: boolean } }> = {
  'sale': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Sale', href: '/shop?gender=women&filter=sale', highlight: true },
          { name: 'Dresses', href: '/shop?gender=women&category=dresses&filter=sale' },
          { name: 'Tops', href: '/shop?gender=women&category=tops&filter=sale' },
          { name: 'Trousers & Leggings', href: '/shop?gender=women&category=trousers&filter=sale' },
          { name: 'Jeans', href: '/shop?gender=women&category=jeans&filter=sale' },
          { name: 'Shoes', href: '/shop?gender=women&category=shoes&filter=sale' },
          { name: 'Accessories', href: '/shop?gender=women&category=accessories&filter=sale' },
        ]
      },
      {
        title: 'SHOP BY DISCOUNT',
        items: [
          { name: 'Up to 30% off', href: '/shop?gender=women&discount=30' },
          { name: 'Up to 50% off', href: '/shop?gender=women&discount=50' },
          { name: 'Up to 70% off', href: '/shop?gender=women&discount=70' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop', title: 'SALE: UP TO 70% OFF', href: '/shop?gender=women&filter=sale', comingSoon: true }
  },
  'new-in': {
    columns: [
      {
        title: 'NEW PRODUCTS',
        items: [
          { name: 'View All New In', href: '/shop?gender=women&filter=new', highlight: true },
          { name: 'New In: Today', href: '/shop?gender=women&filter=new-today', highlight: true },
          { name: 'Bestsellers', href: '/shop?gender=women&filter=bestsellers' },
        ]
      },
      {
        title: 'SHOP BY CATEGORY',
        items: [
          { name: 'Clothing', href: '/shop?gender=women&category=clothing&filter=new' },
          { name: 'Dresses', href: '/shop?gender=women&category=dresses&filter=new' },
          { name: 'Shoes', href: '/shop?gender=women&category=shoes&filter=new' },
          { name: 'Accessories', href: '/shop?gender=women&category=accessories&filter=new' },
          { name: 'Bags', href: '/shop?gender=women&category=bags&filter=new' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop', title: 'NEW ARRIVALS', href: '/shop?gender=women&filter=new' }
  },
  'clothing': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Clothing', href: '/shop?gender=women&category=clothing', highlight: true },
          { name: 'Dresses', href: '/shop?gender=women&category=dresses' },
          { name: 'Tops', href: '/shop?gender=women&category=tops' },
          { name: 'T-Shirts & Vests', href: '/shop?gender=women&category=tshirts' },
          { name: 'Blouses & Shirts', href: '/shop?gender=women&category=shirts' },
          { name: 'Trousers & Leggings', href: '/shop?gender=women&category=trousers' },
          { name: 'Jeans', href: '/shop?gender=women&category=jeans' },
          { name: 'Skirts', href: '/shop?gender=women&category=skirts' },
          { name: 'Shorts', href: '/shop?gender=women&category=shorts' },
          { name: 'Hoodies & Sweatshirts', href: '/shop?gender=women&category=hoodies' },
          { name: 'Jackets & Coats', href: '/shop?gender=women&category=outerwear' },
          { name: 'Knitwear', href: '/shop?gender=women&category=knitwear' },
          { name: 'Swimwear', href: '/shop?gender=women&category=swimwear' },
          { name: 'Activewear', href: '/shop?gender=women&category=activewear' },
        ]
      },
      {
        title: 'SHOP BY OCCASION',
        items: [
          { name: 'Workwear', href: '/shop?gender=women&occasion=workwear' },
          { name: 'Party & Going Out', href: '/shop?gender=women&occasion=party' },
          { name: 'Wedding Guest', href: '/shop?gender=women&occasion=wedding' },
          { name: 'Holiday', href: '/shop?gender=women&occasion=holiday' },
          { name: 'Casual', href: '/shop?gender=women&occasion=casual' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop', title: 'TRENDING STYLES', href: '/shop?gender=women&category=clothing' }
  },
  'shoes': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Shoes', href: '/shop?gender=women&category=shoes', highlight: true },
          { name: 'Heels', href: '/shop?gender=women&category=shoes&type=heels' },
          { name: 'Sandals', href: '/shop?gender=women&category=shoes&type=sandals' },
          { name: 'Trainers', href: '/shop?gender=women&category=shoes&type=trainers' },
          { name: 'Boots', href: '/shop?gender=women&category=shoes&type=boots' },
          { name: 'Flats', href: '/shop?gender=women&category=shoes&type=flats' },
          { name: 'Loafers', href: '/shop?gender=women&category=shoes&type=loafers' },
          { name: 'Slides & Slippers', href: '/shop?gender=women&category=shoes&type=slides' },
        ]
      },
      {
        title: 'SHOP BY BRAND',
        items: [
          { name: 'Luxe Steps', href: '/shop?gender=women&category=shoes&brand=luxe-steps' },
          { name: 'Nike', href: '/shop?gender=women&category=shoes&brand=nike' },
          { name: 'Kicks & Co', href: '/shop?gender=women&category=shoes&brand=kicks-co' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop', title: 'TRENDING SHOES', href: '/shop?gender=women&category=shoes', comingSoon: true }
  },
  'accessories': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Accessories', href: '/shop?gender=women&category=accessories', highlight: true },
          { name: 'Bags', href: '/shop?gender=women&category=bags' },
          { name: 'Jewellery', href: '/shop?gender=women&category=jewellery' },
          { name: 'Watches', href: '/shop?gender=women&category=watches' },
          { name: 'Sunglasses', href: '/shop?gender=women&category=sunglasses' },
          { name: 'Hair Accessories', href: '/shop?gender=women&category=hair-accessories' },
          { name: 'Scarves', href: '/shop?gender=women&category=scarves' },
          { name: 'Belts', href: '/shop?gender=women&category=belts' },
        ]
      },
      {
        title: 'SHOP BY JEWELLERY',
        items: [
          { name: 'Necklaces', href: '/shop?gender=women&category=jewellery&type=necklaces' },
          { name: 'Earrings', href: '/shop?gender=women&category=jewellery&type=earrings' },
          { name: 'Rings', href: '/shop?gender=women&category=jewellery&type=rings' },
          { name: 'Bracelets', href: '/shop?gender=women&category=jewellery&type=bracelets' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=500&fit=crop', title: 'ACCESSORIZE', href: '/shop?gender=women&category=accessories', comingSoon: true }
  },
  'brands': {
    columns: [
      {
        title: 'TOP BRANDS',
        items: [
          { name: 'A-Z of Brands', href: '/brands', highlight: true },
          { name: 'Luxe Atelier', href: '/shop?brand=luxe-atelier' },
          { name: 'Ankara Vibes', href: '/shop?brand=ankara-vibes' },
          { name: 'Modern Muse', href: '/shop?brand=modern-muse' },
          { name: 'Naija Street', href: '/shop?brand=naija-street' },
          { name: 'Heritage Gems', href: '/shop?brand=heritage-gems' },
          { name: 'Pure Essence', href: '/shop?brand=pure-essence' },
        ]
      },
      {
        title: 'FEATURED',
        items: [
          { name: 'New Brands', href: '/brands?filter=new' },
          { name: 'Bestselling Brands', href: '/brands?filter=bestsellers' },
          { name: 'Premium Brands', href: '/brands?filter=premium' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop', title: 'SHOP BRANDS', href: '/brands' }
  },
  'native-wear': {
    columns: [
      {
        title: 'SHOP BY STYLE',
        items: [
          { name: 'View All Native Wear', href: '/shop?gender=women&category=nativewear', highlight: true },
          { name: 'Ankara Dresses', href: '/shop?gender=women&category=nativewear&style=ankara' },
          { name: 'Aso Ebi', href: '/shop?gender=women&category=nativewear&style=aso-ebi' },
          { name: 'Kaftans', href: '/shop?gender=women&category=nativewear&style=kaftan' },
          { name: 'Boubou', href: '/shop?gender=women&category=nativewear&style=boubou' },
          { name: 'Iro & Buba', href: '/shop?gender=women&category=nativewear&style=iro-buba' },
        ]
      },
      {
        title: 'SHOP BY OCCASION',
        items: [
          { name: 'Wedding', href: '/shop?gender=women&category=nativewear&occasion=wedding' },
          { name: 'Church', href: '/shop?gender=women&category=nativewear&occasion=church' },
          { name: 'Owambe', href: '/shop?gender=women&category=nativewear&occasion=owambe' },
          { name: 'Everyday', href: '/shop?gender=women&category=nativewear&occasion=everyday' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=500&fit=crop', title: 'NATIVE COLLECTION', href: '/shop?gender=women&category=nativewear' }
  }
};

// Category mega menu data for Men
const menMegaMenus: Record<CategoryKey, { columns: { title: string; items: { name: string; href: string; highlight?: boolean }[] }[]; featured?: { image: string; title: string; href: string; comingSoon?: boolean } }> = {
  'sale': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Sale', href: '/shop?gender=men&filter=sale', highlight: true },
          { name: 'T-Shirts', href: '/shop?gender=men&category=tshirts&filter=sale' },
          { name: 'Shirts', href: '/shop?gender=men&category=shirts&filter=sale' },
          { name: 'Trousers', href: '/shop?gender=men&category=trousers&filter=sale' },
          { name: 'Shoes', href: '/shop?gender=men&category=shoes&filter=sale' },
          { name: 'Accessories', href: '/shop?gender=men&category=accessories&filter=sale' },
        ]
      },
      {
        title: 'SHOP BY DISCOUNT',
        items: [
          { name: 'Up to 30% off', href: '/shop?gender=men&discount=30' },
          { name: 'Up to 50% off', href: '/shop?gender=men&discount=50' },
          { name: 'Up to 70% off', href: '/shop?gender=men&discount=70' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop', title: 'SALE: UP TO 70% OFF', href: '/shop?gender=men&filter=sale', comingSoon: true }
  },
  'new-in': {
    columns: [
      {
        title: 'NEW PRODUCTS',
        items: [
          { name: 'View All New In', href: '/shop?gender=men&filter=new', highlight: true },
          { name: 'New In: Today', href: '/shop?gender=men&filter=new-today', highlight: true },
          { name: 'Bestsellers', href: '/shop?gender=men&filter=bestsellers' },
        ]
      },
      {
        title: 'SHOP BY CATEGORY',
        items: [
          { name: 'Clothing', href: '/shop?gender=men&category=clothing&filter=new' },
          { name: 'Shoes', href: '/shop?gender=men&category=shoes&filter=new' },
          { name: 'Accessories', href: '/shop?gender=men&category=accessories&filter=new' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', title: 'NEW ARRIVALS', href: '/shop?gender=men&filter=new' }
  },
  'clothing': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Clothing', href: '/shop?gender=men&category=clothing', highlight: true },
          { name: 'T-Shirts & Vests', href: '/shop?gender=men&category=tshirts' },
          { name: 'Shirts', href: '/shop?gender=men&category=shirts' },
          { name: 'Polo Shirts', href: '/shop?gender=men&category=polo' },
          { name: 'Hoodies & Sweatshirts', href: '/shop?gender=men&category=hoodies' },
          { name: 'Trousers & Chinos', href: '/shop?gender=men&category=trousers' },
          { name: 'Jeans', href: '/shop?gender=men&category=jeans' },
          { name: 'Shorts', href: '/shop?gender=men&category=shorts' },
          { name: 'Joggers', href: '/shop?gender=men&category=joggers' },
          { name: 'Jackets & Coats', href: '/shop?gender=men&category=outerwear' },
          { name: 'Suits & Tailoring', href: '/shop?gender=men&category=suits' },
          { name: 'Activewear', href: '/shop?gender=men&category=activewear' },
          { name: 'Swimwear', href: '/shop?gender=men&category=swimwear' },
        ]
      },
      {
        title: 'SHOP BY STYLE',
        items: [
          { name: 'Streetwear', href: '/shop?gender=men&style=streetwear' },
          { name: 'Smart Casual', href: '/shop?gender=men&style=smart-casual' },
          { name: 'Workwear', href: '/shop?gender=men&style=workwear' },
          { name: 'Athleisure', href: '/shop?gender=men&style=athleisure' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop', title: 'TRENDING STYLES', href: '/shop?gender=men&category=clothing' }
  },
  'shoes': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Shoes', href: '/shop?gender=men&category=shoes', highlight: true },
          { name: 'Trainers', href: '/shop?gender=men&category=shoes&type=trainers' },
          { name: 'Boots', href: '/shop?gender=men&category=shoes&type=boots' },
          { name: 'Loafers', href: '/shop?gender=men&category=shoes&type=loafers' },
          { name: 'Sandals', href: '/shop?gender=men&category=shoes&type=sandals' },
          { name: 'Smart Shoes', href: '/shop?gender=men&category=shoes&type=smart' },
          { name: 'Slides', href: '/shop?gender=men&category=shoes&type=slides' },
        ]
      },
      {
        title: 'SHOP BY BRAND',
        items: [
          { name: 'Nike', href: '/shop?gender=men&category=shoes&brand=nike' },
          { name: 'Kicks & Co', href: '/shop?gender=men&category=shoes&brand=kicks-co' },
          { name: 'Urban Motion', href: '/shop?gender=men&category=shoes&brand=urban-motion' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop', title: 'TRENDING SHOES', href: '/shop?gender=men&category=shoes', comingSoon: true }
  },
  'accessories': {
    columns: [
      {
        title: 'SHOP BY PRODUCT',
        items: [
          { name: 'View All Accessories', href: '/shop?gender=men&category=accessories', highlight: true },
          { name: 'Bags & Wallets', href: '/shop?gender=men&category=bags' },
          { name: 'Watches', href: '/shop?gender=men&category=watches' },
          { name: 'Jewellery', href: '/shop?gender=men&category=jewellery' },
          { name: 'Sunglasses', href: '/shop?gender=men&category=sunglasses' },
          { name: 'Caps & Hats', href: '/shop?gender=men&category=hats' },
          { name: 'Belts', href: '/shop?gender=men&category=belts' },
          { name: 'Ties', href: '/shop?gender=men&category=ties' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop', title: 'ACCESSORIZE', href: '/shop?gender=men&category=accessories', comingSoon: true }
  },
  'brands': {
    columns: [
      {
        title: 'TOP BRANDS',
        items: [
          { name: 'A-Z of Brands', href: '/brands', highlight: true },
          { name: 'Naija Street', href: '/shop?brand=naija-street' },
          { name: 'Urban Motion', href: '/shop?brand=urban-motion' },
          { name: 'Royal Agbada', href: '/shop?brand=royal-agbada' },
          { name: 'Luxe Atelier', href: '/shop?brand=luxe-atelier' },
          { name: 'Kicks & Co', href: '/shop?brand=kicks-co' },
          { name: 'Nike', href: '/shop?brand=nike' },
        ]
      },
      {
        title: 'FEATURED',
        items: [
          { name: 'New Brands', href: '/brands?filter=new' },
          { name: 'Bestselling Brands', href: '/brands?filter=bestsellers' },
          { name: 'Premium Brands', href: '/brands?filter=premium' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', title: 'SHOP BRANDS', href: '/brands' }
  },
  'native-wear': {
    columns: [
      {
        title: 'SHOP BY STYLE',
        items: [
          { name: 'View All Native Wear', href: '/shop?gender=men&category=nativewear', highlight: true },
          { name: 'Agbada', href: '/shop?gender=men&category=nativewear&style=agbada' },
          { name: 'Kaftan', href: '/shop?gender=men&category=nativewear&style=kaftan' },
          { name: 'Dashiki', href: '/shop?gender=men&category=nativewear&style=dashiki' },
          { name: 'Senator', href: '/shop?gender=men&category=nativewear&style=senator' },
          { name: 'Ankara Shirts', href: '/shop?gender=men&category=nativewear&style=ankara' },
        ]
      },
      {
        title: 'SHOP BY OCCASION',
        items: [
          { name: 'Wedding', href: '/shop?gender=men&category=nativewear&occasion=wedding' },
          { name: 'Church', href: '/shop?gender=men&category=nativewear&occasion=church' },
          { name: 'Owambe', href: '/shop?gender=men&category=nativewear&occasion=owambe' },
          { name: 'Everyday', href: '/shop?gender=men&category=nativewear&occasion=everyday' },
        ]
      }
    ],
    featured: { image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=500&fit=crop', title: 'NATIVE COLLECTION', href: '/shop?gender=men&category=nativewear' }
  }
};

const categoryNavItems: { name: string; key: CategoryKey; highlight?: boolean }[] = [
  { name: 'Sale', key: 'sale', highlight: true },
  { name: 'New In', key: 'new-in' },
  { name: 'Clothing', key: 'clothing' },
  { name: 'Shoes', key: 'shoes' },
  { name: 'Accessories', key: 'accessories' },
  { name: 'Brands', key: 'brands' },
  { name: 'Native Wear', key: 'native-wear' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeGender, setActiveGender] = useState<Gender | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const cartCount = 2;
  const wishlistCount = 5;
  const rewardPoints = 420;
  const userName = 'John Doe';
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleGenderEnter = (gender: Gender) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveGender(gender);
    setActiveCategory(null);
  };

  const handleCategoryEnter = (key: CategoryKey) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveCategory(key);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveGender(null);
      setActiveCategory(null);
    }, 150);
  };

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
  };

  const getMegaMenuData = () => {
    if (!activeGender || !activeCategory) return null;
    return activeGender === 'women' ? womenMegaMenus[activeCategory] : menMegaMenus[activeCategory];
  };

  const megaMenuData = getMegaMenuData();
  const showCategoryNav = activeGender !== null;
  const showMegaMenu = activeGender !== null && activeCategory !== null && megaMenuData !== null;

  const isTransparent = isHomePage && !scrolled && !mobileMenuOpen && !activeGender;
  
  const navBgClass = isTransparent ? 'bg-transparent' : 'bg-white shadow-sm';
  const textClass = isTransparent ? 'text-white' : 'text-gray-900';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      {/* Top Announcement Bar */}
      <div className="bg-[#570a70] text-white text-center py-2 text-xs font-medium tracking-wide">
        <p>Free delivery on orders over ₦50,000 | Earn Royale points on every order</p>
      </div>

      {/* Main Nav Bar */}
      <nav className={`border-b ${isTransparent ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Left - Logo + Gender + Games */}
            <div className="flex items-center gap-8">
          {/* Logo */}
              <Link href="/" className="flex-shrink-0" aria-label="Zuka home">
            <Image
              src="/brand/zuka-wordmark-trimmed.png"
              alt="Zuka"
                  width={90}
                  height={28}
              priority
                  className={`h-7 w-auto ${isTransparent ? 'brightness-0 invert' : ''}`}
            />
          </Link>

              {/* Gender Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <button
                  onMouseEnter={() => handleGenderEnter('women')}
                  onMouseLeave={handleMenuLeave}
                  className={`text-sm font-bold tracking-wide py-4 border-b-2 transition-colors ${
                    activeGender === 'women'
                      ? 'border-[#570a70] text-[#570a70]'
                      : `border-transparent ${isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-[#570a70]'}`
                  }`}
                >
                  WOMEN
                </button>
                <button
                  onMouseEnter={() => handleGenderEnter('men')}
                  onMouseLeave={handleMenuLeave}
                  className={`text-sm font-bold tracking-wide py-4 border-b-2 transition-colors ${
                    activeGender === 'men'
                      ? 'border-[#570a70] text-[#570a70]'
                      : `border-transparent ${isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-[#570a70]'}`
                  }`}
                >
                  MEN
                </button>
              <Link 
                  href="/games"
                  className={`flex items-center gap-1.5 text-sm font-bold tracking-wide py-4 transition-colors ${
                    isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-[#570a70]'
                  }`}
                >
                  <Gamepad2 className="h-4 w-4" />
                  GAMES
                </Link>
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search for items and brands"
                  className="w-full px-4 py-2.5 pl-10 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#570a70] placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

            {/* Right Section */}
            <div className="flex items-center gap-1">
              {/* Sign In Button - Only show when not signed in */}
              {!isSignedIn && (
                <Link href="/auth/signin" className="hidden md:block">
                  <Button 
                    size="sm" 
                    className={`${isTransparent ? 'bg-white text-black hover:bg-[#e49b09]' : 'bg-[#570a70] text-white hover:bg-[#3d074e]'} rounded-full px-4 h-8 text-xs font-semibold`}
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Rewards - Only show when signed in */}
              {isSignedIn && (
                <Link href="/rewards" className="hidden md:flex items-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e49b09] text-black rounded-full text-xs font-bold">
                    <Gem className="h-3.5 w-3.5" />
                    <span>{rewardPoints}</span>
                  </div>
                </Link>
              )}

              {/* User */}
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${textClass} hover:bg-black/5`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {isSignedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-[#e49b09]">{rewardPoints} points</p>
                        </div>
                        <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <UserCircle className="mr-3 h-4 w-4" /> My Account
                        </Link>
                        <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Package className="mr-3 h-4 w-4" /> My Orders
                        </Link>
                        <Link href="/rewards" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Gem className="mr-3 h-4 w-4" /> Rewards
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button 
                            onClick={() => setIsSignedIn(false)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <LogOut className="mr-3 h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3">
                          <Button 
                            className="w-full bg-[#570a70] hover:bg-[#3d074e] text-white"
                            onClick={() => setIsSignedIn(true)}
                          >
                            Sign In
                          </Button>
                        </div>
                        <div className="px-4 pb-3">
                          <Button variant="outline" className="w-full">
                            Join
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

            {/* Wishlist */}
              <Link href="/wishlist" className="relative">
                <Button variant="ghost" size="icon" className={`${textClass} hover:bg-black/5`}>
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e246a4] text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className={`${textClass} hover:bg-black/5`}>
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#570a70] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

              {/* Mobile Menu */}
              <Button 
                variant="ghost" 
                size="icon" 
                className={`lg:hidden ${textClass}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
                          </div>
                        </div>
                      </div>
      </nav>

      {/* Category Navigation - Shows when WOMEN or MEN is hovered */}
      {showCategoryNav && (
        <div 
          className="hidden lg:block bg-white border-b border-gray-100"
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="flex items-center justify-center gap-8 h-11">
              {categoryNavItems.map((item) => (
                <button
                  key={item.key}
                  onMouseEnter={() => handleCategoryEnter(item.key)}
                  className={`text-xs font-semibold tracking-wide transition-colors py-3 border-b-2 ${
                    activeCategory === item.key
                      ? 'border-[#570a70] text-[#570a70]'
                      : 'border-transparent'
                  } ${
                    item.highlight 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-700 hover:text-[#570a70]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu Dropdown - Shows when a category is hovered */}
      {showMegaMenu && (
        <div 
          className="absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40"
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
        >
          <div className="mx-auto max-w-[1400px] px-6 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Columns */}
              <div className={`${megaMenuData.featured ? 'col-span-9' : 'col-span-12'}`}>
                <div className="grid grid-cols-3 gap-8">
                  {megaMenuData.columns.map((column, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-4">{column.title}</h3>
                      <ul className="space-y-2">
                        {column.items.map((item) => (
                          <li key={item.name}>
                      <Link 
                              href={item.href}
                              className={`text-sm hover:underline ${
                                item.highlight 
                                  ? 'text-[#e246a4] font-semibold' 
                                  : 'text-gray-600 hover:text-[#570a70]'
                              }`}
                              onClick={() => { setActiveGender(null); setActiveCategory(null); }}
                            >
                              {item.name}
                      </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Image */}
              {megaMenuData.featured && (
                <div className="col-span-3">
                  <Link 
                    href={megaMenuData.featured.comingSoon ? '#' : megaMenuData.featured.href} 
                    className={`block relative group ${megaMenuData.featured.comingSoon ? 'cursor-default' : ''}`}
                    onClick={(e) => { 
                      if (megaMenuData.featured?.comingSoon) {
                        e.preventDefault();
                      } else {
                        setActiveGender(null); 
                        setActiveCategory(null);
                      }
                    }}
                  >
                    <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={megaMenuData.featured.image} 
                        alt={megaMenuData.featured.title}
                        fill
                        className={`object-cover transition-transform duration-500 ${
                          megaMenuData.featured.comingSoon 
                            ? 'grayscale opacity-60' 
                            : 'group-hover:scale-105'
                        }`}
                      />
                      <div className={`absolute inset-0 ${
                        megaMenuData.featured.comingSoon 
                          ? 'bg-black/50' 
                          : 'bg-gradient-to-t from-black/60 to-transparent'
                      }`} />
                      
                      {/* Coming Soon Badge */}
                      {megaMenuData.featured.comingSoon && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="bg-[#570a70] px-4 py-2 rounded-full mb-2">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Coming Soon</span>
                          </div>
                          <span className="text-white/80 text-xs">New styles dropping soon</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-white font-bold text-sm tracking-wide">{megaMenuData.featured.title}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4">
            {/* Search */}
              <div className="relative mb-4">
                <input
                  type="search"
                  placeholder="Search..."
                className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#570a70]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Gender + Games Links */}
            <div className="flex gap-2 mb-4">
              <Link 
                href="/shop?gender=women"
                className="flex-1 py-3 bg-[#570a70] text-white text-center text-sm font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                WOMEN
              </Link>
              <Link 
                href="/shop?gender=men"
                className="flex-1 py-3 bg-gray-100 text-gray-900 text-center text-sm font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                MEN
              </Link>
              <Link 
                href="/games"
                className="flex items-center justify-center gap-1 px-4 py-3 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Gamepad2 className="h-4 w-4" />
              </Link>
              </div>

            {/* Nav Links */}
            <div className="space-y-1">
              {categoryNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/shop?category=${item.key}`}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg ${
                    item.highlight ? 'text-red-500' : 'text-gray-700'
                  } hover:bg-gray-50`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
              
            {/* Account Section */}
            <div className="border-t border-gray-100 mt-4 pt-4">
                {isSignedIn ? (
                  <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#570a70] flex items-center justify-center text-white font-semibold">
                          {userName.charAt(0)}
                        </div>
                    <div>
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-[#e49b09]">{rewardPoints} points</p>
                    </div>
                  </div>
                  <Link href="/account" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle className="mr-3 h-4 w-4" /> My Account
                    </Link>
                  <Link href="/orders" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Package className="mr-3 h-4 w-4" /> My Orders
                    </Link>
                    <button 
                    onClick={() => { setIsSignedIn(false); setMobileMenuOpen(false); }}
                    className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                    <LogOut className="mr-3 h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                <div className="space-y-2">
                      <Button 
                    className="w-full bg-[#570a70] hover:bg-[#3d074e] text-white"
                    onClick={() => { setIsSignedIn(true); setMobileMenuOpen(false); }}
                      >
                        Sign In
                      </Button>
                  <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Join Zuka
                      </Button>
                    </div>
                )}
              </div>
            </div>
          </div>
        )}
    </header>
  );
}
