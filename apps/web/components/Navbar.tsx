'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Settings,
  LogOut,
  LogIn,
  UserCircle,
  CreditCard,
  HelpCircle,
  Bell,
  Gamepad2,
  Trophy
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const cartCount = 2;
  const wishlistCount = 5;
  const rewardPoints = 420;
  const userName = 'John Doe';
  const userMenuRef = useRef<HTMLDivElement>(null);
  
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

  const categories = [
    { name: 'Women', href: '/shop?gender=women' },
    { name: 'Men', href: '/shop?gender=men' },
    { name: 'New In', href: '/shop?filter=new' },
    { name: 'Accessories', href: '/shop?category=jewellery' },
    { name: 'Sale', href: '/shop?filter=sale' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-[#f0e6ff]">
      {/* Top Bar */}
      <div className="bg-brand-gradient text-white text-center py-2 text-xs font-semibold tracking-wide">
        <p className="flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-brand-gold">₦50k+ orders ship same-day in Lagos</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline">Earn Royale points on every checkout</span>
          <span className="sm:hidden">Complimentary shipping & royale rewards</span>
        </p>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full border border-brand-purple/10 bg-white/90 shadow-sm">
              <span className="text-[1.9rem] md:text-[2.25rem] font-black tracking-[0.35em] text-brand-purple drop-shadow-sm">
                ZUKA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={category.href} 
                className="text-sm font-semibold text-gray-600 hover:text-brand-purple transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-purple transition-colors">
                Experiential
                <ChevronDown className="h-4 w-4 text-brand-gold" />
              </button>
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-[#f1e7ff]">
                <Link href="/games" className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 hover:bg-[#fdf7ff] rounded-t-2xl transition-colors">
                  <Gamepad2 className="h-4 w-4 text-brand-purple" />
                  <div>
                    <div className="font-semibold">Play Games</div>
                    <div className="text-xs text-gray-500">Earn points playing</div>
                  </div>
                </Link>
                <Link href="/rewards" className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 hover:bg-[#fdf7ff] transition-colors">
                  <Gem className="h-4 w-4 text-brand-gold" />
                  <div>
                    <div className="font-semibold">Rewards Hub</div>
                    <div className="text-xs text-gray-500">Redeem your points</div>
                  </div>
                </Link>
                <Link href="/ranks" className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 hover:bg-[#fdf7ff] rounded-b-2xl transition-colors">
                  <Trophy className="h-4 w-4 text-brand-gold" />
                  <div>
                    <div className="font-semibold">Leaderboard</div>
                    <div className="text-xs text-gray-500">See top players</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex text-brand-purple hover:bg-[#fdf2ff]"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Reward Points */}
            <Link href="/rewards" className="hidden md:flex items-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-gold-gradient text-brand-purple rounded-full shadow-sm hover:shadow-md transition-all font-semibold text-xs uppercase tracking-wider">
                <Gem className="h-4 w-4 text-brand-purple" />
                <span>{rewardPoints}</span>
              </div>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative hidden md:block">
              <Button variant="ghost" size="icon" className="text-brand-purple hover:bg-[#fdf2ff]">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-xs font-medium text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-brand-purple hover:bg-[#fdf2ff]">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold-gradient text-[10px] font-semibold text-brand-purple">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Account */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-brand-purple hover:bg-[#fdf2ff] ${userMenuOpen ? 'bg-[#fdf2ff]' : ''}`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {isSignedIn ? (
                  <UserCircle className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#f1e7ff] py-3 z-50">
                  {isSignedIn ? (
                    <>
                      <div className="px-5 py-4 border-b border-[#f4ebff]">
                        <div className="flex items-center">
                          <div className="h-11 w-11 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold">
                            {userName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{userName}</p>
                            <p className="text-xs text-brand-purple flex items-center gap-1">
                              <Gem className="h-3 w-3 text-brand-gold" />
                              {rewardPoints} points
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/account/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserCircle className="mr-3 h-4 w-4" />
                        My Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="mr-3 h-4 w-4" />
                        My Orders
                      </Link>
                      <Link 
                        href="/wishlist" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart className="mr-3 h-4 w-4" />
                        Wishlist
                      </Link>
                      <Link 
                        href="/rewards" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Gem className="mr-3 h-4 w-4" />
                        Rewards & Points
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <Link 
                        href="/account/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      <Link 
                        href="/help" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <HelpCircle className="mr-3 h-4 w-4" />
                        Help & Support
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button 
                        onClick={() => {
                          setIsSignedIn(false);
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 mb-2">Welcome to Zuka!</p>
                        <p className="text-xs text-gray-600 mb-4">Sign in to access your account and earn rewards</p>
                        <Button 
                          className="w-full mb-2 bg-black text-white hover:bg-gray-900"
                          onClick={() => {
                            setIsSignedIn(true);
                            setUserMenuOpen(false);
                          }}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Create Account
                        </Button>
                      </div>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <Link 
                        href="/orders/track" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="mr-3 h-4 w-4" />
                        Track Order
                      </Link>
                      <Link 
                        href="/help" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <HelpCircle className="mr-3 h-4 w-4" />
                        Help & Support
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="hidden md:block pb-4 animate-slide-up">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for products, brands, categories..."
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-black border border-gray-200"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="space-y-2">
              <div className="relative mb-4">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-black border border-gray-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-3 flex items-center gap-1">
                  <Gem className="h-3 w-3 text-brand-purple" />
                  Experiential
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/games" className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-sm text-sm font-semibold text-brand-purple" onClick={() => setMobileMenuOpen(false)}>
                    <Gamepad2 className="h-4 w-4" />
                    Play Games
                  </Link>
                  <Link href="/rewards" className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-sm text-sm font-semibold text-brand-purple" onClick={() => setMobileMenuOpen(false)}>
                    <Gem className="h-4 w-4" />
                    Rewards
                  </Link>
                  <Link href="/ranks" className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-sm text-sm font-semibold text-brand-purple" onClick={() => setMobileMenuOpen(false)}>
                    <Trophy className="h-4 w-4" />
                    Leaderboard
                  </Link>
                  <Link href="/games" className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-sm text-sm font-semibold text-brand-purple" onClick={() => setMobileMenuOpen(false)}>
                    <Bell className="h-4 w-4" />
                    Weekly contests
                  </Link>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-2 mt-2">
                {isSignedIn ? (
                  <>
                    <div className="px-3 py-3 mb-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-medium">
                          {userName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Gem className="h-3 w-3" />
                            {rewardPoints} pts
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/account/profile" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <UserCircle className="mr-2 h-5 w-5" />
                      My Profile
                    </Link>
                    <Link href="/wishlist" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Wishlist ({wishlistCount})
                    </Link>
                    <Link href="/orders" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Package className="mr-2 h-5 w-5" />
                      My Orders
                    </Link>
                    <Link href="/rewards" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Gem className="mr-2 h-5 w-5" />
                      Rewards ({rewardPoints} pts)
                    </Link>
                    <Link href="/account/settings" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Link>
                    <button 
                      onClick={() => setIsSignedIn(false)}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-3">
                      <Button 
                        className="w-full mb-2 bg-black text-white hover:bg-gray-900"
                        onClick={() => setIsSignedIn(true)}
                      >
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </Button>
                      <Button variant="secondary" className="w-full">
                        Create Account
                      </Button>
                    </div>
                    <Link href="/orders/track" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Package className="mr-2 h-5 w-5" />
                      Track Order
                    </Link>
                    <Link href="/help" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      Help & Support
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
