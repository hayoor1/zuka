import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, orders, orderItems, products } from '@gemcart/db';
import { initiatePayment } from '@gemcart/payments';
import { inArray, eq } from 'drizzle-orm';

export const runtime = 'edge';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1).max(99),
    size: z.string().optional(),
    color: z.string().optional(),
  })),
  email: z.string().email(),
  phone: z.string().regex(/^\+234[0-9]{10}$/, 'Phone must be in format +234XXXXXXXXXX'),
  deliveryAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().default('Nigeria'),
    postalCode: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, phone, deliveryAddress } = checkoutSchema.parse(body);

    // Fetch products from database to calculate actual total
    const productIds = items.map(i => i.productId);
    const dbProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
    });

    // Calculate total from database prices (don't trust client)
    const total = items.reduce((sum, item) => {
      const product = dbProducts.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.inStock) throw new Error(`Product ${product.name} is out of stock`);
      return sum + product.priceNGN * item.quantity;
    }, 0);

    // Create order in database
    const [order] = await db.insert(orders).values({
      email,
      phone,
      totalNGN: total,
      status: 'pending',
      deliveryAddress,
    }).returning();

    // Create order items
    await db.insert(orderItems).values(
      items.map(item => {
        const product = dbProducts.find(p => p.id === item.productId)!;
        return {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceNGN: product.priceNGN,
          size: item.size,
          color: item.color,
        };
      })
    );

    // Initialize payment with Paystack
    const payment = await initiatePayment({
      email,
      amount: total,
      orderId: order.id,
      metadata: {
        phone,
        itemCount: items.length,
      },
    });

    if (!payment.success) {
      return NextResponse.json(
        { error: 'Payment initialization failed', details: payment.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: payment.authorizationUrl,
      reference: payment.reference,
      total,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
