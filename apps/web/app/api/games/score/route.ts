import { getServerUserId } from '../../../../lib/user-id';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const game = String(form.get('game') || '');
    const score = Number(form.get('score') || 0);
    
    if (!game || !Number.isFinite(score)) {
      return new Response(JSON.stringify({ error: 'Invalid game or score' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Anti-abuse: simple caps
    if (score < 5 || score > 50000) {
      return new Response(JSON.stringify({ error: 'Score out of acceptable range' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const userId = await getServerUserId();
    const pointsEarned = Math.floor(score / 10);
    
    if (!process.env.DATABASE_URL) {
      // Use in-memory storage when database is not available
      // Note: This won't persist across deployments or server restarts
      const g = globalThis as unknown as { 
        __scores?: Array<{ 
          userId: string; 
          gameType: string; 
          score: number;
          pointsEarned: number;
          createdAt: Date;
        }> 
      };
      g.__scores ||= [];
      g.__scores.push({ 
        userId, 
        gameType: game, 
        score,
        pointsEarned,
        createdAt: new Date()
      });
      
      return new Response(JSON.stringify({ 
        ok: true, 
        stored: 'memory',
        userId,
        message: 'Score saved (in-memory - will not persist across deployments)'
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    } else {
      try {
        // Dynamic imports only when database is available
        const { db, gameScores } = await import('@gemcart/db');
        
        // Insert score into database
        await db.insert(gameScores).values({ 
          userId, 
          gameType: game, 
          score, 
          pointsEarned 
        });
        
        return new Response(JSON.stringify({ 
          ok: true, 
          stored: 'database',
          userId,
          pointsEarned,
          message: 'Score saved and synced!'
        }), { 
          headers: { 'Content-Type': 'application/json' } 
        });
      } catch (error) {
        console.error('Database error:', error);
        // Fallback to memory storage
        const g = globalThis as unknown as { 
          __scores?: Array<{ 
            userId: string; 
            gameType: string; 
            score: number;
            pointsEarned: number;
            createdAt: Date;
          }> 
        };
        g.__scores ||= [];
        g.__scores.push({ 
          userId, 
          gameType: game, 
          score,
          pointsEarned,
          createdAt: new Date()
        });
        
        return new Response(JSON.stringify({ 
          ok: true, 
          stored: 'memory',
          userId,
          message: 'Score saved (database unavailable, using memory)'
        }), { 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
    }
  } catch (error) {
    console.error('Score submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save score',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameType = searchParams.get('game') || null;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!process.env.DATABASE_URL) {
      // Return in-memory scores
      const g = globalThis as unknown as { 
        __scores?: Array<{ 
          userId: string; 
          gameType: string; 
          score: number;
          pointsEarned: number;
          createdAt: Date;
        }> 
      };
      
      let scores = (g.__scores || []);
      
      // Filter by game type if specified
      if (gameType) {
        scores = scores.filter(s => s.gameType === gameType);
      }
      
      // Sort by score descending and limit
      const rows = scores
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
      
      return new Response(JSON.stringify({
        scores: rows,
        source: 'memory',
        warning: 'Scores are stored in memory and will not persist across deployments'
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    try {
      // Dynamic imports only when database is available
      const { db, gameScores } = await import('@gemcart/db');
      const drizzle = await import('drizzle-orm') as any;
      const { desc, eq, and } = drizzle;
      
      // Build query
      let query = db.select().from(gameScores);
      
      if (gameType) {
        query = query.where(eq(gameScores.gameType, gameType)) as any;
      }
      
      const rows = await query
        .orderBy(desc(gameScores.score))
        .limit(limit);
      
      // Format response with ranks
      const formattedRows = rows.map((row: any, index: number) => ({
        rank: index + 1,
        userId: row.userId,
        gameType: row.gameType,
        score: row.score,
        pointsEarned: row.pointsEarned,
        createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
      }));
      
      return new Response(JSON.stringify({
        scores: formattedRows,
        source: 'database',
        synced: true
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (error) {
      console.error('Database error:', error);
      // Fallback to memory storage
      const g = globalThis as unknown as { 
        __scores?: Array<{ 
          userId: string; 
          gameType: string; 
          score: number;
          pointsEarned: number;
          createdAt: Date;
        }> 
      };
      
      let scores = (g.__scores || []);
      if (gameType) {
        scores = scores.filter(s => s.gameType === gameType);
      }
      
      const rows = scores
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
      
      return new Response(JSON.stringify({
        scores: rows,
        source: 'memory',
        warning: 'Database unavailable, showing in-memory scores'
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch leaderboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
