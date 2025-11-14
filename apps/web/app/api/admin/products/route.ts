import { NextRequest, NextResponse } from 'next/server';
import { db, products } from '@gemcart/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Product schema validation
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

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication/authorization check here
    // const session = await getServerSession();
    // if (!session || !session.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    
    // Validate the product data
    const validatedData = productSchema.parse(body);

    // Ensure imageUrl is set (use first image if not provided)
    const imageUrl = validatedData.imageUrl || (validatedData.images && validatedData.images[0]) || '';

    // Check if product with slug already exists
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.slug, validatedData.slug),
    });

    if (existingProduct) {
      // Update existing product
      const [updatedProduct] = await db
        .update(products)
        .set({
          ...validatedData,
          imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existingProduct.id))
        .returning();

      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } else {
      // Create new product
      const [newProduct] = await db
        .insert(products)
        .values({
          ...validatedData,
          imageUrl,
        })
        .returning();

      return NextResponse.json({
        success: true,
        message: 'Product created successfully',
        product: newProduct,
      }, { status: 201 });
    }
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

    console.error('Product creation/update error:', error);
    return NextResponse.json(
      { error: 'Failed to create/update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const product = await db.query.products.findFirst({
        where: eq(products.slug, slug),
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    // Return all products (paginated in production)
    const allProducts = await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: 100,
    });

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

