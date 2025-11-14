# Launch Guide: Deploy Without Database (Mock Data)

## 🚀 Quick Launch Strategy

You can launch your Zuka e-commerce site **right now** using mock/static data, then connect to a database later. This guide shows you how.

## ✅ Current Status

Your app is already set up to work with mock data via `apps/web/lib/catalog.ts`. The site will work perfectly without a database connection.

## 📋 Pre-Launch Checklist

### 1. **Update API Routes to Use Mock Data**

The API routes currently try to connect to a database. We'll update them to fall back to mock data when `DATABASE_URL` is not set.

### 2. **Environment Variables**

Create `.env.local` (for local) and add to Vercel (for production):

```bash
# Optional - Only needed when you connect database later
# DATABASE_URL=postgresql://...

# Optional - For image uploads (when you add admin features)
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...

# Optional - For payments (when you add checkout)
# PAYSTACK_SECRET_KEY=...
# PAYSTACK_PUBLIC_KEY=...
```

**For now, you don't need any of these!** The site works with mock data.

### 3. **Build & Test Locally**

```bash
cd apps/web
pnpm install
pnpm build
pnpm start
```

Visit `http://localhost:3000` - everything should work!

## 🌐 Deploy to Vercel (Free)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for launch"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (use GitHub)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build` (or `cd ../.. && pnpm build`)
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### Step 3: Environment Variables

**Leave empty for now!** No database needed.

### Step 4: Deploy

Click "Deploy" - your site will be live in 2-3 minutes!

You'll get a URL like: `https://your-project.vercel.app`

## 🔗 Add Custom Domain

### Step 1: Buy Domain

- **Namecheap**: ~$10-15/year
- **GoDaddy**: ~$12-15/year
- **Google Domains**: ~$12/year

### Step 2: Connect in Vercel

1. Go to your project → Settings → Domains
2. Add your domain (e.g., `zuka.ng` or `shopzuka.com`)
3. Vercel will show DNS records to add

### Step 3: Configure DNS

Add these records in your domain provider:

**For root domain (zuka.ng):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www (www.zuka.ng):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Wait

DNS propagation takes 5-30 minutes. Vercel will automatically configure SSL (HTTPS).

## ✅ What Works Without Database

- ✅ **Homepage** - Shows featured products
- ✅ **Shop Page** - Browse all products with filters
- ✅ **Product Details** - View individual products
- ✅ **Cart** - Add/remove items (stored in browser)
- ✅ **Games** - All game pages
- ✅ **Leaderboard** - Mock leaderboard data
- ✅ **Rewards** - Mock rewards display
- ✅ **Pet Assistant** - Mock conversations

## ⚠️ What Doesn't Work (Yet)

- ❌ **User Accounts** - No sign-in/sign-up
- ❌ **Order Processing** - Can't complete purchases
- ❌ **Admin Panel** - Can't add products via UI
- ❌ **Analytics** - No user tracking
- ❌ **Wishlist Persistence** - Lost on refresh

**These features will work once you connect the database!**

## 🔄 Migrating to Database Later

When you're ready to connect the database:

### Step 1: Set Up Database

1. Sign up for [Neon](https://neon.tech) (free tier)
2. Create a new project
3. Copy the connection string

### Step 2: Run Migrations

```bash
cd packages/db
pnpm drizzle-kit push
```

### Step 3: Update Environment Variables

Add to Vercel:
```
DATABASE_URL=postgresql://...
```

### Step 4: Deploy

The API routes will automatically switch to using the database!

## 📊 Current Data Source

Products are loaded from: `apps/web/lib/catalog.ts`

This file contains ~30+ products across all categories. You can edit this file directly to add/remove products before connecting to a database.

## 🎨 Customization Before Launch

### Update Brand Info

Edit these files:
- `apps/web/app/layout.tsx` - Site metadata
- `apps/web/components/Navbar.tsx` - Navigation
- `apps/web/app/page.tsx` - Homepage content

### Add More Products

Edit `apps/web/lib/catalog.ts` - Add products to the `catalog` array.

### Update Colors

Edit `apps/web/tailwind.config.ts` - Brand colors are defined here.

## 🚀 Performance Tips

1. **Images**: Currently using Unsplash (free). Consider:
   - Cloudinary (free tier) for optimization
   - Vercel Image Optimization (built-in)
   - CDN for faster loading

2. **Caching**: Vercel automatically caches static pages

3. **Build Time**: First build takes ~2-3 minutes, subsequent builds are faster

## 💰 Cost Breakdown

**Launch (Free):**
- Vercel: Free (hobby plan)
- Domain: ~$10-15/year
- **Total: ~$10-15/year**

**When You Add Database:**
- Neon: Free tier (up to 500MB)
- **Total: Still ~$10-15/year**

**When You Scale:**
- Neon: ~$19/month (10GB)
- Vercel Pro: ~$20/month (optional)
- **Total: ~$40/month**

## 📝 Next Steps

1. ✅ Test locally: `pnpm build && pnpm start`
2. ✅ Push to GitHub
3. ✅ Deploy to Vercel
4. ✅ Add custom domain
5. ✅ Share your site! 🎉

## 🆘 Troubleshooting

### Build Fails

- Check that `apps/web` is the root directory in Vercel
- Ensure `pnpm` is selected as package manager
- Check build logs in Vercel dashboard

### Images Not Loading

- Unsplash images are free but may be slow
- Consider using Cloudinary for better performance

### Domain Not Working

- Wait 30 minutes for DNS propagation
- Check DNS records are correct
- Vercel will show status in dashboard

## 🎉 You're Ready!

Your site is ready to launch. Follow the steps above and you'll be live in under 30 minutes!

