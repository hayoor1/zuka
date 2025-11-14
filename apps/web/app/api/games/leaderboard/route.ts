import { NextRequest, NextResponse } from 'next/server';
import { getServerUserId } from '../../../../lib/user-id';

type LeaderboardEntry = {
  rank: number;
  userId: string;
  gameType?: string;
  score?: number;
  totalPoints: number;
  gamesPlayed: number;
  bestScore?: number;
};

/**
 * GET /api/games/leaderboard
 * 
 * Returns leaderboard data:
 * - Overall points leaderboard (accumulated points)
 * - Game-specific leaderboard
 * - Weekly scores for current user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overall'; // overall, game, weekly
    const gameType = searchParams.get('game') || null;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const currentUserId = await getServerUserId();
    
    if (!process.env.DATABASE_URL) {
      // In-memory fallback
      const g = globalThis as unknown as { 
        __scores?: Array<{ 
          userId: string; 
          gameType: string; 
          score: number;
          pointsEarned: number;
          createdAt: Date;
        }> 
      };
      
      const scores = g.__scores || [];
      
      if (type === 'weekly') {
        // Get current user's scores from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyScores = scores
          .filter(s => s.userId === currentUserId && s.createdAt >= weekAgo)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
        
        return NextResponse.json({
          scores: weeklyScores.map((s, i) => ({
            rank: i + 1,
            userId: s.userId,
            gameType: s.gameType,
            score: s.score,
            pointsEarned: s.pointsEarned,
            createdAt: s.createdAt.toISOString(),
          })),
          source: 'memory',
        });
      }
      
      if (type === 'overall') {
        // Calculate total points per user
        const userPoints = new Map<string, { totalPoints: number; gamesPlayed: number; bestScore: number }>();
        
        scores.forEach(s => {
          const existing = userPoints.get(s.userId) || { totalPoints: 0, gamesPlayed: 0, bestScore: 0 };
          userPoints.set(s.userId, {
            totalPoints: existing.totalPoints + s.pointsEarned,
            gamesPlayed: existing.gamesPlayed + 1,
            bestScore: Math.max(existing.bestScore, s.score),
          });
        });
        
        const overall = Array.from(userPoints.entries())
          .map(([userId, data]) => ({
            userId,
            ...data,
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, limit)
          .map((entry, index) => ({
            rank: index + 1,
            ...entry,
          }));
        
        return NextResponse.json({
          scores: overall,
          source: 'memory',
        });
      }
      
      // Game-specific
      let gameScores = scores;
      if (gameType) {
        gameScores = gameScores.filter(s => s.gameType === gameType);
      }
      
      const gameLeaderboard = gameScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s, index) => ({
          rank: index + 1,
          userId: s.userId,
          gameType: s.gameType,
          score: s.score,
          pointsEarned: s.pointsEarned,
          createdAt: s.createdAt.toISOString(),
        }));
      
      return NextResponse.json({
        scores: gameLeaderboard,
        source: 'memory',
      });
    }
    
    // Database mode
    try {
      const { db, gameScores } = await import('@gemcart/db');
      const drizzle = await import('drizzle-orm') as any;
      const { desc, eq, and, gte, sql } = drizzle;
      
      if (type === 'weekly') {
        // Get current user's scores from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyScores = await db
          .select()
          .from(gameScores)
          .where(
            and(
              eq(gameScores.userId, currentUserId),
              gte(gameScores.createdAt, weekAgo)
            )
          )
          .orderBy(desc(gameScores.score))
          .limit(limit);
        
        return NextResponse.json({
          scores: weeklyScores.map((s: any, i: number) => ({
            rank: i + 1,
            userId: s.userId,
            gameType: s.gameType,
            score: s.score,
            pointsEarned: s.pointsEarned,
            createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
          })),
          source: 'database',
          synced: true,
        });
      }
      
      if (type === 'overall') {
        // Get overall points leaderboard
        const overallScores = await db
          .select({
            userId: gameScores.userId,
            totalPoints: sql<number>`SUM(${gameScores.pointsEarned})`.as('total_points'),
            gamesPlayed: sql<number>`COUNT(*)`.as('games_played'),
            bestScore: sql<number>`MAX(${gameScores.score})`.as('best_score'),
          })
          .from(gameScores)
          .groupBy(gameScores.userId)
          .orderBy(desc(sql`SUM(${gameScores.pointsEarned})`))
          .limit(limit);
        
        return NextResponse.json({
          scores: overallScores.map((entry: any, index: number) => ({
            rank: index + 1,
            userId: entry.userId,
            totalPoints: Number(entry.totalPoints),
            gamesPlayed: Number(entry.gamesPlayed),
            bestScore: Number(entry.bestScore),
          })),
          source: 'database',
          synced: true,
        });
      }
      
      // Game-specific leaderboard
      let query = db.select().from(gameScores);
      
      if (gameType) {
        query = query.where(eq(gameScores.gameType, gameType)) as any;
      }
      
      const gameLeaderboard = await query
        .orderBy(desc(gameScores.score))
        .limit(limit);
      
      return NextResponse.json({
        scores: gameLeaderboard.map((entry: any, index: number) => ({
          rank: index + 1,
          userId: entry.userId,
          gameType: entry.gameType,
          score: entry.score,
          pointsEarned: entry.pointsEarned,
          createdAt: entry.createdAt?.toISOString() || new Date().toISOString(),
        })),
        source: 'database',
        synced: true,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database unavailable', source: 'memory' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

