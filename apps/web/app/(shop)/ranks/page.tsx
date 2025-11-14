'use client';

import { Card, Badge, Button } from '@gemcart/ui';
import { levelForXP, GemLevels } from '@gemcart/core';
import { 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  Gift,
  Lock,
  CheckCircle,
  Star,
  Zap,
  ShoppingBag,
  Gamepad2,
  Users,
  Calendar
} from 'lucide-react';

const gemLevelDetails = {
  Quartz: { color: 'bg-gray-500', minXP: 0, perks: ['Welcome bonus ₦500', '5% off first order'] },
  Sapphire: { color: 'bg-blue-500', minXP: 100, perks: ['10% off all orders', 'Early access to sales'] },
  Ruby: { color: 'bg-red-500', minXP: 300, perks: ['15% off all orders', 'Free shipping on ₦10k+'] },
  Emerald: { color: 'bg-emerald-500', minXP: 700, perks: ['20% off all orders', 'Free shipping always', 'Birthday gift'] },
  Diamond: { color: 'bg-cyan-400', minXP: 1500, perks: ['25% off all orders', 'VIP customer service', 'Exclusive products'] },
  Obsidian: { color: 'bg-purple-600', minXP: 3000, perks: ['30% off all orders', 'Personal shopper', 'Private sales'] },
  Crown: { color: 'bg-gradient-to-r from-amber-400 to-amber-600', minXP: 6000, perks: ['Lifetime benefits', '40% off everything', 'Crown member events'] }
};

export default function RanksPage() {
  const currentXP = 420;
  const currentLevel = levelForXP(currentXP);
  const currentLevelIndex = GemLevels.indexOf(currentLevel);
  const nextLevel = currentLevelIndex < GemLevels.length - 1 ? GemLevels[currentLevelIndex + 1] : null;
  const nextLevelXP = nextLevel ? gemLevelDetails[nextLevel].minXP : 10000;
  const progress = ((currentXP - gemLevelDetails[currentLevel].minXP) / (nextLevelXP - gemLevelDetails[currentLevel].minXP)) * 100;

  const xpSources = [
    { action: 'Complete purchase', xp: 100, icon: <ShoppingBag className="h-4 w-4" /> },
    { action: 'Play daily game', xp: 50, icon: <Gamepad2 className="h-4 w-4" /> },
    { action: 'Refer a friend', xp: 200, icon: <Users className="h-4 w-4" /> },
    { action: 'Daily login streak', xp: 25, icon: <Calendar className="h-4 w-4" /> },
    { action: 'Leave product review', xp: 30, icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gem Ranks</h1>
        <p className="mt-2 text-gray-600">Level up to unlock exclusive perks and rewards</p>
      </div>

      {/* Current Status */}
      <Card gradient className="p-8 mb-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Badge variant="gem" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Current Rank
            </Badge>
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-16 w-16 rounded-full ${gemLevelDetails[currentLevel].color} flex items-center justify-center`}>
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{currentLevel}</h2>
                <p className="text-gray-600">{currentXP} XP Total</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            {nextLevel && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">{currentLevel}</span>
                  <span>{currentXP} / {nextLevelXP} XP</span>
                  <span className="font-medium">{nextLevel}</span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {nextLevelXP - currentXP} XP to {nextLevel}
                </p>
              </div>
            )}

            {/* Current Perks */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Your Perks</h3>
              <ul className="space-y-2">
                {gemLevelDetails[currentLevel].perks.map((perk) => (
                  <li key={perk} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* XP Sources */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Earn XP</h3>
            <div className="space-y-3">
              {xpSources.map((source) => (
                <div key={source.action} className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200">
                      {source.icon}
                    </div>
                    <span className="text-sm text-gray-700">{source.action}</span>
                  </div>
                  <Badge variant="success" size="sm">
                    +{source.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
            
            <Card className="mt-4 p-4 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Double XP Weekend!</p>
                  <p className="text-xs text-gray-600 mt-1">Earn 2x XP on all activities</p>
                </div>
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* All Levels */}
      <h2 className="text-xl font-semibold mb-4 text-gray-900">All Gem Levels</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GemLevels.map((level) => {
          const details = gemLevelDetails[level];
          const isUnlocked = GemLevels.indexOf(level) <= currentLevelIndex;
          const isCurrent = level === currentLevel;
          
          return (
            <Card 
              key={level} 
              className={`p-4 ${isCurrent ? 'border-green-500 shadow-lg shadow-green-500/20' : ''} ${!isUnlocked ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${details.color} flex items-center justify-center`}>
                    {isUnlocked ? (
                      <Trophy className="h-5 w-5 text-white" />
                    ) : (
                      <Lock className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{level}</h3>
                    <p className="text-xs text-gray-600">{details.minXP}+ XP</p>
                  </div>
                </div>
                {isCurrent && (
                  <Badge variant="success" size="sm">Current</Badge>
                )}
              </div>
              
              <ul className="space-y-1">
                {details.perks.map((perk) => (
                  <li key={perk} className="flex items-start text-xs text-gray-600">
                    <Gift className="mr-1 h-3 w-3 mt-0.5 flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Share Achievement */}
      <Card className="mt-8 p-6 text-center">
        <Star className="mx-auto mb-4 h-12 w-12 text-amber-400" />
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Share Your Achievement</h3>
        <p className="text-sm text-gray-600 mb-4">
          Show off your {currentLevel} rank to friends and earn bonus XP!
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary">
            Share on Twitter
          </Button>
          <Button variant="secondary">
            Share on WhatsApp
          </Button>
        </div>
      </Card>
    </div>
  );
}