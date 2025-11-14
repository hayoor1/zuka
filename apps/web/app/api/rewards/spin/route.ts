import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const last = cookieStore.get('gc_spin_date')?.value;
  const today = new Date().toISOString().slice(0, 10);
  if (last === today) return new Response('Daily limit', { status: 429 });
  const prizes = ['WELCOME1000', 'WELCOME500', 'TRYLUCK200', 'NICE50'];
  const code = prizes[Math.floor(Math.random() * prizes.length)];
  cookieStore.set('gc_spin_date', today, { httpOnly: true, sameSite: 'lax', path: '/' });
  return new Response(JSON.stringify({ code }), { headers: { 'Content-Type': 'application/json' } });
}












