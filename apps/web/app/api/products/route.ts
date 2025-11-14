import { NextRequest, NextResponse } from 'next/server';
import { db, products } from '@gemcart/db';
import { eq, desc, and } from 'drizzle-orm';

export const runtime = 'edge';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const conditions = [];
    
    if (featured) {
      conditions.push(eq(products.featured, true));
    }
    
    if (category) {
      conditions.push(eq(products.category, category));
    }

    const results = await db.query.products.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit,
      orderBy: [desc(products.createdAt)],
    });

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}


