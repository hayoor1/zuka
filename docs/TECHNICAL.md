# Zuka - Technical Documentation

> **Comprehensive technical documentation for developers**
> 
> This document describes the actual implementation of the Zuka e-commerce platform. Everything documented here is **currently implemented and working**.

**Last Updated:** January 21, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Technology Stack](#technology-stack)
4. [Database Layer](#database-layer)
5. [Web Application](#web-application)
6. [Mobile Application](#mobile-application)
7. [Shared Packages](#shared-packages)
8. [State Management](#state-management)
9. [API Implementation](#api-implementation)
10. [Component Library](#component-library)
11. [Development Guide](#development-guide)

---

## Architecture Overview

### System Design

Zuka is a **monorepo** containing two applications (web and mobile) that share common packages.

```
┌──────────────────────────────────────────────┐
│         CLIENT APPLICATIONS                  │
├──────────────────┬───────────────────────────┤
│   Web (Next.js)  │  Mobile (React Native)   │
│   - SSR Pages    │  - iOS & Android         │
│   - App Router   │  - Expo Router           │
└──────────────────┴───────────────────────────┘
           │                  │
           └──────┬──────────┘
                  │
         ┌────────▼─────────┐
         │  Shared Packages │
         │  @zuka/*         │
         └────────┬─────────┘
                  │
         ┌────────▼─────────┐
         │   Data Sources   │
         │  - Mock catalog  │
         │  - PostgreSQL    │
         │    (optional)    │
         └──────────────────┘
```

### Key Principles

1. **Monorepo** - Single repository, multiple apps
2. **Type Safety** - TypeScript strict mode everywhere
3. **Progressive Enhancement** - Works without database (mock data fallback)
4. **Shared Code** - Common logic in packages
5. **Platform-Specific UI** - Web uses React, Mobile uses React Native

---

## Monorepo Structure

```
ecommerce/
├── apps/
│   ├── web/                    # Next.js 16 web app
│   │   ├── app/                # App Router pages & API
│   │   ├── components/         # React components
│   │   ├── lib/                # Utils, stores, catalog
│   │   ├── public/             # Static assets
│   │   └── package.json
│   │
│   └── mobile/                 # React Native Expo app
│       ├── app/                # Expo Router screens
│       ├── components/         # RN components
│       ├── lib/                # Mobile utils
│       ├── assets/             # Images, icons
│       └── package.json
│
├── packages/                   # Shared packages
│   ├── core/                   # Types & utilities
│   ├── db/                     # Database schema
│   ├── ui/                     # React components
│   ├── payments/               # Paystack integration
│   ├── ai/                     # Pet persona logic
│   ├── analytics/              # Event tracking stub
│   └── realtime/               # Presence stub
│
├── docs/                       # Documentation
│   ├── TECHNICAL.md            # This file
│   ├── DEPLOYMENT.md
│   ├── PERFORMANCE.md
│   ├── SCALABILITY.md
│   └── USER_JOURNEY.md
│
├── pnpm-workspace.yaml         # Workspace config
├── package.json                # Root package
└── tsconfig.json               # Root TypeScript config
```

**Workspace Configuration (`pnpm-workspace.yaml`):**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## Technology Stack

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Web Framework** | Next.js | 16.0.1 | SSR, App Router, API Routes |
| **Mobile Framework** | React Native + Expo | Latest | Cross-platform mobile |
| **Language** | TypeScript | 5.0+ | Type safety |
| **UI Library** | React | 19.x | Component library |
| **Styling (Web)** | Tailwind CSS | 4.0 | Utility-first CSS |
| **Styling (Mobile)** | StyleSheet API | Native | React Native styling |
| **Database** | PostgreSQL | 14+ | Optional (falls back to mock) |
| **ORM** | Drizzle | Latest | Type-safe queries |
| **State Management** | Zustand | 4.x | Cart, user state |
| **Payments** | Paystack | API | Nigerian payment gateway |
| **Icons** | Lucide React | Latest | Icon components |
| **Animations** | Framer Motion | Latest | Web animations (lazy loaded) |
| **Package Manager** | pnpm | 8.x | Monorepo workspaces |

### External Services

| Service | Purpose | Required |
|---------|---------|----------|
| **Neon.tech** | PostgreSQL database | Optional (has fallback) |
| **Paystack** | Payment processing | Required for checkout |
| **Cloudinary** | Image hosting | Optional (using placeholder URLs) |
| **Vercel** | Web hosting | Recommended |

---

## Database Layer

### Implementation

**Location:** `packages/db/src/`

**Files:**
- `schema.ts` - Table definitions (Drizzle ORM)
- `index.ts` - Database client setup

### Database Schema

#### Tables

1. **users** - User accounts
   ```typescript
   {
     id: string (PK),
     email: string (unique),
     name: string?,
     phone: string?,
     rewardPoints: number (default: 0),
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

2. **products** - Product catalog
   ```typescript
   {
     id: serial (PK),
     slug: string (unique),
     name: string,
     description: string?,
     priceNGN: number,             // In kobo
     salePriceNGN: number?,
     discountPercent: number?,
     imageUrl: string?,
     images: string[] (JSONB),
     category: string,
     gender: string,
     sizes: string[] (JSONB),
     colors: string[] (JSONB),
     tags: string[] (JSONB),
     featured: boolean,
     inStock: boolean,
     stockCount: number,
     sku: string?,
     brand: string?,
     material: string?,
     careInstructions: string?,
     weight: number?,
     dimensions: object? (JSONB),
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

3. **orders** - Customer orders
   ```typescript
   {
     id: serial (PK),
     userId: string? (FK),
     email: string,
     phone: string,
     totalNGN: number,
     status: string,              // pending/paid/processing/shipped/delivered/cancelled
     paymentReference: string?,
     paystackReference: string?,
     deliveryAddress: object (JSONB),
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

4. **order_items** - Order line items
   ```typescript
   {
     id: serial (PK),
     orderId: number (FK),
     productId: number (FK),
     quantity: number,
     priceNGN: number,
     size: string?,
     color: string?,
     createdAt: timestamp
   }
   ```

5. **game_scores** - Game leaderboard
   ```typescript
   {
     id: serial (PK),
     userId: string (FK),
     gameType: string,            // 'snake' | 'tetris' | 'memory' | 'quiz'
     score: number,
     pointsEarned: number,
     createdAt: timestamp
   }
   ```

6. **rewards** - Available rewards
   ```typescript
   {
     id: serial (PK),
     name: string,
     description: string?,
     pointsCost: number,
     discountPercent: number?,
     discountAmountNGN: number?,
     type: string,                // 'discount' | 'freeShipping' | 'cashback'
     active: boolean,
     createdAt: timestamp
   }
   ```

7. **user_rewards** - Redeemed rewards
   ```typescript
   {
     id: serial (PK),
     userId: string (FK),
     rewardId: number (FK),
     code: string (unique),
     used: boolean,
     usedAt: timestamp?,
     expiresAt: timestamp,
     createdAt: timestamp
   }
   ```

### Fallback Strategy

**All API routes gracefully degrade:**
- If `DATABASE_URL` is not set → use mock data from `catalog.ts`
- Game scores → store in `globalThis` (memory)
- Orders/checkout → return 503 error with helpful message

This allows the app to work locally without database setup.

---

## Web Application

### App Router Structure

```
apps/web/app/
├── (shop)/                     # Route group (shares layout)
│   ├── cart/
│   │   └── page.tsx            # Shopping cart
│   ├── checkout/
│   │   └── page.tsx            # Checkout form
│   ├── games/
│   │   ├── page.tsx            # Games hub
│   │   ├── snake/page.tsx      # Snake game (FULL)
│   │   ├── tetris/page.tsx     # Tetris (SIMPLIFIED)
│   │   ├── memory/page.tsx     # Memory match (FULL)
│   │   └── quiz/page.tsx       # Naija trivia (FULL)
│   ├── leaderboard/
│   │   └── page.tsx            # Game rankings
│   ├── pet/
│   │   └── page.tsx            # AI pet chat
│   ├── ranks/
│   │   └── page.tsx            # User gem levels
│   ├── rewards/
│   │   ├── page.tsx            # Rewards hub
│   │   └── spin/page.tsx       # Spin the wheel
│   ├── shop/
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/page.tsx     # Product detail
│   ├── wishlist/
│   │   └── page.tsx            # Saved products
│   └── layout.tsx              # Shared layout with Navbar
│
├── admin/
│   └── products/
│       └── page.tsx            # Product upload UI
│
├── api/                        # API Routes
│   ├── admin/
│   │   └── products/
│   │       ├── route.ts        # Create/update product
│   │       └── bulk/route.ts   # Bulk upload
│   ├── checkout/
│   │   └── route.ts            # Process order
│   ├── games/
│   │   ├── leaderboard/route.ts
│   │   └── score/route.ts      # Submit score
│   ├── health/
│   │   └── route.ts            # Health check
│   ├── pet/
│   │   └── route.ts            # Pet chat
│   ├── products/
│   │   └── route.ts            # Fetch products
│   ├── rewards/
│   │   └── spin/route.ts       # Spin wheel
│   └── user/
│       └── id/route.ts         # Get user ID
│
├── brands/
│   └── page.tsx                # Brand listing
├── cart/
│   └── add/route.ts            # Add to cart endpoint
├── layout.tsx                  # Root layout
├── page.tsx                    # Homepage
└── globals.css                 # Global styles
```

### Page Implementations

#### Homepage (`page.tsx`)

**Features:**
- Hero carousel
- Category grid (6 categories)
- Featured products
- Women's luxury section
- Men's atelier section
- Value props
- Newsletter signup
- Trust badges

**Data Source:** `catalog.ts` (mock data)

**Component Type:** Client Component (`'use client'`)

#### Shop Page (`shop/page.tsx`)

**Features:**
- Product grid/list view
- Filters:
  - Gender (All, Women, Men, Kids, Unisex)
  - Category (16 categories)
  - Brand (dynamic from catalog)
  - Price ranges (4 tiers)
- Search bar
- Sort options (featured, price, newest)
- Tone variations (neutral, feminine, masculine)
- Mobile-responsive filters

**Data Source:** `listProducts()` from `catalog.ts`

**State:** Client-side filtering

#### Product Detail (`shop/[slug]/page.tsx`)

**Features:**
- Image gallery
- Product info
- Size/color selector
- Add to cart
- Related products
- Breadcrumb navigation

#### Cart (`cart/page.tsx`)

**Features:**
- Cart items list
- Quantity controls
- Remove items
- Total calculation
- Coupon code input
- Checkout CTA

**State:** Zustand `useCartStore`

#### Checkout (`checkout/page.tsx`)

**Features:**
- Delivery address form
- Order summary
- Paystack payment integration

**Flow:**
1. Fill form
2. POST to `/api/checkout`
3. Redirect to Paystack
4. Complete payment
5. Return to confirmation page

### Games Implementation

#### Snake Game (`games/snake/page.tsx`)

**Status:** ✅ FULLY IMPLEMENTED

**Features:**
- Canvas-based rendering (320x320px)
- Arrow key controls
- Collision detection
- Food spawning
- Score tracking
- Save score to API

**Implementation:**
- 20x20 grid
- 16px cell size
- 120ms game tick
- Score: +10 per food

#### Tetris (`games/tetris/page.tsx`)

**Status:** ⚠️ SIMPLIFIED PLACEHOLDER

**Current Implementation:**
- Canvas rendering
- Basic block falling
- Score incrementing
- NOT a full Tetris implementation (just demonstration)

#### Memory Match (`games/memory/page.tsx`)

**Status:** ✅ FULLY IMPLEMENTED

**Features:**
- Card flip animations
- Pair matching logic
- Move counter
- Timer
- Score calculation
- Difficulty levels

#### Naija Quiz (`games/quiz/page.tsx`)

**Status:** ✅ FULLY IMPLEMENTED

**Features:**
- Multiple choice questions
- Categories (History, Geography, Culture, Music, Food, Sports, General)
- 20-second timer per question
- 3 lives system
- Score tracking (+100 per correct answer)
- Category filtering

**Questions:** 13 pre-loaded Naija trivia questions

#### Games Hub (`games/page.tsx`)

**Features:**
- Game cards with stats
- Difficulty badges
- Max reward display
- Play time estimates
- Personal best scores
- Difficulty filter
- Weekly tournament banner
- "How It Works" section

### Other Pages

- **Leaderboard** (`leaderboard/page.tsx`) - Game rankings
- **Ranks** (`ranks/page.tsx`) - Gem level progression
- **Rewards** (`rewards/page.tsx`) - Points & rewards hub
- **Spin & Win** (`rewards/spin/page.tsx`) - Daily spin
- **Pet** (`pet/page.tsx`) - AI shopping assistant
- **Wishlist** (`wishlist/page.tsx`) - Saved products
- **Admin Products** (`admin/products/page.tsx`) - Product management UI

---

## Mobile Application

### Structure

```
apps/mobile/
├── app/
│   ├── (tabs)/                 # Tab navigation
│   │   ├── index.tsx           # Home screen
│   │   ├── shop.tsx            # Product browsing
│   │   ├── games.tsx           # Games hub
│   │   ├── wishlist.tsx        # Wishlist
│   │   └── profile.tsx         # User profile
│   ├── shop/
│   │   └── [slug].tsx          # Product detail
│   ├── _layout.tsx             # Root layout
│   ├── auth.tsx                # Auth screen
│   ├── cart.tsx                # Shopping cart
│   └── checkout.tsx            # Checkout
│
├── components/
│   ├── Navbar.tsx              # RN navigation
│   ├── ProductCard.tsx         # RN product card
│   └── ValueProps.tsx          # RN value props
│
└── lib/
    ├── catalog.ts              # Product data (duplicated)
    └── utils.ts                # formatNGN, etc.
```

### Technology

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **React Navigation** - Navigation (under the hood)
- **Expo Linear Gradient** - Gradient components
- **StyleSheet** - Styling

### Data Sharing

⚠️ **Current State:** Mobile app has its own `catalog.ts` with product data.

**Issue:** Product data is duplicated between web and mobile.

**Recommendation:** Move to shared package in future.

---

## Shared Packages

### `@zuka/core` ✅

**Purpose:** Shared types and utilities

**Exports:**
```typescript
// Types
export const ProductSchema = z.object({...});
export type Product = z.infer<typeof ProductSchema>;

export const CurrencyCode = z.enum(["NGN"]);
export type CurrencyCode = z.infer<typeof CurrencyCode>;

export type CartItem = {...};
export type Coupon = {...};

// Utilities
export function formatNGN(amount: number): string {
  const naira = amount / 100;  // Convert kobo to naira
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN' 
  }).format(naira);
}

// Gem Level System
export const GemLevels = [
  'Quartz', 'Sapphire', 'Ruby', 'Emerald', 
  'Diamond', 'Obsidian', 'Crown'
] as const;

export function levelForXP(xp: number): GemLevel {
  if (xp < 100) return 'Quartz';
  if (xp < 300) return 'Sapphire';
  if (xp < 700) return 'Ruby';
  if (xp < 1500) return 'Emerald';
  if (xp < 3000) return 'Diamond';
  if (xp < 6000) return 'Obsidian';
  return 'Crown';
}
```

### `@zuka/db` ✅

**Purpose:** Database schema and client

**Files:**
- `src/schema.ts` - Drizzle table definitions
- `src/index.ts` - Database client setup
- `drizzle.config.ts` - Drizzle Kit configuration

**Usage:**
```typescript
import { db, products, orders } from '@zuka/db';

// Query products
const allProducts = await db.select().from(products);

// Insert order
await db.insert(orders).values({
  email: 'user@example.com',
  totalNGN: 1950000,
  status: 'pending'
});
```

### `@zuka/ui` ✅

**Purpose:** Shared React component primitives

**Components:**
- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Container with shadow
- `Badge` - Small label
- `Input` - Form input

**Implementation:** Radix UI wrappers with Tailwind

**Usage:**
```typescript
import { Button, Card, Badge } from '@zuka/ui';

<Card>
  <Badge>New</Badge>
  <Button variant="primary">Click me</Button>
</Card>
```

### `@zuka/payments` ✅

**Purpose:** Paystack payment integration

**Functions:**
```typescript
export async function initiatePayment({
  email: string,
  amount: number,      // In naira (auto-converts to kobo)
  orderId: number,
  metadata?: object
}): Promise<{
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}>;

export async function verifyPayment(reference: string);

export async function getTransactionFee(amount: number): number;
// Returns Paystack fee: 1.5% + ₦100, capped at ₦2,000
```

**Configuration:**
- Requires `PAYSTACK_SECRET_KEY` environment variable
- Converts naira to kobo automatically (amount * 100)
- Generates reference: `ZUKA-{orderId}-{timestamp}`

### `@zuka/ai` ⚠️ MINIMAL

**Purpose:** AI pet persona logic

**Implementation:**
```typescript
export type Persona = 'grumpy' | 'rude' | 'nonchalant' | 'funny';

export function replyForPersona(persona: Persona, text: string) {
  const responses = {
    grumpy: (t) => `Hmph. ${t}? Try the hoodie. Reliable.`,
    rude: (t) => `Tch. ${t}? Just buy the tee already.`,
    nonchalant: (t) => `Okay. ${t}. The tee is fine.`,
    funny: (t) => `Lol ${t}. Hoodie so warm it has feelings.`,
  };
  return { text: responses[persona](text), persona };
}
```

**Note:** Basic persona mapping only. No real AI/LLM integration.

### `@zuka/analytics` ⚠️ STUB

**Purpose:** Analytics event tracking

**Implementation:**
```typescript
export function track(event: string, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[analytics]', event, props || {});
  }
  // TODO: Send to analytics service
}
```

**Note:** Only console logging currently. No real analytics integration.

### `@zuka/realtime` ⚠️ STUB

**Purpose:** Realtime presence tracking

**Implementation:**
```typescript
export function presenceKey(room: string) {
  return `presence:${room}`;
}
```

**Note:** Minimal helper function. No real realtime integration.

---

## State Management

### Cart Store (Zustand)

**Location:** `apps/web/lib/store.ts`

**Implementation:**
```typescript
interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  userId: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
  initialize: () => void;
}
```

**Features:**
- LocalStorage persistence (`zuka-cart` key)
- Automatic user ID initialization
- Deduplication by productId + size + color
- Total calculation
- Item count

**Usage:**
```typescript
import { useCartStore } from '@/lib/store';

function Component() {
  const { items, addItem, total, itemCount } = useCartStore();
  
  const handleAdd = () => {
    addItem({
      id: `temp-${Date.now()}`,
      productId: 1,
      name: 'Product',
      price: 1000000,
      imageUrl: '...',
      quantity: 1
    });
  };
  
  return <div>Items: {itemCount()}, Total: {formatNGN(total())}</div>;
}
```

### User Store (Zustand)

**Location:** `apps/web/lib/user-store.ts`

**Purpose:** Manage user state and points

**Implementation:**
```typescript
interface UserStore {
  points: number;
  gemLevel: string;
  setPoints: (points: number) => void;
  addPoints: (points: number) => void;
  updateGemLevel: () => void;
}
```

### User ID System

**Location:** `apps/web/lib/user-id.ts`

**Purpose:** Generate and manage persistent user ID for guest users

**Functions:**
```typescript
// Client-side
export function getClientUserId(): string {
  // Gets from localStorage or generates new
  // Format: user_{timestamp}_{random}
}

// Server-side
export async function getServerUserId(): Promise<string> {
  // Gets from cookies or generates new
}

// Utilities
export function formatUserId(userId: string): string;
export function hasUserId(): boolean;
```

**Storage:**
- LocalStorage: `zuka_user_id`
- Cookie: `zuka_user_id` (1 year expiry)

---

## API Implementation

### Endpoints

#### GET `/api/products`

**Query Params:**
- `featured=true` - Get featured products only
- `category=<string>` - Filter by category
- `limit=<number>` - Limit results (default: 50)

**Implementation:**
1. Check if `DATABASE_URL` exists
2. If yes → Query database
3. If no → Use `catalog.ts` mock data
4. Apply filters
5. Return JSON with cache headers

**Cache:** 5 min (`s-maxage=300`)

#### POST `/api/checkout`

**Requires:** `DATABASE_URL` and `PAYSTACK_SECRET_KEY`

**Request Body:**
```json
{
  "items": [{ "productId": 1, "quantity": 2, "size": "L", "color": "black" }],
  "email": "user@example.com",
  "phone": "+2348012345678",
  "deliveryAddress": { "street": "...", "city": "...", "state": "...", "country": "Nigeria" }
}
```

**Validation:** Zod schema
- Email must be valid
- Phone must match: `+234XXXXXXXXXX`
- Quantity: 1-99

**Process:**
1. Validate input
2. Fetch products from database
3. Calculate total (server-side, don't trust client)
4. Create order
5. Create order items
6. Initialize Paystack payment
7. Return payment URL

#### POST `/api/games/score`

**Form Data:**
- `game` - Game type
- `score` - Score value

**Anti-Abuse:**
- Score must be 5-50,000
- Points = score / 10

**Fallback:**
- No database → store in `globalThis.__scores` (memory)
- Database available → insert into `game_scores` table

#### GET `/api/games/score`

**Query Params:**
- `game=<string>` - Filter by game type
- `limit=<number>` - Limit results (default: 20)

**Returns:** Leaderboard with ranks

#### POST `/api/rewards/spin`

**Implementation:**
- Cookie-based daily limit (`gc_spin_date`)
- Random prize from pool: `WELCOME1000`, `WELCOME500`, `TRYLUCK200`, `NICE50`
- Returns 429 if already spun today

#### POST `/api/admin/products`

**Requires:** `DATABASE_URL`

**Validation:** Zod schema with 16 categories

**Upsert Logic:**
- If slug exists → UPDATE
- If slug doesn't exist → CREATE

#### POST `/api/admin/products/bulk`

**Request:**
```json
{
  "products": [...]
}
```

**Returns:** Count of created/updated/failed

---

## Component Library

### Web Components (`apps/web/components/`)

#### ProductCard ✅

**Props:**
```typescript
{
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  slug: string;
  brand?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  tone?: 'neutral' | 'feminine' | 'masculine';
  onQuickAdd?: () => void;
}
```

**Features:**
- Hover effects (wishlist button, quick add button)
- Tone variations (3 color schemes)
- Points earned display
- Star ratings
- Image error fallback

#### Navbar ✅

**Features:**
- Responsive mobile menu
- Shopping cart badge with count
- Category links
- Search bar (future)
- Logo

#### StarRating ✅

**Props:**
```typescript
{
  rating: number;        // 0-5
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### AddToCartButton ✅

**Props:**
```typescript
{
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  size?: string;
  color?: string;
}
```

**Functionality:**
- Integrates with `useCartStore`
- Loading state
- Success feedback

#### Breadcrumb ✅

**Props:**
```typescript
{
  items: Array<{ label: string; href?: string }>;
}
```

#### ValueProps ✅

**Features:**
- 4 value propositions
- Icons with gradients
- Responsive grid

### Animation Components ✅

**All lazy loaded via `LazyAnimations.tsx`:**

- `GemAnimation` - 3D gem viewer
- `CelebrationAnimation` - Level up effects
- `WelcomeAnimation` - First visit animation
- `SignupAnimation` - Registration progress

**Benefits:**
- Reduces initial bundle by ~35KB
- Only loads when triggered
- SSR disabled (`ssr: false`)

---

## Data Flow

### Product Catalog Flow

```
1. User visits /shop
   │
   ├─► Server Component OR Client Component
   │   └─► Calls listProducts() from catalog.ts
   │       └─► Returns array of CatalogProduct
   │
   ├─► Filter client-side (gender, category, price, brand)
   │
   └─► Render ProductCard for each product
```

**Note:** Currently uses mock data from `catalog.ts`. Database integration is optional.

### Shopping Cart Flow

```
1. User clicks "Add to Cart"
   │
   ├─► AddToCartButton component
   │   └─► useCartStore.addItem({...})
   │       ├─► Check if item exists (by productId + size + color)
   │       ├─► If exists: increment quantity
   │       ├─► If new: add to items array
   │       └─► Persist to localStorage
   │
   ├─► Cart badge updates reactively
   │
   └─► User navigates to /cart
       └─► CartPage reads from useCartStore
           ├─► Display items with images
           ├─► Show total: formatNGN(total())
           └─► Proceed to Checkout button
```

### Checkout Flow

```
1. User on /cart clicks "Checkout"
   │
   ├─► Navigate to /checkout
   │
   ├─► Fill form (email, phone, address)
   │
   ├─► Click "Pay Now"
   │   └─► POST /api/checkout
   │       ├─► Validate form (Zod)
   │       ├─► Check DATABASE_URL exists
   │       ├─► Fetch products from DB
   │       ├─► Calculate total (server-side, secure)
   │       ├─► Create order in DB
   │       ├─► Create order_items in DB
   │       ├─► Call initiatePayment()
   │       │   └─► Paystack API
   │       └─► Return { paymentUrl, reference }
   │
   ├─► Redirect to Paystack checkout
   │
   └─► User completes payment
       └─► Redirect back to app
           └─► Verify payment (future)
               └─► Show order confirmation
```

### Game Score Flow

```
1. User plays game (e.g., Snake)
   │
   ├─► Canvas-based game logic in component
   │   └─► Update local score state
   │
   ├─► User clicks "Save Score"
   │   └─► Form submit to POST /api/games/score
   │       ├─► Validate score (5-50,000)
   │       ├─► Calculate points (score / 10)
   │       ├─► Get user ID from cookie
   │       ├─► Check DATABASE_URL
   │       ├─► If DB: Insert to game_scores table
   │       └─► If no DB: Store in globalThis.__scores
   │
   └─► Leaderboard updated
       └─► GET /api/games/score?game=snake
           └─► Returns ranked scores
```

---

## Payment Integration

### Paystack Setup

**Environment Variables:**
```bash
PAYSTACK_SECRET_KEY=sk_test_xxx  # Required
NEXT_PUBLIC_URL=http://localhost:3000  # For callback
```

### Payment Flow

1. **Initialize Payment:**
   ```typescript
   const payment = await initiatePayment({
     email: 'user@example.com',
     amount: 19500,  // ₦19,500 (auto-converts to kobo)
     orderId: 123,
     metadata: { phone: '+2348012345678' }
   });
   
   // Returns:
   // {
   //   success: true,
   //   authorizationUrl: 'https://checkout.paystack.com/xxx',
   //   reference: 'ZUKA-123-1737459600000'
   // }
   ```

2. **Redirect to Paystack:**
   ```typescript
   window.location.href = payment.authorizationUrl;
   ```

3. **Verify Payment (after callback):**
   ```typescript
   const verification = await verifyPayment(reference);
   
   if (verification.success) {
     // Update order status
     // Award points
     // Send confirmation
   }
   ```

**Fee Calculation:**
- Paystack charges: 1.5% + ₦100
- Capped at: ₦2,000
- Example: ₦10,000 order = ₦250 fee

---

## Gamification System

### Points System

**Earning:**
- **Shopping:** 1 point per ₦100 spent
  ```typescript
  const points = Math.floor(totalNGN / 10000);
  ```

- **Games:** score / 10
  ```typescript
  const points = Math.floor(score / 10);
  ```

**Limits:**
- Daily point cap per game (anti-abuse)
- Score validation: 5-50,000 range

### Gem Levels

**Progression:**
```
Quartz    (0-99 XP)
Sapphire  (100-299 XP)
Ruby      (300-699 XP)
Emerald   (700-1,499 XP)
Diamond   (1,500-2,999 XP)
Obsidian  (3,000-5,999 XP)
Crown     (6,000+ XP)
```

**Implementation:**
```typescript
import { levelForXP } from '@zuka/core';

const level = levelForXP(1250); // Returns 'Emerald'
```

### Rewards Tiers

**Redemption:**
- 500 pts → ₦5,000 OFF
- 1,000 pts → ₦12,000 OFF
- 2,000 pts → ₦30,000 OFF
- 5,000 pts → VIP Access + ₦100,000 OFF

---

## Styling & Theming

### Tailwind Configuration

**Brand Colors:**
```javascript
// tailwind.config.ts
{
  colors: {
    'brand-purple': '#570a70',
    'brand-gold': '#e49b09',
    'brand-pink': '#e246a4',
    'brand-dark': '#3d074e',
  }
}
```

### Tone System

Three color schemes for different demographics:

**1. Neutral (Default)**
```css
price: #570a70 (purple)
background: #f1e9f4 (light purple)
```

**2. Feminine**
```css
price: #e246a4 (pink)
background: #f9daed (light pink)
```

**3. Masculine**
```css
price: #e49b09 (gold)
background: #2f063d (dark purple)
```

**Usage:**
```typescript
<ProductCard tone="feminine" {...props} />
```

### Global Styles

**Location:** `apps/web/app/globals.css`

**Custom Classes:**
- `.brand-card` - Card with brand styling
- `.pattern-ankara` - Background pattern
- Animation utilities
- Gradient helpers

---

## Development Guide

### Setup

```bash
# Clone repository
git clone <repo-url>
cd ecommerce

# Install dependencies
pnpm install

# Start web app
cd apps/web
pnpm dev

# Start mobile app (separate terminal)
cd apps/mobile
npm start
```

### Environment Variables

**Optional for local development:**

```bash
# apps/web/.env.local
DATABASE_URL=postgresql://...
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_URL=http://localhost:3000
```

**Without these:** App works with mock data

### Adding a Feature

#### 1. Add Type to `@zuka/core`

```typescript
// packages/core/src/index.ts
export type NewFeature = {
  id: string;
  name: string;
};
```

#### 2. Add Database Table (if needed)

```typescript
// packages/db/src/schema.ts
export const newFeatures = pgTable('new_features', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
```

#### 3. Create API Route

```typescript
// apps/web/app/api/new-feature/route.ts
export async function GET() {
  // Implementation
}
```

#### 4. Create Page

```typescript
// apps/web/app/(shop)/new-feature/page.tsx
export default function NewFeaturePage() {
  return <div>New Feature</div>;
}
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=@zuka/core

# Build web app
pnpm build --filter=@zuka/web
```

---

## Code Patterns

### Pattern 1: Optional Database

All API routes check for database:

```typescript
if (!process.env.DATABASE_URL) {
  // Use mock data or return error
  return NextResponse.json(mockData);
}

// Dynamic import (only loads if needed)
const { db, products } = await import('@zuka/db');
```

### Pattern 2: Form Data in API Routes

```typescript
// POST handler
const form = await req.formData();
const game = String(form.get('game') || '');
const score = Number(form.get('score') || 0);
```

### Pattern 3: Zustand with Persistence

```typescript
export const useStore = create()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      }))
    }),
    { name: 'storage-key' }
  )
);
```

### Pattern 4: Server/Client User ID

```typescript
// Client component
'use client';
import { getClientUserId } from '@/lib/user-id';
const userId = getClientUserId();

// Server component / API route
import { getServerUserId } from '@/lib/user-id';
const userId = await getServerUserId();
```

---

## Known Limitations

1. **No Authentication** - Guest-only currently
2. **Mock Data Default** - Products from `catalog.ts` unless DB configured
3. **No Email System** - Order confirmations not sent
4. **No Webhooks** - Payment verification is manual
5. **Tetris Game** - Simplified implementation, not full Tetris
6. **AI Pet** - Basic persona responses, no real AI
7. **Analytics** - Stub implementation (console.log only)
8. **Admin Security** - No authentication on admin routes

---

## Future Roadmap

Items **not yet implemented** but planned:

- [ ] NextAuth.js authentication
- [ ] Email notifications (Resend)
- [ ] Paystack webhooks
- [ ] Real-time leaderboard (WebSocket)
- [ ] Advanced AI pet (OpenAI integration)
- [ ] Product search (Algolia/Meilisearch)
- [ ] User wishlists (persistent)
- [ ] Order tracking
- [ ] Admin dashboard analytics
- [ ] Rate limiting
- [ ] Image upload to Cloudinary

---

## Getting Help

**Code Navigation:**
1. Start with `README.md` - high-level overview
2. Read this file - technical details
3. Check specific docs in `docs/` folder
4. Review code in `apps/` and `packages/`

**Common Questions:**

Q: Why two catalog files (web and mobile)?  
A: Mobile hasn't been refactored to use shared package yet.

Q: Why does the app work without a database?  
A: All API routes have fallback logic to use mock data from `catalog.ts`.

Q: Are the games real?  
A: Snake, Memory, and Quiz are fully functional. Tetris is simplified.

Q: Is the AI pet real?  
A: Basic implementation with persona mapping. No actual AI/LLM.

---

**Last Updated:** January 21, 2026  
**Status:** Production Ready (with mock data) | Database Optional
