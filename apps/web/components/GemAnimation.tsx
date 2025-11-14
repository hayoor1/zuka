'use client';

import { useEffect, useState } from 'react';
import { X, Play, Sparkles } from 'lucide-react';
import { Button } from '@gemcart/ui';

type GemLevel = 'Quartz' | 'Sapphire' | 'Ruby' | 'Emerald' | 'Diamond' | 'Obsidian' | 'Crown';

interface GemAnimationProps {
  level: GemLevel;
  isOpen: boolean;
  onClose: () => void;
  autoPlay?: boolean;
}

const gemConfig: Record<GemLevel, {
  color: string;
  gradient: string;
  lightColor: string;
  shadowColor: string;
  particles: number;
}> = {
  Quartz: {
    color: '#9ca3af',
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    lightColor: '#d1d5db',
    shadowColor: '#6b7280',
    particles: 8,
  },
  Sapphire: {
    color: '#3b82f6',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    lightColor: '#60a5fa',
    shadowColor: '#2563eb',
    particles: 12,
  },
  Ruby: {
    color: '#ef4444',
    gradient: 'from-red-400 via-red-500 to-red-600',
    lightColor: '#f87171',
    shadowColor: '#dc2626',
    particles: 16,
  },
  Emerald: {
    color: '#10b981',
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
    lightColor: '#34d399',
    shadowColor: '#059669',
    particles: 20,
  },
  Diamond: {
    color: '#06b6d4',
    gradient: 'from-cyan-400 via-cyan-500 to-cyan-600',
    lightColor: '#22d3ee',
    shadowColor: '#0891b2',
    particles: 24,
  },
  Obsidian: {
    color: '#9333ea',
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
    lightColor: '#a855f7',
    shadowColor: '#7e22ce',
    particles: 28,
  },
  Crown: {
    color: '#f59e0b',
    gradient: 'from-amber-400 via-amber-500 to-amber-600',
    lightColor: '#fbbf24',
    shadowColor: '#d97706',
    particles: 32,
  },
};

export function GemAnimation({ level, isOpen, onClose, autoPlay = false }: GemAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const config = gemConfig[level];

  useEffect(() => {
    if (isOpen && autoPlay) {
      setIsPlaying(true);
    }
  }, [isOpen, autoPlay]);

  useEffect(() => {
    if (isPlaying) {
      // Generate particles
      const newParticles = Array.from({ length: config.particles }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [isPlaying, config.particles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Animation Container */}
        <div className="relative aspect-square flex items-center justify-center">
          {/* Background Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 blur-3xl animate-pulse`} />

          {/* Gem Container */}
          <div className="relative z-10">
            {/* Main Gem */}
            <div
              className={`relative w-64 h-64 mx-auto ${isPlaying ? 'animate-gem-3d' : ''}`}
              style={{
                filter: 'drop-shadow(0 0 40px ' + config.color + ')',
              }}
            >
              {/* Gem Shape - Top */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${config.gradient} clip-path-gem-top`}
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: isPlaying ? 'rotateY(360deg)' : 'rotateY(0deg)',
                  transition: 'transform 3s ease-in-out',
                }}
              />

              {/* Gem Shape - Bottom */}
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br ${config.gradient} clip-path-gem-bottom`}
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                  transform: isPlaying ? 'rotateY(-360deg)' : 'rotateY(0deg)',
                  transition: 'transform 3s ease-in-out',
                }}
              />

              {/* Shine Effect */}
              {isPlaying && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                  style={{
                    animation: 'shimmer 2s infinite',
                  }}
                />
              )}

              {/* Sparkle Particles */}
              {isPlaying && particles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    backgroundColor: config.lightColor,
                    boxShadow: `0 0 10px ${config.color}`,
                    animationDelay: `${particle.delay}s`,
                    animation: 'confettiFall 2s ease-out forwards',
                  }}
                />
              ))}
            </div>

            {/* Level Name */}
            <div className="mt-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in">
                {level}
              </h2>
              <p className="text-white/80 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Achievement Unlocked!
              </p>
            </div>
          </div>

          {/* Control Button */}
          {!isPlaying && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Button
                onClick={() => setIsPlaying(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Play className="h-5 w-5 mr-2" />
                Play Animation
              </Button>
            </div>
          )}

          {/* Replay Button */}
          {isPlaying && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
              <Button
                onClick={() => {
                  setIsPlaying(false);
                  setTimeout(() => setIsPlaying(true), 100);
                }}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Replay
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Gem Icon Component (for achievements)
export function GemIcon({ 
  level, 
  size = 'md',
  onClick,
  className = '',
}: { 
  level: GemLevel; 
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}) {
  const config = gemConfig[level];
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <button
      onClick={onClick}
      className={`relative ${sizeClasses[size]} ${className} transition-transform hover:scale-110 active:scale-95`}
      style={{
        filter: `drop-shadow(0 0 8px ${config.color})`,
      }}
    >
      {/* Gem Shape */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-lg animate-gem-icon-rotate`}>
        {/* Top Facet */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        {/* Bottom Facet */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          }}
        />
        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>

      {/* Sparkle Indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse">
        <Sparkles className="w-2 h-2 text-yellow-400 absolute inset-0 m-auto" />
      </div>
    </button>
  );
}

