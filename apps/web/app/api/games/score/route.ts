import { createDb, gameScores } from '@gemcart/db';
import { desc } from 'drizzle-orm';

export async function POST(req: Request) {
  const form = await req.formData();
  const game = String(form.get('game') || '');
  const score = Number(form.get('score') || 0);
  if (!game || !Number.isFinite(score)) return new Response('Bad request', { status: 400 });
  // Anti-abuse: simple caps
  if (score < 5 || score > 5000) return new Response('Unacceptable score', { status: 400 });
  if (!process.env.DATABASE_URL) {
    const g = globalThis as unknown as { __scores?: Array<{ userId: string; game: string; score: number }> };
    g.__scores ||= [];
    g.__scores.push({ userId: 'demo-user', game, score });
    return new Response(JSON.stringify({ ok: true, stored: 'memory' }), { headers: { 'Content-Type': 'application/json' } });
  } else {
    const db = createDb();
    const userId = 'demo-user';
    await db.insert(gameScores).values({ userId, game, score });
    return new Response(JSON.stringify({ ok: true, stored: 'db' }), { headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    const g = globalThis as unknown as { __scores?: Array<{ userId: string; game: string; score: number }> };
    const rows = (g.__scores || []).sort((a, b) => b.score - a.score).slice(0, 20);
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
  }
  const db = createDb();
  const rows = await db.select().from(gameScores).orderBy(desc(gameScores.score)).limit(20);
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
}


