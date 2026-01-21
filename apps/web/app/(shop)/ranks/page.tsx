'use client';

import { useState, useEffect } from 'react';
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
  Calendar,
  Play
} from 'lucide-react';
// Use lazy loaded animations for better performance
import { GemIcon, GemAnimation, CelebrationAnimation } from '../../../components/LazyAnimations';

type GemLevel = 'Quartz' | 'Sapphire' | 'Ruby' | 'Emerald' | 'Diamond' | 'Obsidian' | 'Crown';

const gemLevelDetails = {
  Quartz: { 
    color: 'bg-gray-500', 
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    minXP: 0, 
    perks: ['Welcome bonus ₦500', '5% off first order'] 
  },
  Sapphire: { 
    color: 'bg-blue-500', 
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    minXP: 100, 
    perks: ['10% off all orders', 'Early access to sales'] 
  },
  Ruby: { 
    color: 'bg-red-500', 
    gradient: 'from-red-400 via-red-500 to-red-600',
    minXP: 300, 
    perks: ['15% off all orders', 'Free shipping on ₦10k+'] 
  },
  Emerald: { 
    color: 'bg-emerald-500', 
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
    minXP: 700, 
    perks: ['20% off all orders', 'Free shipping always', 'Birthday gift'] 
  },
  Diamond: { 
    color: 'bg-cyan-400', 
    gradient: 'from-cyan-400 via-cyan-500 to-cyan-600',
    minXP: 1500, 
    perks: ['25% off all orders', 'VIP customer service', 'Exclusive products'] 
  },
  Obsidian: { 
    color: 'bg-purple-600', 
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
    minXP: 3000, 
    perks: ['30% off all orders', 'Personal shopper', 'Private sales'] 
  },
  Crown: { 
    color: 'bg-gradient-to-r from-amber-400 to-amber-600', 
    gradient: 'from-amber-400 via-amber-500 to-amber-600',
    minXP: 6000, 
    perks: ['Lifetime benefits', '40% off everything', 'Crown member events'] 
  }
};

// Count-up animation hook
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function
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

export default function RanksPage() {
  const [selectedGem, setSelectedGem] = useState<GemLevel | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // All customers start from Quartz (0 XP)
  const currentXP = 0; // Changed to 0 - everyone starts at Quartz
  const currentLevel = levelForXP(currentXP);
  const currentLevelIndex = GemLevels.indexOf(currentLevel);
  const nextLevel = currentLevelIndex < GemLevels.length - 1 ? GemLevels[currentLevelIndex + 1] : null;
  const nextLevelXP = nextLevel ? gemLevelDetails[nextLevel].minXP : 10000;
  const progress = ((currentXP - gemLevelDetails[currentLevel].minXP) / (nextLevelXP - gemLevelDetails[currentLevel].minXP)) * 100;
  
  // Animated XP counter
  const animatedXP = useCountUp(currentXP, 2000);

  const xpSources = [
    { action: 'Complete purchase', xp: 100, icon: <ShoppingBag className="h-4 w-4" /> },
    { action: 'Play daily game', xp: 50, icon: <Gamepad2 className="h-4 w-4" /> },
    { action: 'Refer a friend', xp: 200, icon: <Users className="h-4 w-4" /> },
    { action: 'Daily login streak', xp: 25, icon: <Calendar className="h-4 w-4" /> },
    { action: 'Leave product review', xp: 30, icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf8ff] via-[#fffdf7] to-[#fbf8ff] relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-brand-gold/20 animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <Badge className="bg-brand-gold-gradient text-brand-purple border-0 text-xs uppercase tracking-[0.5em] mb-4">
            <Sparkles className="mr-1 h-3 w-3 animate-sparkle" />
            Royale Ranks
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-brand-purple mb-3">Gem Ranks</h1>
          <p className="text-lg text-brand-purple/70 max-w-2xl mx-auto">Level up to unlock exclusive perks and rewards</p>
        </div>

      {/* Current Status */}
      <Card className="p-8 mb-8 rounded-3xl border border-[#f0e6ff] bg-gradient-to-br from-white via-[#f9f2ff] to-white shadow-xl shadow-[#570a70]/5 animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Badge className="bg-brand-gold-gradient text-brand-purple border-0 mb-4">
              <Sparkles className="mr-1 h-3 w-3 animate-sparkle" />
              Current Rank
            </Badge>
            <div className="flex items-center gap-4 mb-4">
              {/* New Animated Gem Icon */}
              <div className="relative">
                <GemIcon 
                  level={currentLevel} 
                  size="lg"
                  onClick={() => setSelectedGem(currentLevel)}
                  className="cursor-pointer animate-gem-pulse"
                />
                {/* Play Button Overlay */}
                <button
                  onClick={() => setSelectedGem(currentLevel)}
                  className="absolute -bottom-2 -right-2 p-2 bg-brand-gold-gradient rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="View Gem Animation"
                >
                  <Play className="h-4 w-4 text-brand-purple" />
                </button>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-brand-purple animate-count-up">{currentLevel}</h2>
                <p className="text-brand-purple/70 animate-count-up">
                  <span className="font-semibold">{animatedXP.toLocaleString()}</span> XP Total
                </p>
                <button
                  onClick={() => setShowCelebration(true)}
                  className="mt-2 text-sm text-brand-purple/60 hover:text-brand-purple transition-colors flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  View Level Up Animation
                </button>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            {nextLevel && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-brand-purple/70 mb-2">
                  <span className="font-medium">{currentLevel}</span>
                  <span className="animate-count-up">{animatedXP} / {nextLevelXP} XP</span>
                  <span className="font-medium">{nextLevel}</span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-[#e6daea] relative">
                  <div 
                    className="h-full bg-brand-gradient animate-progress-fill relative overflow-hidden"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  >
                    {/* Floating particles in progress bar */}
                    <div className="absolute inset-0">
                      {progress > 90 && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full animate-float-up"
                              style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: '2s',
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  {/* Glow effect when near level up */}
                  {progress > 90 && (
                    <div className="absolute inset-0 animate-glow-pulse rounded-full" />
                  )}
                </div>
                <p className="mt-2 text-sm text-brand-purple/70">
                  {nextLevelXP - currentXP} XP to {nextLevel}
                </p>
              </div>
            )}

            {/* Current Perks - Staggered Animation */}
            <div>
              <h3 className="font-semibold mb-2 text-brand-purple">Your Perks</h3>
              <ul className="space-y-2">
                {gemLevelDetails[currentLevel].perks.map((perk, index) => (
                  <li 
                    key={perk} 
                    className={`flex items-center text-sm text-brand-purple/80 animate-stagger-${index + 1}`}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-brand-gold animate-icon-bounce" style={{ animationDelay: `${index * 0.1}s` }} />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* XP Sources */}
          <div>
            <h3 className="font-semibold mb-4 text-brand-purple">Earn XP</h3>
            <div className="space-y-3">
              {xpSources.map((source, index) => (
                <div 
                  key={source.action} 
                  className={`flex items-center justify-between rounded-lg bg-white border border-[#e6daea] p-3 card-hover-lift animate-stagger-${index + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6daea] text-brand-purple group-hover:animate-icon-bounce">
                      <div className="group-hover:animate-icon-bounce">
                        {source.icon}
                      </div>
                    </div>
                    <span className="text-sm text-brand-purple/80">{source.action}</span>
                  </div>
                  <Badge className="bg-brand-gold-gradient text-brand-purple border-0 animate-shimmer">
                    +{source.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
            
            <Card className="mt-4 p-4 border-[#e49b09]/30 bg-gradient-to-r from-[#f7e1b5] to-[#f2cd84] animate-scale-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-purple">Double XP Weekend!</p>
                  <p className="text-xs text-brand-purple/70 mt-1">Earn 2x XP on all activities</p>
                </div>
                <Zap className="h-5 w-5 text-brand-gold animate-bounce-slow" />
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* All Levels */}
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-semibold mb-2 text-brand-purple">All Gem Levels</h2>
        <p className="text-brand-purple/70">Unlock exclusive benefits as you level up</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GemLevels.map((level, index) => {
          const details = gemLevelDetails[level];
          const isUnlocked = GemLevels.indexOf(level) <= currentLevelIndex;
          const isCurrent = level === currentLevel;
          
          return (
            <Card 
              key={level} 
              className={`p-5 rounded-2xl border transition-all card-hover-lift animate-stagger-${Math.min(index + 1, 5)} ${
                isCurrent 
                  ? 'border-brand-gold shadow-xl shadow-brand-gold/20 bg-gradient-to-br from-white to-[#f7e1b5] animate-pulse-glow' 
                  : 'border-[#f0e6ff] bg-white'
              } ${!isUnlocked ? 'opacity-60' : ''} ${isUnlocked && !isCurrent ? 'hover:border-brand-gold/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* New Animated Gem Icon */}
                  <div className="relative">
                    {isUnlocked ? (
                      <GemIcon 
                        level={level}
                        size="md"
                        onClick={() => setSelectedGem(level)}
                        className={`cursor-pointer ${isCurrent ? 'animate-gem-pulse' : ''}`}
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-full ${details.color} flex items-center justify-center shadow-md opacity-60`}>
                        <Lock className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-purple">{level}</h3>
                    <p className="text-xs text-brand-purple/60">{details.minXP}+ XP</p>
                  </div>
                </div>
                {isCurrent && (
                  <Badge className="bg-brand-gold-gradient text-brand-purple border-0 animate-scale-pulse">
                    Current
                  </Badge>
                )}
              </div>
              
              <ul className="space-y-1.5">
                {details.perks.map((perk, perkIndex) => (
                  <li 
                    key={perk} 
                    className="flex items-start text-xs text-brand-purple/70"
                  >
                    <Gift className={`mr-1.5 h-3 w-3 mt-0.5 flex-shrink-0 text-brand-gold ${
                      isUnlocked ? 'animate-icon-bounce' : ''
                    }`} style={{ animationDelay: `${perkIndex * 0.1}s` }} />
                    {perk}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Share Achievement */}
      <Card className="mt-12 p-8 text-center rounded-3xl border border-[#f0e6ff] bg-gradient-to-br from-[#f9f2ff] to-[#fff7e1] animate-fade-in">
        <Star className="mx-auto mb-4 h-12 w-12 text-brand-gold animate-bounce-slow" />
        <h3 className="text-xl font-semibold mb-2 text-brand-purple">Share Your Achievement</h3>
        <p className="text-sm text-brand-purple/70 mb-6">
          Show off your {currentLevel} rank to friends and earn bonus XP!
        </p>
        <div className="flex justify-center gap-3">
          <Button className="bg-brand-gradient text-white hover:opacity-90 card-hover-lift">
            Share on Twitter
          </Button>
          <Button className="bg-brand-gold-gradient text-brand-purple hover:opacity-90 card-hover-lift">
            Share on WhatsApp
          </Button>
        </div>
      </Card>
      </div>

      {/* Gem Animation Modal */}
      {selectedGem && (
        <GemAnimation
          level={selectedGem}
          isOpen={!!selectedGem}
          onClose={() => setSelectedGem(null)}
          autoPlay={true}
        />
      )}

      {/* Celebration Animation (for testing - can be triggered on level up) */}
      {showCelebration && (
        <CelebrationAnimation
          level={currentLevel}
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}
