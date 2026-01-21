# Deployment Guide for Zuka Ecommerce

## Overview
This guide covers deploying your Next.js ecommerce application to production.

## Prerequisites
- Domain name (e.g., `zuka.ng` or `shop.zuka.ng`)
- Database (PostgreSQL - Neon, Supabase, or Railway recommended)
- Image storage service (Cloudinary, AWS S3, or Vercel Blob recommended)
- Environment variables configured

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Built for Next.js (made by Next.js creators)
- Automatic deployments from Git
- Free SSL certificates
- Edge functions support
- Global CDN
- Free tier available

**Steps:**

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard → Project Settings → Environment Variables, add:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   PAYSTACK_SECRET_KEY=your-paystack-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name (if using Cloudinary)
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `zuka.ng`)
   - Follow DNS instructions:
     - Add A record: `@` → `76.76.21.21`
     - Add CNAME: `www` → `cname.vercel-dns.com`
   - Wait for DNS propagation (5-30 minutes)

**Cost:** Free tier includes:
- 100GB bandwidth/month
- Unlimited requests
- Automatic SSL
- Custom domains

---

### Option 2: Railway

**Why Railway?**
- Simple deployment
- Built-in PostgreSQL database
- Good for full-stack apps
- Pay-as-you-go pricing

**Steps:**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL`
6. Add environment variables in project settings
7. Deploy!

**Cost:** ~$5-20/month depending on usage

---

### Option 3: AWS/Google Cloud/Azure

**For enterprise-scale deployments:**

- Use AWS Amplify, Google Cloud Run, or Azure Static Web Apps
- More complex setup but more control
- Better for high-traffic applications

---

## Database Setup

### Recommended: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create account
3. Create new project
4. Copy connection string
5. Use in `DATABASE_URL`

**Free tier:** 0.5GB storage, good for development

### Alternative: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings → Database
4. Use in `DATABASE_URL`

**Free tier:** 500MB database, good for small apps

---

## Image Storage Setup

### Option 1: Cloudinary (Recommended)

**Why Cloudinary?**
- Free tier: 25GB storage, 25GB bandwidth/month
- Automatic image optimization
- CDN included
- Easy to use

**Setup:**

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add to environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Upload images via:
   - Cloudinary dashboard
   - API (we'll create upload endpoint)
   - Or use URLs directly in JSON

**Usage in JSON:**
```json
{
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/product.jpg",
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v123/product-1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v123/product-2.jpg"
  ]
}
```

### Option 2: AWS S3

1. Create S3 bucket
2. Set up IAM user with S3 access
3. Get access keys
4. Use AWS SDK to upload images
5. More complex but more control

### Option 3: Vercel Blob

- If deploying on Vercel
- Built-in storage
- Simple API
- Pay-as-you-go

---

## Environment Variables

Create `.env.production` file (or set in deployment platform):

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.com

# Payments
PAYSTACK_SECRET_KEY=sk_live_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_...
FEATURE_FLUTTERWAVE=false

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics (optional)
POSTHOG_KEY=your-posthog-key

# Email (optional)
RESEND_API_KEY=re_...

# Push Notifications (optional)
PUSH_PUBLIC_KEY=...
PUSH_PRIVATE_KEY=...
PUSH_APP_ID=...
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Database Migrations

After deploying, run migrations:

```bash
# Install dependencies
pnpm install

# Run migrations
cd packages/db
pnpm drizzle-kit push
# or
pnpm drizzle-kit migrate
```

Or use Drizzle Studio:
```bash
pnpm drizzle-kit studio
```

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Custom domain connected and SSL active
- [ ] Test product creation via API
- [ ] Test checkout flow
- [ ] Test image uploads
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)
- [ ] Configure backups for database
- [ ] Set up error tracking

---

## Domain Setup

**You only need a domain to publish!** Here's how:

1. **Buy domain** from:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Any registrar

2. **Configure DNS** (for Vercel example):
   - Add A record: `@` → `76.76.21.21`
   - Add CNAME: `www` → `cname.vercel-dns.com`
   - Wait 5-30 minutes for propagation

3. **Add domain in Vercel:**
   - Project Settings → Domains
   - Add your domain
   - Vercel automatically provisions SSL certificate

4. **Done!** Your app is live at your domain

---

## Monitoring & Analytics

### Vercel Analytics
- Built-in with Vercel
- Enable in Project Settings

### Sentry (Error Tracking)
1. Sign up at [sentry.io](https://sentry.io)
2. Create Next.js project
3. Add `SENTRY_DSN` to env vars
4. Install: `pnpm add @sentry/nextjs`

### PostHog (Product Analytics)
- Already configured in codebase
- Add `POSTHOG_KEY` to env vars

---

## Scaling Considerations

- **Database:** Upgrade Neon/Supabase plan as needed
- **Images:** Cloudinary free tier → paid as you grow
- **CDN:** Vercel includes global CDN
- **Caching:** Next.js automatic caching + Vercel Edge Cache

---

## Support

For issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify environment variables
4. Check Next.js build logs

---

## Quick Start Summary

**Easiest path to production:**

1. Push code to GitHub
2. Deploy on Vercel (connect GitHub repo)
3. Set up Neon database (free tier)
4. Set up Cloudinary (free tier)
5. Add environment variables
6. Buy domain and connect
7. **Done!** 🎉

**Total cost:** ~$10-15/year (just domain) + optional database/image upgrades as you grow.

