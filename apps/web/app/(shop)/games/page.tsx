'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@gemcart/ui';
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  Zap, 
  Star,
  TrendingUp,
  Users,
  Sparkles,
  Gift,
  Target,
  Flame
} from 'lucide-react';

type Game = {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  maxReward: number;
  playTime: string;
  topScore?: number;
  href: string;
  gradient: string;
};

const games: Game[] = [
  {
    id: 'snake',
    name: 'Snake Classic',
    description: 'Guide the snake to collect food and grow longer',
    icon: '🐍',
    difficulty: 'Easy',
    maxReward: 500,
    playTime: '2-5 min',
    topScore: 2450,
    href: '/games/snake',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'tetris',
    name: 'Block Stacker',
    description: 'Stack falling blocks to clear lines',
    icon: '🧱',
    difficulty: 'Medium',
    maxReward: 750,
    playTime: '5-10 min',
    topScore: 18500,
    href: '/games/tetris',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of cards to test your memory',
    icon: '🃏',
    difficulty: 'Medium',
    maxReward: 200,
    playTime: '2-5 min',
    topScore: 980,
    href: '/games/memory',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'quiz',
    name: 'Naija Trivia',
    description: 'History, geography, culture. Quick questions, big fun.',
    icon: '🧠',
    difficulty: 'Easy',
    maxReward: 600,
    playTime: '3-6 min',
    href: '/games/quiz',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'wheel',
    name: 'Spin & Win',
    description: 'Daily spin for instant rewards',
    icon: '🎰',
    difficulty: 'Easy',
    maxReward: 1000,
    playTime: 'Instant',
    href: '/rewards/spin',
    gradient: 'from-yellow-400 to-yellow-600'
  }
];

export default function GamesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  
  const filteredGames = games.filter(
    game => selectedDifficulty === 'All' || game.difficulty === selectedDifficulty
  );

  const difficultyColors = {
    Easy: 'bg-green-300/20 text-green-200 border border-green-200/40',
    Medium: 'bg-yellow-300/20 text-yellow-200 border border-yellow-200/40',
    Hard: 'bg-red-300/20 text-red-200 border border-red-200/40'
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3d074e] via-[#570a70] to-[#943aa2] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pattern-ankara" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge className="mb-4 bg-brand-gold-gradient text-brand-purple border-0 text-xs tracking-[0.5em] px-4 py-1.5">
            <Gamepad2 className="inline mr-1 h-4 w-4" />
            Play & Earn
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Royale Arcade</h1>
          <p className="text-white/70 text-lg">Neon-lit challenges inspired by Lagos nights. Play, climb, unlock atelier perks.</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="p-5 rounded-3xl bg-gradient-to-br from-[#f9d976] via-[#f39f86] to-[#f7797d] text-gray-900 border-0 shadow-2xl shadow-[#f39f86]/40 card-hover-lift animate-stagger-1">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8 animate-icon-bounce" />
              <Flame className="h-5 w-5 animate-pulse" />
            </div>
            <div className="text-2xl font-bold animate-count-up">24,500</div>
            <div className="text-sm opacity-90">Your Best Score</div>
          </Card>
          
          <Card className="p-5 rounded-3xl bg-gradient-to-br from-[#7f5dff] to-[#6f8bff] text-white border-0 card-hover-lift animate-stagger-2">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="h-8 w-8 animate-sparkle" />
            </div>
            <div className="text-2xl font-bold animate-count-up">+350</div>
            <div className="text-sm opacity-90">Points Earned Today</div>
          </Card>

          <Card className="p-5 rounded-3xl bg-gradient-to-br from-[#ff8f70] to-[#ff3d68] text-white border-0 card-hover-lift animate-stagger-3">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 animate-bounce-slow" />
            </div>
            <div className="text-2xl font-bold animate-count-up">7 days</div>
            <div className="text-sm opacity-90">Daily Streak</div>
          </Card>

          <Card className="p-5 rounded-3xl bg-gradient-to-br from-[#570a70] to-[#e246a4] text-white border-0 card-hover-lift animate-stagger-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 animate-icon-bounce" />
            </div>
            <div className="text-2xl font-bold animate-count-up">#1,234</div>
            <div className="text-sm opacity-90">Global Rank</div>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <div className="mb-10 flex gap-2 justify-center flex-wrap">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <Button
              key={diff}
              variant={selectedDifficulty === diff ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedDifficulty(diff)}
              className={
                selectedDifficulty === diff
                  ? 'bg-brand-gold-gradient text-brand-purple font-semibold'
                  : 'bg-white/10 border border-white/10 text-white hover:bg-white/10'
              }
            >
              {diff}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredGames.map((game, index) => (
            <Link key={game.id} href={game.href}>
              <Card className={`group h-full overflow-hidden card-hover-lift cursor-pointer rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all shadow-xl shadow-black/20 animate-stagger-${Math.min(index + 1, 5)}`}>
                {/* Game Icon Header */}
                <div className={`relative h-40 bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
                  <div className="text-7xl group-hover:scale-110 transition-transform drop-shadow-lg">
                    {game.icon}
                  </div>
                  <Badge className={`absolute top-4 right-4 ${difficultyColors[game.difficulty]} border-0 font-semibold`}>
                    {game.difficulty}
                  </Badge>
                  {game.id === 'wheel' && (
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white border-0 animate-pulse">
                      Hot
                    </Badge>
                  )}
                </div>
                
                {/* Game Info */}
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-gold transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-white/70 mb-4">{game.description}</p>

                  {/* Game Stats */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Play Time
                      </span>
                      <span className="font-medium">{game.playTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4 text-brand-gold" />
                        Max Reward
                      </span>
                      <span className="font-bold text-brand-gold">{game.maxReward} points</span>
                    </div>
                    {game.topScore && (
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span className="flex items-center">
                          <Trophy className="mr-2 h-4 w-4 text-brand-gold" />
                          Your Best
                        </span>
                        <span className="font-bold text-brand-gold">{game.topScore.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Play Button */}
                  <Button className="w-full mt-4 bg-brand-gold-gradient text-brand-purple hover:shadow-gold font-semibold">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play Now
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Weekly Tournament Banner */}
        <Card className="p-8 bg-gradient-to-r from-[#3d074e] via-[#570a70] to-[#943aa2] text-white border-0 rounded-3xl shadow-2xl shadow-black/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Weekly Tournament</h3>
                <p className="text-white/80 mb-3">
                  Top 10 players win cash prizes and exclusive rewards
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                    <Gift className="mr-1 h-3 w-3" />
                    ₦5,000 Prize Pool
                  </Badge>
                  <span className="text-sm text-white/80">Ends in 3 days</span>
                </div>
              </div>
            </div>
            <Link href="/leaderboard">
              <Button size="lg" className="bg-brand-gold-gradient text-brand-purple hover:opacity-90 font-semibold whitespace-nowrap">
                View Leaderboard
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* How It Works Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-8 text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="h-16 w-16 rounded-full bg-brand-gold-gradient flex items-center justify-center mx-auto mb-4 text-brand-purple font-bold text-2xl shadow-gold">
                1
              </div>
              <h3 className="font-bold mb-2 text-lg text-white">Play Games</h3>
              <p className="text-white/70 text-sm">Tap into neon-laced arcade classics with a luxury twist.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#7f5dff] to-[#6f8bff] flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                2
              </div>
              <h3 className="font-bold mb-2 text-lg text-white">Earn Points</h3>
              <p className="text-white/70 text-sm">Climb streaks, hit leaderboards, multiply Royale gems.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#f7797d] to-[#ef9d43] flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                3
              </div>
              <h3 className="font-bold mb-2 text-lg text-white">Get Rewards</h3>
              <p className="text-white/70 text-sm">Redeem for atelier fittings, vouchers and cash prizes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
