'use client';

import { useEffect, useState } from 'react';
import { Trophy, Sparkles, Crown, Star } from 'lucide-react';
import { Button } from '@gemcart/ui';
import { GemIcon } from './GemAnimation';

type GemLevel = 'Quartz' | 'Sapphire' | 'Ruby' | 'Emerald' | 'Diamond' | 'Obsidian' | 'Crown';

interface CelebrationAnimationProps {
  level: GemLevel;
  onComplete: () => void;
  userName?: string;
}

export function CelebrationAnimation({ level, onComplete, userName }: CelebrationAnimationProps) {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGem, setShowGem] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setStep(1), 500); // Show confetti
    const timer2 = setTimeout(() => {
      setShowConfetti(true);
      setStep(2);
    }, 800);
    const timer3 = setTimeout(() => setShowGem(true), 1200);
    const timer4 = setTimeout(() => setStep(3), 2500);
    const timer5 = setTimeout(() => onComplete(), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  // Confetti particles
  const confettiColors = ['#e49b09', '#570a70', '#f59e0b', '#ef4444', '#3b82f6', '#10b981'];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 1}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          {/* Level Up Text */}
          <div className={`mb-8 transition-all duration-1000 ${
            step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="inline-block p-4 bg-brand-gold-gradient rounded-full mb-4 animate-pulse-glow">
              <Trophy className="h-12 w-12 text-brand-purple" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent animate-shimmer">
              LEVEL UP!
            </h1>
            <p className="text-2xl text-white/90">
              {userName ? `${userName}, you've` : "You've"} reached
            </p>
          </div>

          {/* Gem Display */}
          {showGem && (
            <div className={`mb-8 transition-all duration-1000 ${
              step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              <div className="relative inline-block">
                <div className="w-48 h-48 mx-auto relative">
                  {/* Gem with animation */}
                  <GemIcon level={level} size="lg" />
                  {/* Rotating rings */}
                  <div className="absolute inset-0 border-4 border-brand-gold/30 rounded-full animate-gem-rotate" />
                  <div className="absolute inset-4 border-2 border-brand-gold/20 rounded-full animate-gem-rotate-reverse" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mt-4 animate-fade-in">
                {level}
              </h2>
            </div>
          )}

          {/* Achievement Text */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${
            step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <p className="text-xl text-white/80 mb-6">
              🎉 Congratulations! You've unlocked exclusive perks! 🎉
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-white/90">
                <Star className="h-5 w-5 text-brand-gold animate-sparkle" />
                <span>New Perks Unlocked</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Sparkles className="h-5 w-5 text-brand-gold animate-sparkle" style={{ animationDelay: '0.2s' }} />
                <span>Exclusive Rewards</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className={`transition-all duration-1000 delay-500 ${
            step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Button
              onClick={onComplete}
              className="bg-brand-gold-gradient text-brand-purple font-semibold px-8 py-3 text-lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

