import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  phone: text('phone'),
  rewardPoints: integer('reward_points').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  priceNGN: integer('price_ngn').notNull(),
  imageUrl: text('image_url'), // Primary/main image URL
  images: jsonb('images').$type<string[]>().default([]), // Array of all image URLs
  category: text('category').notNull(), // Required category
  gender: text('gender').notNull(), // Required gender: 'men', 'women', 'kids', 'unisex'
  sizes: jsonb('sizes').$type<string[]>().default([]),
  colors: jsonb('colors').$type<string[]>().default([]),
  featured: boolean('featured').default(false).notNull(),
  inStock: boolean('in_stock').default(true).notNull(),
  stockCount: integer('stock_count').default(0),
  tags: jsonb('tags').$type<string[]>().default([]),
  // Additional fields for better product management
  sku: text('sku').unique(), // Stock Keeping Unit
  brand: text('brand'), // Brand name
  material: text('material'), // Material description
  careInstructions: text('care_instructions'), // Care instructions
  weight: integer('weight'), // Weight in grams
  dimensions: jsonb('dimensions').$type<{
    length?: number;
    width?: number;
    height?: number;
    unit?: string; // 'cm' or 'inches'
  }>(),
  salePriceNGN: integer('sale_price_ngn'), // Sale price if on discount
  discountPercent: integer('discount_percent'), // Discount percentage
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  totalNGN: integer('total_ngn').notNull(),
  status: text('status').notNull(), // 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  paymentReference: text('payment_reference'),
  paystackReference: text('paystack_reference'),
  deliveryAddress: jsonb('delivery_address').$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceNGN: integer('price_ngn').notNull(),
  size: text('size'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Game scores table
export const gameScores = pgTable('game_scores', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  gameType: text('game_type').notNull(), // 'snake', 'tetris', 'memory', 'quiz'
  score: integer('score').notNull(),
  pointsEarned: integer('points_earned').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Rewards table
export const rewards = pgTable('rewards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  discountPercent: integer('discount_percent'),
  discountAmountNGN: integer('discount_amount_ngn'),
  type: text('type').notNull(), // 'discount', 'freeShipping', 'cashback'
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User rewards redemption table
export const userRewards = pgTable('user_rewards', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  rewardId: integer('reward_id').references(() => rewards.id).notNull(),
  code: text('code').notNull().unique(),
  used: boolean('used').default(false).notNull(),
  usedAt: timestamp('used_at'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
