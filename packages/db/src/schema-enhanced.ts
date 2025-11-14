import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  decimal,
  uuid,
  date,
  index,
  uniqueIndex,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. USERS & AUTHENTICATION (Scalable)
// ============================================================================

export const users = pgTable('users', {
  id: text('id').primaryKey(), // UUID string
  email: text('email').notNull(),
  phone: text('phone'),
  name: text('name'),
  passwordHash: text('password_hash'),
  authProvider: text('auth_provider').default('email'), // email/google/apple/phone
  phoneVerified: boolean('phone_verified').default(false),
  emailVerified: boolean('email_verified').default(false),
  profileImageUrl: text('profile_image_url'),
  dateOfBirth: date('date_of_birth'),
  genderPreference: text('gender_preference'), // For shopping recommendations
  addressDefaultId: integer('address_default_id'),
  rewardPoints: integer('reward_points').default(0).notNull(),
  gemLevel: text('gem_level').default('Quartz'), // Quartz/Sapphire/Ruby/etc
  totalXp: integer('total_xp').default(0).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('idx_users_email').on(table.email),
  phoneIdx: index('idx_users_phone').on(table.phone),
  rewardPointsIdx: index('idx_users_reward_points').on(table.rewardPoints),
}));

export const userAddresses = pgTable('user_addresses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  label: text('label'), // Home/Work/etc
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  streetAddress: text('street_address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(), // Lagos/Abuja/etc
  country: text('country').default('Nigeria').notNull(),
  postalCode: text('postal_code'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_user_addresses_user_id').on(table.userId),
}));

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  deviceId: text('device_id'), // For mobile apps
  platform: text('platform'), // web/android/ios
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  lastActivityAt: timestamp('last_activity_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  metadata: jsonb('metadata').$type<{
    deviceInfo?: Record<string, any>;
    location?: { country?: string; state?: string; city?: string };
  }>(),
}, (table) => ({
  userIdIdx: index('idx_user_sessions_user_id').on(table.userId),
  deviceIdIdx: index('idx_user_sessions_device_id').on(table.deviceId),
  expiresAtIdx: index('idx_user_sessions_expires_at').on(table.expiresAt),
}));

// ============================================================================
// 2. PRODUCTS & INVENTORY (Scalable)
// ============================================================================

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  parentId: integer('parent_id'),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').default(0),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  parentFk: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
  }).onDelete('set null'),
}));

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: text('sku').unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  priceNGN: integer('price_ngn').notNull(),
  salePriceNGN: integer('sale_price_ngn'),
  costPriceNGN: integer('cost_price_ngn'), // For profit analysis
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  gender: text('gender').notNull(), // men/women/kids/unisex
  brandId: integer('brand_id').references(() => brands.id),
  imageUrl: text('image_url'),
  images: jsonb('images').$type<string[]>().default([]),
  sizes: jsonb('sizes').$type<string[]>().default([]),
  colors: jsonb('colors').$type<string[]>().default([]),
  tags: jsonb('tags').$type<string[]>().default([]),
  material: text('material'),
  careInstructions: text('care_instructions'),
  weightGrams: integer('weight_grams'),
  dimensions: jsonb('dimensions').$type<{
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  }>(),
  stockCount: integer('stock_count').default(0),
  lowStockThreshold: integer('low_stock_threshold').default(10),
  inStock: boolean('in_stock').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  newArrival: boolean('new_arrival').default(false).notNull(),
  onSale: boolean('on_sale').default(false).notNull(),
  discountPercent: integer('discount_percent'),
  ratingAverage: decimal('rating_average', { precision: 3, scale: 2 }).default('0.00'),
  ratingCount: integer('rating_count').default(0),
  viewCount: integer('view_count').default(0), // For analytics
  purchaseCount: integer('purchase_count').default(0), // For analytics
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('idx_products_slug').on(table.slug),
  categoryGenderStockIdx: index('idx_products_category_gender_stock').on(table.categoryId, table.gender, table.inStock),
  featuredIdx: index('idx_products_featured').on(table.featured, table.createdAt),
  onSaleIdx: index('idx_products_on_sale').on(table.onSale, table.discountPercent),
  tagsGinIdx: index('idx_products_tags_gin').using('gin', table.tags),
}));

export const productReviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  comment: text('comment'),
  images: jsonb('images').$type<string[]>().default([]),
  verifiedPurchase: boolean('verified_purchase').default(false),
  helpfulCount: integer('helpful_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index('idx_product_reviews_product_id').on(table.productId),
  userIdIdx: index('idx_product_reviews_user_id').on(table.userId),
  createdAtIdx: index('idx_product_reviews_created_at').on(table.createdAt),
}));

// ============================================================================
// 3. ORDERS & PAYMENTS (Scalable)
// ============================================================================

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(), // ZUKA-2025-001234
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  guestEmail: text('guest_email'),
  guestPhone: text('guest_phone'),
  status: text('status').notNull().default('pending'), // pending/paid/processing/shipped/delivered/cancelled/refunded
  paymentStatus: text('payment_status').notNull().default('pending'), // pending/paid/failed/refunded
  paymentMethod: text('payment_method'), // paystack/flutterwave/cash_on_delivery
  paymentReference: text('payment_reference'),
  paystackReference: text('paystack_reference'),
  flutterwaveReference: text('flutterwave_reference'),
  subtotalNGN: integer('subtotal_ngn').notNull(),
  shippingNGN: integer('shipping_ngn').default(0).notNull(),
  discountNGN: integer('discount_ngn').default(0).notNull(),
  taxNGN: integer('tax_ngn').default(0).notNull(),
  totalNGN: integer('total_ngn').notNull(),
  currency: text('currency').default('NGN').notNull(),
  shippingAddress: jsonb('shipping_address').$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  }>(),
  billingAddress: jsonb('billing_address').$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  }>(),
  trackingNumber: text('tracking_number'),
  shippingProvider: text('shipping_provider'),
  estimatedDeliveryDate: date('estimated_delivery_date'),
  deliveredAt: timestamp('delivered_at'),
  couponCode: text('coupon_code'),
  pointsEarned: integer('points_earned').default(0).notNull(),
  pointsUsed: integer('points_used').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orderNumberIdx: uniqueIndex('idx_orders_order_number').on(table.orderNumber),
  userIdCreatedIdx: index('idx_orders_user_created').on(table.userId, table.createdAt),
  statusCreatedIdx: index('idx_orders_status_created').on(table.status, table.createdAt),
  paymentRefIdx: index('idx_orders_payment_ref').on(table.paymentReference),
}));

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  productSnapshot: jsonb('product_snapshot').$type<{
    name: string;
    priceNGN: number;
    imageUrl?: string;
  }>(), // Store product details at time of purchase
  quantity: integer('quantity').notNull(),
  unitPriceNGN: integer('unit_price_ngn').notNull(),
  totalPriceNGN: integer('total_price_ngn').notNull(),
  size: text('size'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index('idx_order_items_order_id').on(table.orderId),
  productIdIdx: index('idx_order_items_product_id').on(table.productId),
}));

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  userId: text('user_id').references(() => users.id),
  amountNGN: integer('amount_ngn').notNull(),
  currency: text('currency').default('NGN').notNull(),
  paymentMethod: text('payment_method').notNull(),
  provider: text('provider'), // paystack/flutterwave
  reference: text('reference').notNull().unique(),
  status: text('status').notNull().default('pending'), // pending/success/failed
  failureReason: text('failure_reason'),
  metadata: jsonb('metadata').$type<Record<string, any>>(), // Provider response
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index('idx_payments_order_id').on(table.orderId),
  referenceIdx: uniqueIndex('idx_payments_reference').on(table.reference),
  statusIdx: index('idx_payments_status').on(table.status),
}));

// ============================================================================
// 4. AI PET ASSISTANT (Scalable)
// ============================================================================

export const userPets = pgTable('user_pets', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  personaType: text('persona_type').notNull(), // grumpy/rude/nonchalant/funny
  name: text('name'), // Customizable pet name
  avatarUrl: text('avatar_url'),
  level: integer('level').default(1).notNull(),
  xp: integer('xp').default(0).notNull(),
  preferences: jsonb('preferences').$type<{
    favoriteCategories?: string[];
    priceRange?: { min?: number; max?: number };
    sizes?: string[];
    colors?: string[];
  }>(),
  memoryContext: jsonb('memory_context').$type<{
    recentConversations?: Array<{ date: string; topic: string }>;
    lastRecommendations?: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: uniqueIndex('idx_user_pets_user_id').on(table.userId), // One pet per user
}));

export const petConversations = pgTable('pet_conversations', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  petId: integer('pet_id').references(() => userPets.id, { onDelete: 'cascade' }).notNull(),
  sessionId: uuid('session_id').notNull(), // Groups conversation
  role: text('role').notNull(), // user/pet/system
  messageText: text('message_text').notNull(),
  messageType: text('message_type'), // text/product_recommendation/coupon_application/etc
  metadata: jsonb('metadata').$type<{
    productsMentioned?: number[];
    actionsTaken?: string[];
    sentiment?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdCreatedIdx: index('idx_pet_conversations_user_created').on(table.userId, table.createdAt),
  sessionIdIdx: index('idx_pet_conversations_session_id').on(table.sessionId),
  createdAtIdx: index('idx_pet_conversations_created_at').on(table.createdAt),
}));

export const petActions = pgTable('pet_actions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  petId: integer('pet_id').references(() => userPets.id, { onDelete: 'cascade' }).notNull(),
  actionType: text('action_type').notNull(), // product_search/coupon_apply/add_to_cart/etc
  actionData: jsonb('action_data').$type<Record<string, any>>(),
  success: boolean('success').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdCreatedIdx: index('idx_pet_actions_user_created').on(table.userId, table.createdAt),
  actionTypeIdx: index('idx_pet_actions_type').on(table.actionType, table.createdAt),
}));

// ============================================================================
// 5. GAMIFICATION & REWARDS (Scalable)
// ============================================================================

export const gameScores = pgTable('game_scores', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gameType: text('game_type').notNull(), // snake/tetris/memory/quiz/wheel
  score: integer('score').notNull(),
  pointsEarned: integer('points_earned').notNull(),
  levelReached: integer('level_reached'),
  timePlayedSeconds: integer('time_played_seconds'),
  devicePlatform: text('device_platform'), // web/android/ios
  metadata: jsonb('metadata').$type<Record<string, any>>(), // Game-specific data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userGameScoreIdx: index('idx_game_scores_user_game').on(table.userId, table.gameType, table.score),
  leaderboardIdx: index('idx_game_scores_leaderboard').on(table.gameType, table.score, table.createdAt),
  createdAtIdx: index('idx_game_scores_created_at').on(table.createdAt),
}));

export const rewards = pgTable('rewards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  discountPercent: integer('discount_percent'),
  discountAmountNGN: integer('discount_amount_ngn'),
  type: text('type').notNull(), // discount/freeShipping/cashback
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRewards = pgTable('user_rewards', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rewardId: integer('reward_id').references(() => rewards.id).notNull(),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // discount/free_shipping/cashback/points
  valuePercent: integer('value_percent'),
  valueAmountNGN: integer('value_amount_ngn'),
  minSpendNGN: integer('min_spend_ngn'),
  used: boolean('used').default(false).notNull(),
  usedAt: timestamp('used_at'),
  usedOrderId: integer('used_order_id').references(() => orders.id),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  codeIdx: uniqueIndex('idx_user_rewards_code').on(table.code),
  userIdUsedIdx: index('idx_user_rewards_user_used').on(table.userId, table.used),
  expiresAtIdx: index('idx_user_rewards_expires_at').on(table.expiresAt),
}));

export const userPointsHistory = pgTable('user_points_history', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  points: integer('points').notNull(), // Positive or negative
  sourceType: text('source_type').notNull(), // purchase/game/referral/review/login_streak/etc
  sourceId: integer('source_id'), // FK to relevant table
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdCreatedIdx: index('idx_user_points_history_user_created').on(table.userId, table.createdAt),
  sourceTypeIdx: index('idx_user_points_history_source').on(table.sourceType, table.createdAt),
}));

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerUserId: text('referrer_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  referredUserId: text('referred_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  referralCode: text('referral_code').notNull().unique(),
  status: text('status').default('pending').notNull(), // pending/completed
  referrerRewardPoints: integer('referrer_reward_points').default(0).notNull(),
  referredRewardPoints: integer('referred_reward_points').default(0).notNull(),
  firstPurchaseCompleted: boolean('first_purchase_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  referralCodeIdx: uniqueIndex('idx_referrals_code').on(table.referralCode),
  referrerIdx: index('idx_referrals_referrer').on(table.referrerUserId),
  referredIdx: index('idx_referrals_referred').on(table.referredUserId),
}));

// ============================================================================
// 6. ANALYTICS & TRACKING (Highly Scalable with Partitioning)
// ============================================================================

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  sessionId: uuid('session_id').notNull(),
  eventType: text('event_type').notNull(), // page_view/product_view/add_to_cart/checkout_start/purchase/search/etc
  eventName: text('event_name').notNull(),
  platform: text('platform'), // web/android/ios
  pagePath: text('page_path'), // For web
  screenName: text('screen_name'), // For mobile
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  searchQuery: text('search_query'),
  metadata: jsonb('metadata').$type<{
    cartValue?: number;
    productPrice?: number;
    orderTotal?: number;
    [key: string]: any;
  }>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  deviceType: text('device_type'), // mobile/tablet/desktop
  os: text('os'), // iOS/Android/Windows/etc
  browser: text('browser'), // Chrome/Safari/etc
  country: text('country').default('Nigeria'),
  state: text('state'), // Lagos/Abuja/etc
  city: text('city'),
  referrerUrl: text('referrer_url'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Partial indexes for hot data only (last 30 days)
  userIdCreatedIdx: index('idx_analytics_events_user_date').on(table.userId, table.createdAt),
  eventTypeCreatedIdx: index('idx_analytics_events_type_date').on(table.eventType, table.createdAt),
  productIdIdx: index('idx_analytics_events_product').on(table.productId, table.createdAt),
  sessionIdIdx: index('idx_analytics_events_session').on(table.sessionId),
  createdAtIdx: index('idx_analytics_events_created_at').on(table.createdAt),
  searchQueryGinIdx: index('idx_analytics_search_gin').using('gin', table.searchQuery),
}));

export const userSessionsAnalytics = pgTable('user_sessions_analytics', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').notNull().unique(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  platform: text('platform'), // web/android/ios
  deviceId: text('device_id'),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  durationSeconds: integer('duration_seconds'),
  pageViewsCount: integer('page_views_count').default(0),
  eventsCount: integer('events_count').default(0),
  productsViewed: integer('products_viewed').default(0),
  cartAddsCount: integer('cart_adds_count').default(0),
  checkoutStarted: boolean('checkout_started').default(false),
  purchaseCompleted: boolean('purchase_completed').default(false),
  orderId: integer('order_id').references(() => orders.id),
  totalValueNGN: decimal('total_value_ngn', { precision: 12, scale: 2 }),
  country: text('country').default('Nigeria'),
  state: text('state'),
  city: text('city'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: uniqueIndex('idx_user_sessions_analytics_session_id').on(table.sessionId),
  userIdStartedIdx: index('idx_user_sessions_analytics_user_started').on(table.userId, table.startedAt),
  startedAtIdx: index('idx_user_sessions_analytics_started_at').on(table.startedAt),
}));

// ============================================================================
// 7. WISHLIST & CART (Scalable)
// ============================================================================

export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userProductIdx: uniqueIndex('idx_wishlists_user_product').on(table.userId, table.productId),
  userIdIdx: index('idx_wishlists_user_id').on(table.userId),
  productIdIdx: index('idx_wishlists_product_id').on(table.productId),
}));

export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id'), // For guest carts
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  size: text('size'),
  color: text('color'),
  addedAt: timestamp('added_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userProductIdx: uniqueIndex('idx_carts_user_product').on(table.userId, table.productId, table.size, table.color),
  sessionProductIdx: uniqueIndex('idx_carts_session_product').on(table.sessionId, table.productId, table.size, table.color),
  userIdIdx: index('idx_carts_user_id').on(table.userId),
  sessionIdIdx: index('idx_carts_session_id').on(table.sessionId),
}));

// ============================================================================
// 8. CONTENT & MARKETING (Scalable)
// ============================================================================

export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // percentage/fixed_amount/free_shipping
  valuePercent: integer('value_percent'),
  valueAmountNGN: integer('value_amount_ngn'),
  minSpendNGN: integer('min_spend_ngn'),
  maxDiscountNGN: integer('max_discount_ngn'),
  usageLimit: integer('usage_limit'), // Total usage limit
  usageCount: integer('usage_count').default(0),
  userLimit: integer('user_limit').default(1), // Per user limit
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  active: boolean('active').default(true).notNull(),
  applicableCategories: jsonb('applicable_categories').$type<number[]>(),
  applicableProducts: jsonb('applicable_products').$type<number[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  codeIdx: uniqueIndex('idx_coupons_code').on(table.code),
  activeValidUntilIdx: index('idx_coupons_active_valid').on(table.active, table.validUntil),
}));

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // order_update/promotion/reward/points/etc
  title: text('title').notNull(),
  message: text('message').notNull(),
  actionUrl: text('action_url'),
  read: boolean('read').default(false).notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdReadIdx: index('idx_notifications_user_read').on(table.userId, table.read),
  createdAtIdx: index('idx_notifications_created_at').on(table.createdAt),
}));

// ============================================================================
// RELATIONS (For Drizzle ORM)
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  addresses: many(userAddresses),
  orders: many(orders),
  pet: one(userPets),
  wishlists: many(wishlists),
  carts: many(carts),
  gameScores: many(gameScores),
  reviews: many(productReviews),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  reviews: many(productReviews),
  orderItems: many(orderItems),
  wishlists: many(wishlists),
  carts: many(carts),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payments: many(payments),
}));

