import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get('productId') || '');
  if (!productId) return new Response('Missing', { status: 400 });
  const cookieStore = await cookies();
  const raw = cookieStore.get('gc_cart');
  const cart: Record<string, number> = raw ? JSON.parse(raw.value) : {};
  cart[productId] = (cart[productId] || 0) + 1;
  const res = NextResponse.redirect(new URL('/cart', req.url));
  res.cookies.set('gc_cart', JSON.stringify(cart), { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}


