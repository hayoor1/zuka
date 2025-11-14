import { z } from 'zod';

export const CurrencyCode = z.enum(["NGN"]);
export type CurrencyCode = z.infer<typeof CurrencyCode>;

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  priceNGN: z.number().int().nonnegative(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
});
export type Product = z.infer<typeof ProductSchema>;

export const CouponSchema = z.object({
  code: z.string().toUpperCase(),
  amountNGN: z.number().int().positive(),
  minBasketNGN: z.number().int().nonnegative().default(0),
  maxRedemptionsPerDay: z.number().int().positive().default(1),
});
export type Coupon = z.infer<typeof CouponSchema>;

export const CartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPriceNGN: z.number().int().nonnegative(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export function formatNGN(amount: number): string {
  const naira = amount / 100;
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(naira);
}

export const GemLevels = [
  'Quartz', 'Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Obsidian', 'Crown'
] as const;
export type GemLevel = typeof GemLevels[number];

export function levelForXP(xp: number): GemLevel {
  if (xp < 100) return 'Quartz';
  if (xp < 300) return 'Sapphire';
  if (xp < 700) return 'Ruby';
  if (xp < 1500) return 'Emerald';
  if (xp < 3000) return 'Diamond';
  if (xp < 6000) return 'Obsidian';
  return 'Crown';
}






