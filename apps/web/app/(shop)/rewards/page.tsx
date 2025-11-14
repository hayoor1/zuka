'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@gemcart/ui';
import { 
  Gift, 
  Sparkles, 
  ShoppingBag,
  Percent,
  Ticket,
  Clock,
  CheckCircle,
  Copy,
  TrendingUp,
  Gem,
  ArrowRight,
  Info,
  Zap,
  Award,
  Star
} from 'lucide-react';

// Count-up hook
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  return count;
}

type Reward = {
  id: string;
  title: string;
  description: string;
  code?: string;
  value: string;
  expiresIn?: string;
  claimed?: boolean;
  type: 'discount' | 'points' | 'shipping' | 'exclusive';
  minSpend?: number;
};

export default function RewardsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeRewards: Reward[] = [
    {
      id: '1',
      title: 'Welcome to Zuka',
      description: 'Exclusive discount for new members',
      code: 'ZUKA10',
      value: '10% OFF',
      expiresIn: '7 days',
      type: 'discount',
      minSpend: 50000
    },
    {
      id: '2',
      title: 'Free Delivery',
      description: 'On your next purchase',
      value: 'Free Shipping',
      expiresIn: '14 days',
      type: 'shipping',
      minSpend: 30000
    },
    {
      id: '3',
      title: 'Birthday Month Special',
      description: 'Celebrate with us',
      code: 'BDAY20',
      value: '20% OFF',
      expiresIn: '30 days',
      type: 'exclusive'
    }
  ];

  const pointsRewards = [
    { points: 500, reward: '₦5,000 OFF', available: true },
    { points: 1000, reward: '₦12,000 OFF', available: true },
    { points: 2000, reward: '₦30,000 OFF', available: false },
    { points: 5000, reward: 'VIP Access + ₦100,000 OFF', available: false },
  ];

  const memberBenefits = [
    { icon: Percent, title: 'Member Prices', description: 'Exclusive discounts on selected items' },
    { icon: Gem, title: 'Points on Purchase', description: 'Earn 1 point for every ₦100 spent' },
    { icon: Gift, title: 'Birthday Rewards', description: 'Special gift on your birthday month' },
    { icon: TrendingUp, title: 'Early Access', description: 'Shop new collections before everyone' },
  ];

  const currentPoints = 420;
  const nextTierPoints = 1000;
  const progressPercentage = (currentPoints / nextTierPoints) * 100;
  const animatedPoints = useCountUp(currentPoints, 2000);

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-green-50 min-h-screen pattern-adire">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-green-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-1.5">
              <Star className="inline mr-1 h-4 w-4" />
              Rewards Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Zuka Rewards</h1>
            <p className="text-xl opacity-90">Turn your shopping into savings</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Points Overview */}
        <Card className="mb-8 p-6 md:p-8 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-gold">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white shadow-gold">
                  <Gem className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Points Balance</h2>
                  <p className="text-gray-600">Keep earning to unlock more rewards</p>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-gradient-gold animate-count-up">{animatedPoints.toLocaleString()}</span>
                <span className="text-xl text-gray-600">points</span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Progress to Gold Tier</span>
                  <span className="font-bold text-yellow-600 animate-count-up">{nextTierPoints - animatedPoints} points to go</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 animate-progress-fill shadow-inner"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  {progressPercentage > 90 && (
                    <div className="absolute inset-0 animate-glow-pulse rounded-full" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/shop">
                <Button size="lg" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:shadow-gold font-semibold">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop & Earn Points
                </Button>
              </Link>
              <Link href="/games">
                <Button size="lg" variant="secondary" className="w-full font-semibold">
                  <Zap className="mr-2 h-5 w-5" />
                  Play Games to Earn
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Coupons */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Ticket className="mr-2 h-6 w-6 text-yellow-600" />
              Your Active Coupons
            </h2>
            <div className="space-y-4">
              {activeRewards.map((reward, index) => (
                <Card key={reward.id} className={`p-6 card-hover-lift border-2 border-gray-100 hover:border-yellow-200 animate-stagger-${Math.min(index + 1, 5)} ${
                  reward.expiresIn && parseInt(reward.expiresIn) < 3 ? 'animate-scale-pulse' : ''
                }`}>
                  <div className="relative animate-shimmer opacity-20 pointer-events-none absolute inset-0 rounded-lg" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          reward.type === 'discount' ? 'bg-yellow-100' :
                          reward.type === 'shipping' ? 'bg-blue-100' :
                          reward.type === 'exclusive' ? 'bg-green-100' :
                          'bg-gray-100'
                        }`}>
                          {reward.type === 'discount' && <Percent className="h-6 w-6 text-yellow-600" />}
                          {reward.type === 'shipping' && <Gift className="h-6 w-6 text-blue-600" />}
                          {reward.type === 'exclusive' && <Sparkles className="h-6 w-6 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{reward.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                          
                          {reward.code && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                <code className="text-sm font-mono font-bold text-gray-900">{reward.code}</code>
                                <button
                                  onClick={() => {
                                    copyCode(reward.code!);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-700 transition-colors"
                                >
                                  {copiedCode === reward.code ? (
                                    <CheckCircle className="h-5 w-5 animate-scale-pulse text-green-600" />
                                  ) : (
                                    <Copy className="h-5 w-5 hover:animate-icon-bounce" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-0 font-semibold">
                              {reward.value}
                            </Badge>
                            {reward.minSpend && (
                              <span className="text-gray-600 flex items-center">
                                <Info className="mr-1 h-3 w-3" />
                                Min. spend ₦{reward.minSpend.toLocaleString()}
                              </span>
                            )}
                            {reward.expiresIn && (
                              <span className="flex items-center text-gray-600">
                                <Clock className="mr-1 h-4 w-4" />
                                Expires in {reward.expiresIn}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link href="/shop">
                      <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:shadow-gold font-semibold whitespace-nowrap">
                        Use Now
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Redeem Points */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="mr-2 h-6 w-6 text-yellow-600" />
                Redeem Points
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pointsRewards.map((item, index) => (
                  <Card 
                    key={index} 
                    className={`p-6 border-2 card-hover-lift animate-stagger-${Math.min(index + 1, 5)} ${
                      !item.available 
                        ? 'opacity-60 border-gray-200 bg-gray-50' 
                        : 'cursor-pointer border-yellow-200 hover:border-yellow-400 bg-white animate-shimmer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Gem className={`h-5 w-5 ${item.available ? 'text-yellow-500 animate-icon-bounce' : 'text-gray-400'}`} style={{ animationDelay: `${index * 0.1}s` }} />
                        <span className={`text-2xl font-bold ${item.available ? 'text-gradient-gold' : 'text-gray-400'}`}>
                          {item.points}
                        </span>
                      </div>
                      {item.available && (
                        <Badge className="bg-green-100 text-green-700 border-0">Available</Badge>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 text-lg mb-1">{item.reward}</p>
                    <p className="text-sm text-gray-600 mb-4">Discount voucher for your next purchase</p>
                    {item.available ? (
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:shadow-gold font-semibold">
                        Redeem Now
                      </Button>
                    ) : (
                      <div className="text-center text-sm text-gray-600 py-2 bg-gray-100 rounded-lg">
                        <Zap className="inline mr-1 h-3 w-3" />
                        {item.points - currentPoints} more points needed
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Member Benefits</h2>
            <Card className="p-6 mb-6 border-2 border-yellow-200 bg-white">
              <div className="space-y-4">
                {memberBenefits.map((benefit, index) => (
                  <div key={index} className={`flex gap-3 animate-stagger-${Math.min(index + 1, 5)}`}>
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg h-fit group-hover:animate-icon-bounce">
                      <benefit.icon className="h-5 w-5 text-white animate-icon-bounce" style={{ animationDelay: `${index * 0.2}s` }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* How it Works */}
            <Card className="p-6 bg-gray-50 border-2 border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5 text-yellow-600" />
                How Points Work
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Earn 1 point for every ₦100 spent</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Play games to earn bonus points</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Points expire after 12 months</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Combine points with sale prices</span>
                </li>
              </ul>
            </Card>

            {/* Invite Friends */}
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <Gift className="mb-3 h-10 w-10" />
              <h3 className="font-bold text-xl mb-2">Invite Friends</h3>
              <p className="text-white/90 mb-4 text-sm">
                Give ₦5,000, Get ₦5,000 when they make their first purchase
              </p>
              <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold">
                Share Invite Link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
