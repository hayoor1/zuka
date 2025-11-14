# 🚀 Quick Launch Guide - Deploy Without Database

## ✅ Ready to Launch!

Your site is **ready to deploy** right now using mock data. No database needed!

## 📋 Quick Steps

### 1. Test Locally First

```bash
cd apps/web
pnpm install
pnpm build
pnpm start
```

Visit `http://localhost:3000` - everything should work!

### 2. Push to GitHub

```bash
git add .
git commit -m "Ready for launch"
git push origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `apps/web`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `cd ../.. && pnpm install && pnpm build --filter=@zuka/web`
   - **Output Directory**: `.next`
5. **Environment Variables**: Leave empty (no database needed!)
6. Click **"Deploy"**

**Done!** Your site will be live in 2-3 minutes at `https://your-project.vercel.app`

### 4. Add Custom Domain (Optional)

1. Buy domain from Namecheap/GoDaddy (~$10-15/year)
2. In Vercel: Settings → Domains → Add your domain
3. Add DNS records (Vercel will show you exactly what to add)
4. Wait 5-30 minutes for DNS propagation
5. **Done!** Your site is live on your domain with HTTPS!

## ✅ What Works Right Now

- ✅ **Homepage** - Beautiful landing page with products
- ✅ **Shop** - Browse all products with filters
- ✅ **Product Pages** - Full product details
- ✅ **Cart** - Add/remove items (stored in browser)
- ✅ **Games** - All game pages
- ✅ **Leaderboard** - Mock leaderboard
- ✅ **Rewards** - Mock rewards display
- ✅ **Pet Assistant** - Mock conversations

## ⚠️ What Needs Database Later

- ❌ User accounts (sign-in/sign-up)
- ❌ Order processing (checkout)
- ❌ Admin panel (add products)
- ❌ Analytics tracking
- ❌ Persistent wishlist

**These will work automatically once you add the database!**

## 🔄 Adding Database Later

When ready:

1. Sign up for [Neon](https://neon.tech) (free tier)
2. Copy connection string
3. Add to Vercel: `DATABASE_URL=postgresql://...`
4. Run migrations: `cd packages/db && pnpm drizzle-kit push`
5. Redeploy - API will automatically use database!

## 💰 Cost

**Launch (Free):**
- Vercel: Free
- Domain: ~$10-15/year
- **Total: ~$10-15/year**

**With Database:**
- Neon: Free tier (up to 500MB)
- **Still ~$10-15/year**

## 📝 Files Updated

- ✅ `apps/web/app/api/products/route.ts` - Now works without database
- ✅ `LAUNCH_WITHOUT_DB.md` - Full deployment guide
- ✅ `vercel.json` - Vercel configuration

## 🎉 You're Ready!

Follow the steps above and you'll be live in under 30 minutes!

