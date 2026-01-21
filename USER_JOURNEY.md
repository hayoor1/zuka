# Zuka E-Commerce - Simplified User Journey

## 🎯 Core User Journeys

### Journey 1: The Shopper 🛍️
```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Browse     │
│  Products   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Product    │
│  Detail     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Add to    │
│    Cart     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Checkout   │
│   & Pay     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Earn      │
│   Gems! 💎  │
└─────────────┘
```

### Journey 2: The Gamer 🎮
```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Games     │
│    Hub      │
└──────┬──────┘
       │
       ├────► Snake (500 pts)
       │
       ├────► Tetris (750 pts)
       │
       ├────► Memory (200 pts)
       │
       ├────► Trivia (600 pts)
       │
       └────► Spin (1000 pts)
              │
              ▼
       ┌─────────────┐
       │  Earn       │
       │  Points 🎯  │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ Leaderboard │
       │   Rank Up   │
       └─────────────┘
```

### Journey 3: The Redeemer 🎁
```
┌─────────────┐
│   Rewards   │
│    Hub      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  View       │
│  Points     │
│  Balance    │
└──────┬──────┘
       │
       ├────► Active Coupons
       │      (10% OFF, Free Shipping)
       │
       └────► Redeem Points
              │
              ├─► 500 pts = ₦5,000 OFF
              ├─► 1000 pts = ₦12,000 OFF
              ├─► 2000 pts = ₦30,000 OFF
              └─► 5000 pts = VIP Access
                   │
                   ▼
              ┌─────────────┐
              │   Shop      │
              │   with      │
              │  Discount   │
              └─────────────┘
```

## 🔄 The Complete Engagement Loop

```
     ┌──────────────────────────────────────┐
     │                                      │
     ▼                                      │
┌─────────┐    ┌──────────┐    ┌──────────┼────┐
│  Land   │───►│   Shop   │───►│  Buy &   │    │
│  Page   │    │ Products │    │ Earn 💎  │    │
└────┬────┘    └──────────┘    └──────────┘    │
     │                                          │
     │         ┌──────────┐    ┌──────────┐    │
     └────────►│   Play   │───►│  Earn    │────┘
               │  Games   │    │ Points 🎮│
               └──────────┘    └──────────┘
                      │              │
                      │              ▼
                      │         ┌──────────┐
                      └────────►│ Redeem   │
                                │ Rewards  │
                                └──────────┘
```

## 📱 Main Navigation Points

```
┌─────────────────────────────────────────────────────┐
│  Home │ Shop │ Games │ Rewards │ Ranks │ Profile    │
└─────────────────────────────────────────────────────┘
   │       │      │        │         │        │
   │       │      │        │         │        └─► Orders
   │       │      │        │         │            Points
   │       │      │        │         │            Settings
   │       │      │        │         │
   │       │      │        │         └──────────► Leaderboard
   │       │      │        │                     Top 10
   │       │      │        │                     Tournaments
   │       │      │        │
   │       │      │        └────────────────────► Coupons
   │       │      │                               Redeem
   │       │      │                               Balance
   │       │      │
   │       │      └─────────────────────────────► Snake
   │       │                                      Tetris
   │       │                                      Memory
   │       │                                      Trivia
   │       │                                      Spin
   │       │
   │       └────────────────────────────────────► Categories
   │                                               Filters
   │                                               Search
   │                                               Product Detail
   │
   └────────────────────────────────────────────► Hero
                                                   Featured
                                                   Categories
                                                   Newsletter
```

## 💡 Key Features by Page

### 🏠 Landing Page
- Hero carousel (3 slides)
- 8 category tiles
- Featured products (8 items)
- Women's luxury edit (4 items)
- Men's atelier (4 items)
- Gamification CTAs
- Newsletter signup

### 🛒 Shop Page
**Filters:**
- Gender (All, Women, Men, Kids, Unisex)
- Category (13 types)
- Price ranges (4 tiers)
- Search bar
- Sort options

**Display:**
- Grid/List view
- Product cards with ratings
- Quick add to cart
- Wishlist button

### 🎮 Games Hub
**Stats Display:**
- Best score
- Daily streak
- Points earned today
- Global rank

**Available Games:**
1. Snake Classic (Easy, 2-5 min)
2. Block Stacker (Medium, 5-10 min)
3. Memory Match (Medium, 2-5 min)
4. Naija Trivia (Easy, 3-6 min)
5. Spin & Win (Instant)

### 🎁 Rewards Hub
**Points Overview:**
- Current balance (animated counter)
- Progress bar to next tier
- Points history

**Redemption Options:**
- Active coupons (3+)
- Points exchange (4 tiers)
- Member benefits (4 perks)
- Invite friends bonus

### 🛍️ Cart Page
- Item list with images
- Quantity controls
- Price breakdown
- Coupon code input
- Gems to be earned
- Recommendations
- Trust badges

### 💳 Checkout Page
**Form Fields:**
- Full name
- Email
- Address
- City
- State
- Phone

**Payment:**
- Paystack integration
- Secure checkout badge

### 📊 Profile & Rankings
- Order history
- Points balance
- Achievements
- Wishlist
- Leaderboard position
- Weekly tournament status

## 🎯 Conversion Touchpoints

### Primary CTAs
1. **"Shop Now"** - Hero section
2. **"Play Games"** - Games hub
3. **"Redeem Rewards"** - Rewards section
4. **"Add to Cart"** - Product pages
5. **"Proceed to Checkout"** - Cart
6. **"Subscribe"** - Newsletter

### Secondary CTAs
- "Continue Shopping"
- "View All Products"
- "Learn More"
- "View Leaderboard"
- "Share Invite"

## 🔢 Points & Rewards System

### Earning Points
```
Purchase:     ₦100 spent = 1 point
Games:        Up to 1,000 points/day
Daily Streak: Bonus multiplier
Referrals:    Both get ₦5,000
Newsletter:   Bonus points
```

### Redeeming Points
```
 500 points → ₦5,000 OFF
1000 points → ₦12,000 OFF
2000 points → ₦30,000 OFF
5000 points → VIP + ₦100,000 OFF
```

### Weekly Tournament
```
Top 10 Players:
- ₦100,000 prize pool
- VIP styling slots
- Atelier preview access
- Exclusive releases
```

## 🎨 Brand Experience

### Visual Theme
- **Primary Colors:** Purple (#570a70) & Gold (#e49b09)
- **Feminine:** Pink/Rose tones
- **Masculine:** Dark purple/obsidian
- **Neutral:** White/cream with gold accents

### Typography
- Headlines: Bold, 4xl-5xl
- Body: Regular, base-lg
- Accents: Uppercase tracking

### Animations
- Staggered card entrance
- Count-up numbers
- Icon bounce
- Progress bars
- Shimmer effects
- Scale pulse (urgent items)

## 📊 User Flow Metrics

### Shopping Funnel
```
Landing → Shop → Product → Cart → Checkout → Complete
 100%     75%     60%      45%      35%        30%
```

### Engagement Funnel
```
Landing → Games → Play → Points → Redeem → Shop
 100%      40%    30%     25%      15%      10%
```

### Retention Loop
```
Purchase → Earn → Play → Rank → Reward → Repeat
  Day 1     Day 1   Day 2-7  Day 7   Day 14   Day 30+
```

---

## 🚀 Quick Start for Users

### New User (First Visit):
1. **Arrive** at landing page
2. **Browse** hero carousel & featured products
3. **Sign up** for newsletter → Get bonus points
4. **Shop** with welcome discount (10% OFF)
5. **Play** a game → Earn first points
6. **Check** leaderboard position

### Returning User:
1. **Login** to view points
2. **Check** daily rewards
3. **Play** games for streak bonus
4. **Browse** new arrivals
5. **Redeem** accumulated points
6. **Shop** with rewards

### Power User (Engaged):
1. **Daily games** for streak
2. **Weekly tournament** participation
3. **Regular purchases** for points
4. **Leaderboard** climbing
5. **VIP tier** access
6. **Exclusive releases** first

---

**💡 Pro Tip:** The more you engage (shop + play), the faster you climb ranks and unlock bigger rewards!

