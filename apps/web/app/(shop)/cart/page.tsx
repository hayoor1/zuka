'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Badge, Input } from '@gemcart/ui';
import { formatNGN } from '@gemcart/core';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Tag,
  Sparkles,
  TrendingUp
} from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'GemCart Classic Tee', price: 850000, quantity: 2, size: 'M', color: 'Black' },
    { id: '2', name: 'Lagos Vibes Hoodie', price: 1950000, quantity: 1, size: 'L', color: 'Grey' },
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - discount;
  const gemsEarned = Math.floor(total / 10000);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME1000') {
      setAppliedCoupon({ code: 'WELCOME1000', discount: 100000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf8ff] via-[#fffdf7] to-[#fbf8ff] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="bg-brand-gold-gradient text-brand-purple border-0 text-xs uppercase tracking-[0.5em] mb-4">
            Cart
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-brand-purple">Your Royale Edit</h1>
          <p className="mt-3 text-gray-600">Complete your look and collect purple & gold gems on every checkout.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.length === 0 ? (
              <Card className="p-12 text-center rounded-3xl border border-white/60 bg-white/90 shadow-xl shadow-[#4b0f7b]/10">
                <ShoppingBag className="mx-auto mb-6 h-12 w-12 text-brand-purple" />
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">Your curation is empty</h3>
                <p className="text-gray-600 mb-6">Discover couture pieces and earn gems.</p>
                <Link href="/shop">
                  <Button className="bg-brand-gradient text-white hover:opacity-90">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="p-5 rounded-3xl border border-[#f0e6ff] bg-white shadow-lg shadow-[#4b0f7b]/5">
                  <div className="flex gap-5">
                    {/* Product Image */}
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#f3e9ff] via-[#f9f2ff] to-[#f5e7ff] border border-[#f0e6ff] flex-shrink-0" />
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-brand-purple">{item.name}</h3>
                          <div className="mt-1 flex gap-2 text-sm text-gray-500">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>• Color: {item.color}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-brand-purple"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 rounded-full border border-[#e0d4ff] text-brand-purple hover:bg-[#f3e9ff]"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-brand-purple">{item.quantity}</span>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 rounded-full border border-[#e0d4ff] text-brand-purple hover:bg-[#f3e9ff]"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-brand-purple text-lg">{formatNGN(item.price * item.quantity)}</div>
                          <div className="text-xs text-brand-purple/70">
                            <Sparkles className="inline h-3 w-3 mr-1" />
                            +{Math.floor(item.price * item.quantity / 10000)} gems
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}

            {/* Recommendations */}
            {cartItems.length > 0 && (
              <Card className="p-6 rounded-3xl border border-[#f0e6ff] bg-gradient-to-r from-[#f9f2ff] to-[#fff7e1]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-brand-purple" />
                  <h3 className="font-semibold text-brand-purple">Complete Your Look</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Naija Pride Snapback', 'Gem Level Joggers'].map((name) => (
                    <div key={name} className="flex items-center justify-between rounded-2xl bg-white/90 border border-[#f0e6ff] px-4 py-3">
                      <span className="text-sm text-brand-purple/80">{name}</span>
                      <Button size="sm" className="bg-brand-gradient text-white">Add</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 rounded-3xl border border-[#f0e6ff] bg-white shadow-xl shadow-[#4b0f7b]/5">
              <h2 className="text-lg font-semibold mb-4 text-brand-purple">Order Summary</h2>
              
              {/* Coupon Input */}
              <div className="mb-6">
                <label className="text-sm text-brand-purple/70 mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    className="bg-brand-gradient text-white" 
                    onClick={applyCoupon}
                    disabled={!couponCode || !!appliedCoupon}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center text-sm text-brand-purple">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {appliedCoupon.code} applied!
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-[#e0d4ff] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-purple/70">Subtotal</span>
                  <span className="text-brand-purple font-medium">{formatNGN(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-purple">Discount</span>
                    <span className="text-brand-purple font-medium">-{formatNGN(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-brand-purple/70">Shipping</span>
                  <span className="text-brand-gold font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between border-t border-[#e0d4ff] pt-3">
                  <span className="font-semibold text-brand-purple">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-brand-purple">{formatNGN(total)}</div>
                    <div className="text-xs text-brand-purple/80">
                      <Sparkles className="inline h-3 w-3 mr-1" />
                      Earn {gemsEarned} gems
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button className="w-full mt-6 bg-brand-gradient text-white font-semibold hover:opacity-90" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 space-y-2 text-sm text-brand-purple/70">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-600 border-none">Secure</Badge>
                  <span>SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-gold-gradient text-brand-purple border-none">Rewards</Badge>
                  <span>Earn Royale gems with every purchase</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}