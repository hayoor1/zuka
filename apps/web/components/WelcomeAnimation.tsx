'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Gift, Star, Zap } from 'lucide-react';
import { Button } from '@gemcart/ui';

interface WelcomeAnimationProps {
  onComplete: () => void;
  userName?: string;
}

export function WelcomeAnimation({ onComplete, userName }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start animation sequence
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setStep(1), 1000);
    const timer3 = setTimeout(() => setStep(2), 2000);
    const timer4 = setTimeout(() => setStep(3), 3000);
    const timer5 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#3d074e] via-[#570a70] to-[#943aa2]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-brand-gold rounded-full animate-float-up opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Logo/Brand Animation */}
        <div className={`mb-8 transition-all duration-1000 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto bg-brand-gold-gradient rounded-full flex items-center justify-center animate-pulse-glow">
              <Sparkles className="h-16 w-16 text-brand-purple animate-sparkle" />
            </div>
            {/* Rotating Ring */}
            <div className="absolute inset-0 border-4 border-brand-gold/30 rounded-full animate-gem-rotate" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className={`mb-8 transition-all duration-1000 delay-300 ${
          step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-brand-gold to-white bg-clip-text text-transparent">
            Welcome{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-xl text-white/80">To Zuka Royale</p>
        </div>

        {/* Features Animation */}
        <div className={`grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto transition-all duration-1000 delay-500 ${
          step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <Gift className="h-8 w-8 mx-auto mb-2 text-brand-gold animate-icon-bounce" />
            <p className="text-sm text-white/90">Exclusive Rewards</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <Star className="h-8 w-8 mx-auto mb-2 text-brand-gold animate-icon-bounce" style={{ animationDelay: '0.2s' }} />
            <p className="text-sm text-white/90">Level Up</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <Zap className="h-8 w-8 mx-auto mb-2 text-brand-gold animate-icon-bounce" style={{ animationDelay: '0.4s' }} />
            <p className="text-sm text-white/90">Play Games</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-brand-gold animate-icon-bounce" style={{ animationDelay: '0.6s' }} />
            <p className="text-sm text-white/90">Earn Points</p>
          </div>
        </div>

        {/* Continue Button */}
        <div className={`transition-all duration-1000 delay-700 ${
          step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Button
            onClick={onComplete}
            className="bg-brand-gold-gradient text-brand-purple font-semibold px-8 py-3 text-lg"
          >
            Get Started
          </Button>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="mt-4 text-white/60 hover:text-white transition-colors text-sm"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
}

