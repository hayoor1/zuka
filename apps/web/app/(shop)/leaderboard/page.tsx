'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@gemcart/ui';
import { 
  Trophy, 
  Medal, 
  Crown, 
  RefreshCw, 
  Gamepad2,
  TrendingUp,
  Calendar,
  Zap,
  Star,
  Award,
  Target,
  Sparkles
} from 'lucide-react';
import { useUserStore } from '../../../lib/user-store';
import { formatUserId } from '../../../lib/user-id';

type LeaderboardEntry = {
  rank: number;
  userId: string;
  gameType?: string;
  score?: number;
  totalPoints?: number;
  gamesPlayed?: number;
  bestScore?: number;
  pointsEarned?: number;
  createdAt?: string;
};

type LeaderboardData = {
  scores: LeaderboardEntry[];
  source: 'database' | 'memory';
  synced?: boolean;
  warning?: string;
};

const gameNames: Record<string, string> = {
  snake: 'Snake Classic',
  tetris: 'Block Stacker',
  memory: 'Memory Match',
  quiz: 'Naija Trivia',
  wheel: 'Spin & Win',
};

const gameIcons: Record<string, string> = {
  snake: '🐍',
  tetris: '🧱',
  memory: '🃏',
  quiz: '🧠',
  wheel: '🎰',
};

type LeaderboardType = 'overall' | 'game' | 'weekly';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [selectedType, setSelectedType] = useState<LeaderboardType>('overall');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = useUserStore((state) => state.getUserId());

  const fetchLeaderboard = async (type: LeaderboardType, gameType: string | null = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type });
      if (gameType) params.append('game', gameType);
      params.append('limit', '20');
      
      const response = await fetch(`/api/games/leaderboard?${params}`);
      const data: LeaderboardData = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedType, selectedGame);
  }, [selectedType, selectedGame]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-500" />;
    return <Trophy className="h-5 w-5 text-gray-400" />;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-500';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white border-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white border-amber-600';
    return 'bg-white/10 text-white border-white/20';
  };

  const isCurrentUser = (entryUserId: string) => {
    return entryUserId === userId;
  };

  const currentUserRank = leaderboard?.scores.findIndex(s => s.userId === userId) ?? -1;
  const currentUserEntry = currentUserRank >= 0 ? leaderboard?.scores[currentUserRank] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#120c2c] to-[#341056] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pattern-ankara" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="bg-brand-gold-gradient text-brand-purple border-0 text-xs uppercase tracking-[0.5em] mb-4 px-4 py-1.5">
            <Trophy className="inline mr-1 h-4 w-4" />
            Royale Leaderboard
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-[#e3c268] to-white bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            See where you stand among the best players. Climb the ranks and claim your spot at the top!
          </p>
        </div>

        {/* Your Position Card */}
        {currentUserEntry && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-[#4b0f7b] via-[#6b1f9b] to-[#4b0f7b] border-brand-gold/30 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-brand-gold-gradient flex items-center justify-center text-brand-purple font-bold text-2xl shadow-lg">
                  #{currentUserEntry.rank}
                </div>
                <div>
                  <div className="text-sm text-white/70 mb-1">Your Position</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedType === 'overall' 
                      ? `${currentUserEntry.totalPoints?.toLocaleString() || 0} Total Points`
                      : selectedType === 'weekly'
                      ? `${currentUserEntry.score?.toLocaleString() || 0} Best Score This Week`
                      : `${currentUserEntry.score?.toLocaleString() || 0} Points`
                    }
                  </div>
                  {selectedType === 'overall' && (
                    <div className="text-sm text-white/60 mt-1">
                      {currentUserEntry.gamesPlayed || 0} games played
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-gold-gradient text-brand-purple border-0">
                  <Star className="h-3 w-3 mr-1" />
                  Top {Math.ceil((currentUserEntry.rank / 20) * 100)}%
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={selectedType === 'overall' ? 'primary' : 'secondary'}
            size="lg"
            onClick={() => {
              setSelectedType('overall');
              setSelectedGame(null);
            }}
            className={selectedType === 'overall' 
              ? 'bg-brand-gold-gradient text-brand-purple font-semibold' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }
          >
            <Award className="h-4 w-4 mr-2" />
            Overall Points
          </Button>
          <Button
            variant={selectedType === 'game' ? 'primary' : 'secondary'}
            size="lg"
            onClick={() => {
              setSelectedType('game');
              if (!selectedGame) setSelectedGame('snake');
            }}
            className={selectedType === 'game' 
              ? 'bg-brand-gold-gradient text-brand-purple font-semibold' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Game Leaderboard
          </Button>
          <Button
            variant={selectedType === 'weekly' ? 'primary' : 'secondary'}
            size="lg"
            onClick={() => setSelectedType('weekly')}
            className={selectedType === 'weekly' 
              ? 'bg-brand-gold-gradient text-brand-purple font-semibold' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }
          >
            <Calendar className="h-4 w-4 mr-2" />
            My Weekly Scores
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => fetchLeaderboard(selectedType, selectedGame)}
            className="ml-auto bg-white/5 text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Game Selector (for game-specific leaderboard) */}
        {selectedType === 'game' && (
          <Card className="p-4 mb-6 bg-white/5 border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-white/80">Select Game:</span>
              {Object.entries(gameNames).map(([id, name]) => (
                <Button
                  key={id}
                  variant={selectedGame === id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedGame(id)}
                  className={selectedGame === id
                    ? 'bg-brand-gold-gradient text-brand-purple font-semibold'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }
                >
                  <span className="mr-2">{gameIcons[id]}</span>
                  {name}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Leaderboard Table */}
        {loading ? (
          <Card className="p-12 text-center bg-white/5 border-white/10">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-gold mx-auto mb-4" />
            <p className="text-white/70">Loading leaderboard...</p>
          </Card>
        ) : leaderboard?.scores && leaderboard.scores.length > 0 ? (
          <Card className="p-0 bg-white/5 border-white/10 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 bg-white/5 border-b border-white/10 font-semibold text-sm text-white/80">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5">Player</div>
              {selectedType === 'overall' ? (
                <>
                  <div className="col-span-2 text-right">Total Points</div>
                  <div className="col-span-2 text-right">Games</div>
                  <div className="col-span-2 text-right">Best Score</div>
                </>
              ) : selectedType === 'weekly' ? (
                <>
                  <div className="col-span-2 text-right">Game</div>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-2 text-right">Points</div>
                </>
              ) : (
                <>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-2 text-right">Points</div>
                  <div className="col-span-2 text-right">Date</div>
                </>
              )}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/10">
              {leaderboard.scores.map((entry, index) => {
                const isCurrentUserRow = isCurrentUser(entry.userId);
                
                return (
                  <div
                    key={`${entry.userId}-${entry.rank}-${index}`}
                    className={`grid grid-cols-12 gap-4 p-6 transition-all ${
                      isCurrentUserRow
                        ? 'bg-gradient-to-r from-brand-gold/20 via-brand-gold/30 to-brand-gold/20 border-l-4 border-brand-gold shadow-lg'
                        : entry.rank <= 3
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-transparent hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        entry.rank <= 3 ? getRankBadgeColor(entry.rank) : 'bg-white/10 border border-white/20'
                      }`}>
                        {entry.rank <= 3 ? (
                          getRankIcon(entry.rank)
                        ) : (
                          <span className={`text-sm font-bold ${
                            isCurrentUserRow ? 'text-brand-gold' : 'text-white/80'
                          }`}>
                            {entry.rank}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="flex-1">
                        <div className={`font-semibold flex items-center gap-2 ${
                          isCurrentUserRow ? 'text-brand-gold' : 'text-white'
                        }`}>
                          {formatUserId(entry.userId)}
                          {isCurrentUserRow && (
                            <Badge className="bg-brand-gold-gradient text-brand-purple border-0 text-xs px-2 py-0.5">
                              You
                            </Badge>
                          )}
                          {entry.rank === 1 && !isCurrentUserRow && (
                            <Crown className="h-4 w-4 text-yellow-400" />
                          )}
                        </div>
                        {selectedType === 'game' && entry.gameType && (
                          <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                            <span>{gameIcons[entry.gameType]}</span>
                            {gameNames[entry.gameType]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Data Columns */}
                    {selectedType === 'overall' ? (
                      <>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-bold text-white">
                            {entry.totalPoints?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-white/60">points</div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-semibold text-white/90">
                            {entry.gamesPlayed || 0}
                          </div>
                          <div className="text-xs text-white/60">played</div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-semibold text-white/90">
                            {entry.bestScore?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-white/60">best</div>
                        </div>
                      </>
                    ) : selectedType === 'weekly' ? (
                      <>
                        <div className="col-span-2 text-right">
                          <div className="text-sm font-semibold text-white/90 flex items-center justify-end gap-1">
                            <span>{entry.gameType && gameIcons[entry.gameType]}</span>
                            {entry.gameType && gameNames[entry.gameType]}
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-bold text-white">
                            {entry.score?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-white/60">score</div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-semibold text-white/90">
                            +{entry.pointsEarned || 0}
                          </div>
                          <div className="text-xs text-white/60">points</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-bold text-white">
                            {entry.score?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-white/60">score</div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-lg font-semibold text-white/90">
                            +{entry.pointsEarned || 0}
                          </div>
                          <div className="text-xs text-white/60">points</div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-sm font-semibold text-white/80">
                            {entry.createdAt 
                              ? new Date(entry.createdAt).toLocaleDateString()
                              : '—'
                            }
                          </div>
                          <div className="text-xs text-white/60">date</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center bg-white/5 border-white/10">
            <Trophy className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Scores Yet
            </h3>
            <p className="text-white/70 mb-6">
              Be the first to play and set a high score!
            </p>
            <Link href="/games">
              <Button className="bg-brand-gold-gradient text-brand-purple font-semibold">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Play Games
              </Button>
            </Link>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-brand-gold-gradient flex items-center justify-center text-brand-purple">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">How Rankings Work</h3>
            </div>
            <p className="text-sm text-white/70">
              Rankings update in real-time. Play games, earn points, and climb the leaderboard!
            </p>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#7f5dff] to-[#6f8bff] flex items-center justify-center text-white">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">Weekly Scores</h3>
            </div>
            <p className="text-sm text-white/70">
              Track your best scores from the past 7 days. Improve your ranking each week!
            </p>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#f7797d] to-[#ef9d43] flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">Overall Points</h3>
            </div>
            <p className="text-sm text-white/70">
              Accumulate points from all games. The more you play, the higher you rank!
            </p>
          </Card>
        </div>

        {/* Sync Status */}
        {leaderboard?.synced && (
          <Card className="mt-6 p-4 bg-green-500/20 border-green-500/30 text-center">
            <p className="text-sm text-green-300">
              ✅ Scores are synced across all players and deployments!
            </p>
          </Card>
        )}

        {leaderboard?.warning && (
          <Card className="mt-6 p-4 bg-yellow-500/20 border-yellow-500/30 text-center">
            <p className="text-sm text-yellow-300">
              ⚠️ {leaderboard.warning}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
