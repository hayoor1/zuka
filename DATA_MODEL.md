# Zuka E-Commerce - Comprehensive Data Model Proposal

## 🎯 Requirements Summary
- **Scale**: 500 concurrent users
- **Location**: Nigeria
- **Data Needs**: Analytics, Products, Customer Profiles, AI Pet Assistants
- **Analytics**: Trend capture, user behavior, business insights

## 🗄️ Database Platform Recommendation (Scalability-First)

### **Primary Database: PostgreSQL (Neon) ✅**
**Why PostgreSQL for Scale?**
- ✅ Already set up in your project
- ✅ Excellent for complex queries and analytics
- ✅ JSONB support for flexible data (pet conversations, preferences)
- ✅ Full-text search capabilities
- ✅ ACID compliance for transactions
- ✅ **Neon provides auto-scaling** - scales from 500 to 50,000+ users seamlessly
- ✅ **Read replicas** - Separate read/write for analytics queries
- ✅ **Connection pooling** - Built-in PgBouncer for high concurrency
- ✅ **Horizontal scaling** - Can add read replicas as needed
- ✅ **Partitioning** - Native support for table partitioning

### **Caching Layer: Redis (Upstash) ✅**
**Why Redis for Scale?**
- ✅ Already using Upstash Redis in your project
- ✅ **Auto-scaling** - Upstash scales automatically
- ✅ Fast session management (reduces DB load)
- ✅ Leaderboard caching (real-time, no DB queries)
- ✅ Rate limiting (protects DB from abuse)
- ✅ Real-time analytics aggregation
- ✅ **Distributed caching** - Reduces database load by 60-80%

### **Analytics Storage Strategy (Scalable)**
1. **Hot Data (Last 30 days)**: PostgreSQL with indexes
2. **Warm Data (30-365 days)**: PostgreSQL partitioned tables
3. **Cold Data (1+ years)**: Archived to object storage (S3) or separate archive DB
4. **Real-time Aggregates**: Redis + Materialized views refreshed every 15min
5. **Consider TimescaleDB**: If analytics grow >10M events/month

### **Scaling Architecture**
```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ App 1 │ │App 2 │ (Scale horizontally)
└───┬───┘ └──┬───┘
    │        │
┌───▼────────▼───┐
│  Connection     │
│  Pool (PgBouncer)│
└───┬────────────┘
    │
┌───▼──────────────┐     ┌──────────────┐
│ Primary DB       │────▶│ Read Replica │ (Analytics)
│ (Writes)         │     │ (Reads)      │
└──────────────────┘     └──────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ Redis │ │ S3   │ (Archives)
│Cache  │ │Cold  │
└───────┘ └──────┘
```

## 📊 Proposed Data Model

### **Core Tables**

#### 1. **Users & Authentication**
```sql
users
├── id (UUID, primary key)
├── email (unique, indexed)
├── phone (indexed for Nigeria)
├── name
├── password_hash
├── auth_provider (email/google/apple/phone)
├── phone_verified (boolean)
├── email_verified (boolean)
├── profile_image_url
├── date_of_birth
├── gender_preference (for shopping)
├── address_default_id (FK to addresses)
├── reward_points (integer, indexed)
├── gem_level (quartz/sapphire/ruby/etc)
├── total_xp (integer)
├── last_login_at
├── created_at
└── updated_at

user_addresses
├── id (serial)
├── user_id (FK)
├── label (Home/Work/etc)
├── recipient_name
├── phone
├── street_address
├── city
├── state (Lagos/Abuja/etc)
├── country (default: Nigeria)
├── postal_code
├── is_default (boolean)
├── created_at
└── updated_at

user_sessions
├── id (UUID)
├── user_id (FK, nullable for guests)
├── device_id (for mobile apps)
├── platform (web/android/ios)
├── ip_address
├── user_agent
├── started_at
├── last_activity_at
├── expires_at
└── metadata (JSONB - device info, location)
```

#### 2. **Products & Inventory**
```sql
products (enhanced)
├── id (serial, primary key)
├── sku (unique, indexed)
├── slug (unique, indexed)
├── name (indexed for search)
├── description
├── short_description
├── price_ngn (integer, indexed)
├── sale_price_ngn (integer, nullable)
├── cost_price_ngn (for profit analysis)
├── category (FK to categories)
├── gender (men/women/kids/unisex)
├── brand_id (FK to brands)
├── image_url (primary)
├── images (JSONB array)
├── sizes (JSONB array)
├── colors (JSONB array)
├── tags (JSONB array, indexed with GIN)
├── material
├── care_instructions
├── weight_grams
├── dimensions (JSONB)
├── stock_count (integer, indexed)
├── low_stock_threshold
├── in_stock (boolean, indexed)
├── featured (boolean, indexed)
├── new_arrival (boolean, indexed)
├── on_sale (boolean, indexed)
├── rating_average (decimal, indexed)
├── rating_count (integer)
├── view_count (integer, for analytics)
├── purchase_count (integer, for analytics)
├── created_at
└── updated_at

categories
├── id (serial)
├── slug (unique)
├── name
├── description
├── parent_id (FK, for subcategories)
├── image_url
├── display_order
└── active (boolean)

brands
├── id (serial)
├── slug (unique)
├── name
├── description
├── logo_url
└── active (boolean)

product_variants (if needed for complex inventory)
├── id (serial)
├── product_id (FK)
├── size
├── color
├── sku (unique)
├── stock_count
├── price_ngn (nullable, overrides product price)
└── image_url (nullable, variant-specific image)

product_reviews
├── id (serial)
├── product_id (FK, indexed)
├── user_id (FK, indexed)
├── rating (1-5, indexed)
├── title
├── comment
├── images (JSONB array)
├── verified_purchase (boolean)
├── helpful_count (integer)
├── created_at (indexed)
└── updated_at
```

#### 3. **Orders & Payments**
```sql
orders (enhanced)
├── id (serial, primary key)
├── order_number (unique, indexed - e.g., ZUKA-2025-001234)
├── user_id (FK, nullable for guest orders)
├── guest_email
├── guest_phone
├── status (pending/paid/processing/shipped/delivered/cancelled/refunded)
├── payment_status (pending/paid/failed/refunded)
├── payment_method (paystack/flutterwave/cash_on_delivery)
├── payment_reference
├── paystack_reference
├── flutterwave_reference
├── subtotal_ngn
├── shipping_ngn
├── discount_ngn
├── tax_ngn
├── total_ngn (indexed for analytics)
├── currency (default: NGN)
├── shipping_address (JSONB)
├── billing_address (JSONB)
├── tracking_number
├── shipping_provider
├── estimated_delivery_date
├── delivered_at
├── coupon_code (nullable)
├── points_earned (integer)
├── points_used (integer)
├── created_at (indexed for analytics)
└── updated_at

order_items
├── id (serial)
├── order_id (FK, indexed)
├── product_id (FK, indexed)
├── product_snapshot (JSONB - stores product details at time of purchase)
├── quantity
├── unit_price_ngn
├── total_price_ngn
├── size
├── color
└── created_at

payments
├── id (serial)
├── order_id (FK, indexed)
├── user_id (FK, nullable)
├── amount_ngn
├── currency
├── payment_method
├── provider (paystack/flutterwave)
├── reference
├── status (pending/success/failed)
├── failure_reason
├── metadata (JSONB - provider response)
├── created_at
└── updated_at
```

#### 4. **AI Pet Assistant**
```sql
user_pets
├── id (serial)
├── user_id (FK, indexed)
├── persona_type (grumpy/rude/nonchalant/funny)
├── name (customizable pet name)
├── avatar_url
├── level (integer, for pet progression)
├── xp (integer)
├── preferences (JSONB - shopping preferences learned)
├── memory_context (JSONB - recent conversations context)
├── created_at
└── updated_at

pet_conversations
├── id (serial)
├── user_id (FK, indexed)
├── pet_id (FK)
├── session_id (UUID, groups conversation)
├── role (user/pet/system)
├── message_text
├── message_type (text/product_recommendation/coupon_application/etc)
├── metadata (JSONB - products mentioned, actions taken)
├── created_at (indexed for analytics)
└── updated_at

pet_actions
├── id (serial)
├── user_id (FK, indexed)
├── pet_id (FK)
├── action_type (product_search/coupon_apply/add_to_cart/etc)
├── action_data (JSONB)
├── success (boolean)
├── created_at (indexed)
└── updated_at
```

#### 5. **Gamification & Rewards**
```sql
game_scores (enhanced)
├── id (serial)
├── user_id (FK, indexed)
├── game_type (snake/tetris/memory/quiz/wheel)
├── score (integer, indexed)
├── points_earned (integer)
├── level_reached (integer)
├── time_played_seconds (integer)
├── device_platform (web/android/ios)
├── metadata (JSONB - game-specific data)
├── created_at (indexed for leaderboards)
└── updated_at

user_rewards (enhanced)
├── id (serial)
├── user_id (FK, indexed)
├── reward_id (FK)
├── code (unique, indexed)
├── type (discount/free_shipping/cashback/points)
├── value_percent (nullable)
├── value_amount_ngn (nullable)
├── min_spend_ngn (nullable)
├── used (boolean, indexed)
├── used_at (timestamp, indexed)
├── used_order_id (FK, nullable)
├── expires_at (indexed)
├── created_at
└── updated_at

user_points_history
├── id (serial)
├── user_id (FK, indexed)
├── points (integer, positive or negative)
├── source_type (purchase/game/referral/review/login_streak/etc)
├── source_id (FK to relevant table, nullable)
├── description
├── created_at (indexed)
└── updated_at

referrals
├── id (serial)
├── referrer_user_id (FK, indexed)
├── referred_user_id (FK, indexed)
├── referral_code (unique, indexed)
├── status (pending/completed)
├── referrer_reward_points (integer)
├── referred_reward_points (integer)
├── first_purchase_completed (boolean)
├── created_at
└── updated_at
```

#### 6. **Analytics & Tracking** ⭐
```sql
analytics_events
├── id (bigserial)
├── user_id (FK, nullable - for guests)
├── session_id (UUID, indexed)
├── event_type (page_view/product_view/add_to_cart/checkout_start/purchase/search/etc)
├── event_name (string, indexed)
├── platform (web/android/ios)
├── page_path (for web)
├── screen_name (for mobile)
├── product_id (FK, nullable)
├── category (nullable)
├── search_query (nullable, indexed with GIN)
├── metadata (JSONB - flexible event data)
├── ip_address
├── user_agent
├── device_type (mobile/tablet/desktop)
├── os (iOS/Android/Windows/etc)
├── browser (Chrome/Safari/etc)
├── country (default: Nigeria)
├── state (Lagos/Abuja/etc)
├── city
├── referrer_url
├── utm_source
├── utm_medium
├── utm_campaign
├── created_at (indexed, partitioned by date)
└── updated_at

user_sessions_analytics
├── id (bigserial)
├── session_id (UUID, unique, indexed)
├── user_id (FK, nullable)
├── platform (web/android/ios)
├── device_id (for mobile)
├── started_at (indexed)
├── ended_at
├── duration_seconds (integer)
├── page_views_count (integer)
├── events_count (integer)
├── products_viewed (integer)
├── cart_adds_count (integer)
├── checkout_started (boolean)
├── purchase_completed (boolean)
├── order_id (FK, nullable)
├── total_value_ngn (decimal, nullable)
├── country
├── state
├── city
├── referrer
├── utm_source
├── utm_medium
├── utm_campaign
└── metadata (JSONB)

product_analytics (materialized view or table)
├── product_id (FK, indexed)
├── date (date, indexed)
├── views_count (integer)
├── unique_views_count (integer)
├── add_to_cart_count (integer)
├── purchases_count (integer)
├── revenue_ngn (decimal)
├── conversion_rate (decimal)
└── updated_at

category_analytics (materialized view)
├── category_id (FK)
├── date (date)
├── views_count
├── products_viewed_count
├── purchases_count
├── revenue_ngn
└── updated_at

user_behavior_profiles
├── user_id (FK, unique)
├── favorite_categories (JSONB array)
├── favorite_brands (JSONB array)
├── price_range_preference (JSONB - min/max)
├── size_preference (JSONB array)
├── color_preference (JSONB array)
├── browsing_patterns (JSONB - time of day, day of week)
├── purchase_frequency (integer - days between purchases)
├── average_order_value_ngn (decimal)
├── lifetime_value_ngn (decimal)
├── last_purchase_at
├── created_at
└── updated_at
```

#### 7. **Wishlist & Cart**
```sql
wishlists
├── id (serial)
├── user_id (FK, indexed)
├── product_id (FK, indexed)
├── created_at (indexed)
└── unique(user_id, product_id)

carts (persistent cart)
├── id (serial)
├── user_id (FK, indexed, nullable for guests)
├── session_id (UUID, for guest carts)
├── product_id (FK)
├── quantity (integer)
├── size (nullable)
├── color (nullable)
├── added_at (indexed)
└── updated_at
└── unique(user_id/session_id, product_id, size, color)
```

#### 8. **Content & Marketing**
```sql
coupons
├── id (serial)
├── code (unique, indexed)
├── name
├── description
├── type (percentage/fixed_amount/free_shipping)
├── value_percent (nullable)
├── value_amount_ngn (nullable)
├── min_spend_ngn (nullable)
├── max_discount_ngn (nullable)
├── usage_limit (integer, nullable)
├── usage_count (integer)
├── user_limit (integer - per user)
├── valid_from (timestamp)
├── valid_until (timestamp, indexed)
├── active (boolean, indexed)
├── applicable_categories (JSONB array)
├── applicable_products (JSONB array)
├── created_at
└── updated_at

notifications
├── id (serial)
├── user_id (FK, indexed)
├── type (order_update/promotion/reward/points/etc)
├── title
├── message
├── action_url (nullable)
├── read (boolean, indexed)
├── read_at (timestamp)
├── created_at (indexed)
└── updated_at
```

## 📈 Scalable Analytics Strategy

### **Real-Time Analytics (Redis)**
- **Hot counters**: Views, cart adds, active users (Redis)
- **TTL**: 1 hour for real-time, then flush to PostgreSQL
- **Aggregation**: Background job every 15 minutes
- **Scale**: Redis handles millions of operations/second

### **Near-Real-Time Analytics (PostgreSQL)**
- **Materialized views**: Refresh every 15 minutes
- **Partitioning**: Monthly partitions for `analytics_events`
- **Retention**: 
  - Last 30 days: Full detail (hot)
  - 30-365 days: Aggregated daily (warm)
  - 1+ years: Monthly aggregates only (cold)

### **Partitioning Strategy (Critical for Scale)**
```sql
-- Create partitioned table
CREATE TABLE analytics_events (
  -- columns...
) PARTITION BY RANGE (created_at);

-- Monthly partitions (auto-create via cron)
CREATE TABLE analytics_events_2025_01 PARTITION OF analytics_events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE analytics_events_2025_02 PARTITION OF analytics_events
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Benefits:
-- ✅ Queries only scan relevant partitions
-- ✅ Easy to drop old partitions (DELETE becomes DROP TABLE)
-- ✅ Parallel query execution across partitions
-- ✅ Independent indexes per partition
```

### **Archival Strategy (Scale to Millions)**
```sql
-- After 12 months, archive to separate table
CREATE TABLE analytics_events_archive (
  LIKE analytics_events INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Or export to S3/Parquet for data warehouse
-- Use tools like: AWS DMS, pg_dump, or custom ETL
```

### **Materialized Views (Pre-Aggregated)**
```sql
-- Refresh every 15 minutes via cron/Inngest
CREATE MATERIALIZED VIEW product_analytics_daily AS
SELECT 
  product_id,
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE event_type = 'product_view') as views,
  COUNT(*) FILTER (WHERE event_type = 'add_to_cart') as cart_adds,
  COUNT(*) FILTER (WHERE event_type = 'purchase') as purchases
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY product_id, DATE(created_at);

CREATE UNIQUE INDEX ON product_analytics_daily(product_id, date);
-- Refresh: REFRESH MATERIALIZED VIEW CONCURRENTLY product_analytics_daily;
```

### **Key Metrics to Track**
1. **Sales Metrics**: Revenue, AOV, conversion rate, cart abandonment
2. **Product Metrics**: Views, add-to-cart rate, purchase rate, top sellers
3. **User Metrics**: Active users, retention, lifetime value, acquisition channels
4. **Gamification**: Game plays, points earned, leaderboard positions
5. **Pet Assistant**: Usage, recommendations given, actions taken

## 🔍 Scalable Indexing Strategy

### **Critical Indexes (Always On)**
```sql
-- User lookups (high frequency)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_users_reward_points ON users(reward_points DESC) WHERE reward_points > 0;

-- Product searches (most common query)
CREATE INDEX CONCURRENTLY idx_products_slug ON products(slug);
CREATE INDEX CONCURRENTLY idx_products_category_gender_stock ON products(category, gender, in_stock) WHERE in_stock = true;
CREATE INDEX CONCURRENTLY idx_products_featured ON products(featured, created_at DESC) WHERE featured = true;
CREATE INDEX CONCURRENTLY idx_products_on_sale ON products(on_sale, discount_percent DESC) WHERE on_sale = true;

-- Order queries (frequent)
CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX CONCURRENTLY idx_orders_payment_ref ON orders(payment_reference) WHERE payment_reference IS NOT NULL;

-- Analytics (partitioned indexes)
CREATE INDEX CONCURRENTLY idx_analytics_events_user_date ON analytics_events(user_id, created_at DESC) WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
CREATE INDEX CONCURRENTLY idx_analytics_events_type_date ON analytics_events(event_type, created_at DESC) WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
CREATE INDEX CONCURRENTLY idx_analytics_events_product ON analytics_events(product_id, created_at DESC) WHERE product_id IS NOT NULL AND created_at >= CURRENT_DATE - INTERVAL '30 days';

-- Gamification
CREATE INDEX CONCURRENTLY idx_game_scores_user_game ON game_scores(user_id, game_type, score DESC);
CREATE INDEX CONCURRENTLY idx_game_scores_leaderboard ON game_scores(game_type, score DESC, created_at DESC) WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- Pet Assistant
CREATE INDEX CONCURRENTLY idx_pet_conversations_user ON pet_conversations(user_id, created_at DESC) WHERE created_at >= CURRENT_DATE - INTERVAL '90 days';

-- GIN indexes for JSONB search (use sparingly - expensive)
CREATE INDEX CONCURRENTLY idx_products_tags_gin ON products USING GIN(tags) WHERE array_length(tags, 1) > 0;
CREATE INDEX CONCURRENTLY idx_analytics_search_gin ON analytics_events USING GIN(metadata jsonb_path_ops) WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### **Partial Indexes (Space-Saving)**
- Only index active/current data
- Reduces index size by 70-90%
- Faster index maintenance

### **Index Maintenance Strategy**
```sql
-- Weekly: Analyze tables for query planner
ANALYZE products;
ANALYZE orders;
ANALYZE analytics_events;

-- Monthly: Reindex if needed (during low traffic)
-- REINDEX TABLE CONCURRENTLY analytics_events;
```

## 🚀 Scalable Implementation Plan

### **Phase 1: Core Schema + Scalability Foundation (Week 1-2)**
1. ✅ Enhance existing tables (users, products, orders)
2. ✅ Add missing tables (addresses, reviews, wishlists, carts)
3. ✅ **Set up connection pooling** (PgBouncer or Neon's built-in)
4. ✅ **Create critical indexes** (use CONCURRENTLY)
5. ✅ **Set up read replica** (for analytics queries)

### **Phase 2: Analytics Foundation (Week 2-3)**
1. ✅ Create `analytics_events` table **with partitioning**
2. ✅ Set up event tracking middleware (lightweight, async)
3. ✅ **Redis counters** for real-time metrics
4. ✅ Background job for Redis → PostgreSQL sync
5. ✅ Materialized views for common queries

### **Phase 3: AI Pet Assistant (Week 3)**
1. ✅ Create pet tables
2. ✅ Implement conversation storage (with TTL for old conversations)
3. ✅ Add preference learning (JSONB for flexibility)

### **Phase 4: Optimization & Monitoring (Week 4)**
1. ✅ **Query performance monitoring** (pg_stat_statements)
2. ✅ **Set up alerts** for slow queries (>500ms)
3. ✅ **Load testing** (simulate 500 concurrent users)
4. ✅ **Auto-scaling configuration** (Neon auto-scale settings)
5. ✅ **Archival process** (automated monthly)

### **Phase 5: Scale Preparation (Month 2)**
1. ✅ **Read replicas** for analytics (separate read/write)
2. ✅ **Database sharding** strategy (if needed for 10k+ users)
3. ✅ **CDN** for static assets (images, etc.)
4. ✅ **Caching strategy** (Redis for hot data)

## 📊 Scaling Milestones

| Users | Database Size | Strategy |
|-------|--------------|----------|
| **500** | ~10GB | Single Neon instance, Redis cache |
| **2,000** | ~50GB | Add read replica, partition analytics |
| **10,000** | ~200GB | Multiple read replicas, archive old data |
| **50,000+** | ~1TB+ | Consider sharding, data warehouse (BigQuery/Snowflake) |

## 🔧 Scalability Features

### **1. Connection Pooling**
```typescript
// Use Neon's built-in connection pooling
// Or PgBouncer for custom setup
// Handles 500+ concurrent connections efficiently
```

### **2. Read Replicas**
- **Primary**: All writes, critical reads
- **Replica 1**: Analytics queries (heavy aggregations)
- **Replica 2**: Reporting (scheduled reports)
- **Auto-failover**: Built into Neon

### **3. Caching Strategy**
```typescript
// Redis caching layers
- Product details: 1 hour TTL
- User sessions: 24 hours
- Leaderboards: 5 minutes
- Analytics aggregates: 15 minutes
```

### **4. Async Processing**
- **Event tracking**: Async, non-blocking
- **Analytics aggregation**: Background jobs (Inngest)
- **Email notifications**: Queue-based
- **Image processing**: Separate worker

### **5. Database Optimization**
- **Vacuum**: Auto-vacuum enabled
- **Statistics**: Auto-analyze for query planner
- **Index maintenance**: Weekly during low traffic
- **Partition management**: Automated via cron

## 💡 Recommendations

1. **Start with Neon PostgreSQL** - Already set up, scales well
2. **Use Redis for hot data** - Sessions, leaderboards, real-time counters
3. **Partition analytics tables** - Monthly partitions for performance
4. **Materialized views** - Pre-aggregate common queries
5. **Background jobs** - Use Inngest (already in your stack) for analytics aggregation

## 📊 Sample Queries for Analytics

```sql
-- Top selling products this month
SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.total_price_ngn) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND o.status = 'delivered'
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;

-- User conversion funnel
SELECT 
  COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as visitors,
  COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as cart_adds,
  COUNT(DISTINCT CASE WHEN event_type = 'checkout_start' THEN session_id END) as checkouts,
  COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN session_id END) as purchases
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- Pet assistant usage
SELECT 
  persona_type,
  COUNT(*) as conversations_count,
  COUNT(DISTINCT user_id) as unique_users
FROM pet_conversations
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY persona_type;
```

