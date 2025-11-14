import { NextRequest, NextResponse } from 'next/server';
import { listProducts, type CatalogProduct } from '../../../lib/catalog';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Check if database is available
    const useDatabase = !!process.env.DATABASE_URL;

    // Use database if available, otherwise use mock data
    if (useDatabase) {
      try {
        const dbModule = await import('@gemcart/db');
        const drizzleModule = await import('drizzle-orm') as any;
        const { db, products } = dbModule;
        const { eq, desc, and } = drizzleModule;

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
      } catch (dbError) {
        console.warn('Database not available, using mock data:', dbError);
        // Fall through to mock data
      }
    }

    // Use mock data from catalog
    let results: CatalogProduct[] = listProducts();

    // Apply filters
    if (category) {
      results = results.filter(p => p.category === category);
    }

    // Note: Mock data doesn't have 'featured' flag, so we'll use first few products
    if (featured) {
      results = results.slice(0, 8); // Show first 8 as featured
    }

    // Apply limit
    results = results.slice(0, limit);

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



