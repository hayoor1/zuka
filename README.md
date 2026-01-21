# Zuka - Luxury E-Commerce Platform

> 🎨 **Purple & Gold themed e-commerce platform with gamification** - A modern Next.js shopping experience for fashion & lifestyle products in Nigeria.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation & Running

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce

# Install dependencies
cd apps/web
pnpm install

# Start development server
pnpm dev
```

Visit **http://localhost:3000** 🎉

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
ecommerce/
├── apps/
│   ├── web/              # Main Next.js web application
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities & mock data
│   └── mobile/           # React Native mobile app
├── packages/
│   ├── core/             # Shared types & utilities
│   ├── db/               # Database schema (Drizzle ORM)
│   ├── ui/               # Shared UI components
│   ├── payments/         # Paystack integration
│   ├── analytics/        # Analytics utilities
│   ├── realtime/         # Realtime features
│   └── ai/               # AI pet assistant logic
├── README.md             # This file
├── DEPLOYMENT.md         # Deployment guide
└── ...                   # Other documentation
```

## ✨ Features

### 🛍️ E-Commerce Core
- **Product Catalog** - 30+ pre-loaded products with filters
- **Shopping Cart** - Add/remove items with quantity controls
- **Product Details** - Rich product pages with images & specs
- **Categories** - Women, Men, Kids, Traditional, Activewear, Beauty, Bags, Shoes
- **Search & Filters** - By gender, category, price range
- **Wishlist** - Save favorite items

### 🎮 Gamification System
- **5 Games:**
  - Snake Classic (500 pts max)
  - Block Stacker/Tetris (750 pts max)
  - Memory Match (200 pts max)
  - Naija Trivia (600 pts max)
  - Spin & Win (1000 pts max)
- **Daily Streaks** - Bonus multipliers
- **Leaderboards** - Global rankings
- **Weekly Tournaments** - ₦100k prize pool

### 🎁 Rewards & Loyalty
- **Points System** - 1 point per ₦100 spent
- **Redemption Tiers:**
  - 500 pts → ₦5,000 OFF
  - 1000 pts → ₦12,000 OFF
  - 2000 pts → ₦30,000 OFF
  - 5000 pts → VIP Access + ₦100,000 OFF
- **Active Coupons** - Welcome discounts, birthday specials
- **Member Benefits** - Early access, exclusive drops

### 🎨 Design System
- **Theme:** Purple (#570a70) & Gold (#e49b09) with Pink accents (#e246a4)
- **Tone Variations:**
  - Feminine: Pink/Rose gradients
  - Masculine: Dark purple/obsidian
  - Neutral: White/cream with gold accents
- **Animations:** Staggered entrances, count-ups, icon bounces
- **Responsive:** Mobile-first design

## 🗂️ Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, categories, featured products |
| `/shop` | Product catalog with filters |
| `/shop/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form with Paystack |
| `/games` | Games hub |
| `/games/snake` | Snake game |
| `/games/tetris` | Tetris game |
| `/games/memory` | Memory match game |
| `/games/quiz` | Trivia quiz |
| `/rewards` | Rewards & loyalty hub |
| `/rewards/spin` | Spin & win |
| `/leaderboard` | Global rankings |
| `/ranks` | User ranks & achievements |
| `/wishlist` | Saved products |
| `/pet` | AI pet assistant |
| `/profile` | User profile |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - **Root Directory:** `apps/web`
     - **Framework:** Next.js (auto-detected)
     - **Build Command:** `cd ../.. && pnpm install && pnpm build --filter=@zuka/web`
   - Click Deploy

3. **Add Custom Domain** (optional)
   - Buy domain from Namecheap/GoDaddy
   - Add in Vercel → Settings → Domains
   - Configure DNS records

**Cost:** Free tier available, ~$10-15/year for domain

### No Database Required (Initially)

The app works without a database using mock data:
- ✅ All product browsing
- ✅ Cart functionality (localStorage)
- ✅ Games
- ✅ Rewards display

**To add database later:**
1. Sign up for [Neon](https://neon.tech) (free tier)
2. Copy connection string
3. Add to Vercel: `DATABASE_URL=postgresql://...`
4. Run migrations: `pnpm --filter=@zuka/db drizzle-kit push`
5. Redeploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter

# Database (when connected)
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Drizzle Studio
pnpm db:generate  # Generate migrations
```

### Environment Variables

Create `.env.local` in `apps/web/`:

```bash
# Optional - works without these initially
DATABASE_URL="postgresql://..."
PAYSTACK_SECRET_KEY="sk_..."
PAYSTACK_PUBLIC_KEY="pk_..."
NEXT_PUBLIC_API_URL="https://your-domain.com"
```

### Adding Products

Three methods:

**1. Via Admin UI** (Easiest)
- Navigate to `/admin/products`
- Paste JSON or use templates
- Click "Add Product"

**2. Via API**
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d @product.json
```

**3. Edit Mock Data**
- Edit `apps/web/lib/catalog.ts`
- Restart dev server

See [PRODUCT_MANAGEMENT.md](./PRODUCT_MANAGEMENT.md) for templates and examples.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide (Vercel, Railway, database setup) |
| [PRODUCT_MANAGEMENT.md](./PRODUCT_MANAGEMENT.md) | How to add/manage products |
| [USER_JOURNEY.md](./USER_JOURNEY.md) | User flow diagrams & customer journey |
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance optimizations |
| [SCALABILITY.md](./SCALABILITY.md) | Scaling strategies |
| [apps/mobile/README.md](./apps/mobile/README.md) | Mobile app setup guide |

## 🎨 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom components + Radix UI primitives
- **Icons:** Lucide React
- **Animations:** Framer Motion (lazy loaded)

### Backend
- **API Routes:** Next.js API Routes
- **Database:** PostgreSQL (Drizzle ORM)
- **Payments:** Paystack
- **Storage:** Cloudinary (images)

### DevOps
- **Hosting:** Vercel (recommended)
- **Database:** Neon (serverless Postgres)
- **Version Control:** Git/GitHub
- **Package Manager:** pnpm

## 🎮 Gamification Logic

### Points Earning
- **Shopping:** 1 point per ₦100 spent
- **Games:** Up to 1,000 points/day
- **Daily Login:** Streak bonuses
- **Referrals:** Both users get ₦5,000

### Scoring System
Each game has its own scoring logic:
- **Snake:** Points per food item, bonus for length
- **Tetris:** Points per line cleared, combo multipliers
- **Memory:** Points for matches, time bonuses
- **Trivia:** Points per correct answer
- **Spin:** Random rewards (50-1000 pts)

### Leaderboard Rankings
- Updated in real-time (when database connected)
- Weekly tournaments (Monday-Sunday)
- Top 10 get prizes
- Ranked by total points earned

## 🔒 Security Notes

- All payments via Paystack (PCI-compliant)
- SSL/HTTPS enabled by default on Vercel
- No sensitive data in localStorage
- API routes protected (when auth added)
- Environment variables for secrets

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
pnpm dev
```

### Slow Startup
```bash
rm -rf .next node_modules/.cache
pnpm dev
```

### Image Loading Issues
- Using via.placeholder.com (requires internet)
- Replace with Cloudinary URLs in production

### Build Errors
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

## 📈 Performance

- **Lighthouse Score:** 90+ (all metrics)
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Bundle Size:** <200KB (initial)
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic route-based splitting
- **Lazy Loading:** Animations, heavy components

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Private/Commercial - All rights reserved

## 📞 Support

For issues or questions:
1. Check the documentation files above
2. Review [troubleshooting](#-troubleshooting)
3. Open an issue on GitHub

---

**Built with 💜 & ✨ using Next.js** | [View Live Demo](#) | [Report Bug](#) | [Request Feature](#)


