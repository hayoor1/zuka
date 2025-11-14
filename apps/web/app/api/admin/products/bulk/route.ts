import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  priceNGN: z.number().int().min(0),
  salePriceNGN: z.number().int().min(0).optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
  gender: z.enum(['men', 'women', 'kids', 'unisex']),
  category: z.enum([
    'tops',
    'dresses',
    'shoes',
    'trousers',
    'jewellery',
    'activewear',
    'swimwear',
    'lingerie',
    'beauty',
    'bags',
    'outerwear',
    'traditional'
  ]),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  inStock: z.boolean().optional().default(true),
  stockCount: z.number().int().min(0).optional().default(0),
  sku: z.string().optional(),
  brand: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  weight: z.number().int().min(0).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.enum(['cm', 'inches']).optional().default('cm'),
  }).optional(),
});

const bulkProductSchema = z.object({
  products: z.array(productSchema).min(1).max(100), // Limit to 100 products per batch
});

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please add DATABASE_URL environment variable.' },
        { status: 503 }
      );
    }

    // Dynamic imports only when database is available
    const { db, products } = await import('@gemcart/db');
    const drizzle = await import('drizzle-orm') as any;
    const { eq } = drizzle;

    // TODO: Add authentication/authorization check
    const body = await request.json();
    const validatedData = bulkProductSchema.parse(body);

    const results = {
      created: [] as any[],
      updated: [] as any[],
      errors: [] as Array<{ slug: string; error: string }>,
    };

    for (const productData of validatedData.products) {
      try {
        // Ensure imageUrl is set
        const imageUrl = productData.imageUrl || (productData.images && productData.images[0]) || '';

        // Check if product exists
        const existingProduct = await db.query.products.findFirst({
          where: eq(products.slug, productData.slug),
        });

        if (existingProduct) {
          // Update existing
          const [updatedProduct] = await db
            .update(products)
            .set({
              ...productData,
              imageUrl,
              updatedAt: new Date(),
            })
            .where(eq(products.id, existingProduct.id))
            .returning();

          results.updated.push(updatedProduct);
        } else {
          // Create new
          const [newProduct] = await db
            .insert(products)
            .values({
              ...productData,
              imageUrl,
            })
            .returning();

          results.created.push(newProduct);
        }
      } catch (error) {
        results.errors.push({
          slug: productData.slug,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${validatedData.products.length} products`,
      results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Bulk product import error:', error);
    return NextResponse.json(
      { error: 'Failed to process products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

