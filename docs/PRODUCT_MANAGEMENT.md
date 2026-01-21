# Product Management Guide

## Overview
This guide explains how to add and manage products in your Zuka e-commerce store.

## Quick Start

### 1. Prepare Your Product Data

**Example Product JSON:**
```json
{
  "name": "Lagos Street Hoodie",
  "slug": "lagos-street-hoodie",
  "description": "Cozy fleece hoodie for cool nights with Lagos skyline print",
  "priceNGN": 1950000,
  "gender": "men",
  "category": "hoodies",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/hoodie-main.jpg",
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v123/hoodie-1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v123/hoodie-2.jpg"
  ],
  "sizes": ["M", "L", "XL"],
  "colors": ["black", "grey"],
  "tags": ["hoodie", "streetwear", "lagos"],
  "featured": true,
  "inStock": true,
  "stockCount": 50,
  "sku": "LAG-HOOD-BLK-M",
  "brand": "Zuka"
}
```

### 2. Upload Images

**Option A: Cloudinary (Recommended)**
1. Go to Cloudinary dashboard
2. Upload images
3. Copy the image URLs
4. Use in your JSON

**Option B: Direct URLs**
- Use any publicly accessible image URL
- Ensure images are optimized (use Cloudinary for automatic optimization)

### 3. Submit Product Data

**Single Product:**
```bash
curl -X POST https://your-domain.com/api/admin/products \
  -H "Content-Type: application/json" \
  -d @product.json
```

**Bulk Products:**
```bash
curl -X POST https://your-domain.com/api/admin/products/bulk \
  -H "Content-Type: application/json" \
  -d @products-bulk.json
```

Where `products-bulk.json` contains:
```json
{
  "products": [
    { /* product 1 */ },
    { /* product 2 */ },
    { /* product 3 */ }
  ]
}
```

## Data Model

### Required Fields
- `name`: Product name
- `slug`: URL-friendly identifier (unique)
- `priceNGN`: Price in Nigerian Naira (in kobo)
- `gender`: `"men" | "women" | "kids" | "unisex"`
- `category`: One of the valid categories

### Optional Fields
- `description`: Product description
- `imageUrl`: Primary image URL
- `images`: Array of additional image URLs
- `sizes`: Array of available sizes
- `colors`: Array of available colors
- `tags`: Array of tags for search
- `featured`: Boolean (default: false)
- `inStock`: Boolean (default: true)
- `stockCount`: Number of items in stock
- `sku`: Stock Keeping Unit
- `brand`: Brand name
- `salePriceNGN`: Sale price if on discount
- `discountPercent`: Discount percentage (0-100)
- `material`: Material description
- `careInstructions`: Care instructions
- `weight`: Weight in grams
- `dimensions`: Object with length, width, height, unit

## Categories

Valid categories:
- `tshirts`
- `hoodies`
- `trousers`
- `pants`
- `skirts`
- `dresses`
- `shoes`
- `bags`
- `jewellery`
- `rings`
- `activewear`
- `swimwear`
- `lingerie`
- `beauty`
- `outerwear`
- `nativewear`

## Gender Categories

- `men`: Men's products
- `women`: Women's products
- `kids`: Kids' products
- `unisex`: Unisex products

## How Products Appear

Products automatically appear in:
1. **Shop page** filtered by gender/category
2. **Homepage** featured sections (if `featured: true`)
3. **Search results** based on name, description, tags
4. **Category pages** based on category field
5. **Gender-specific pages** based on gender field

## Example: Adding a Women's Dress

```json
{
  "name": "Ankara Fusion Dress",
  "slug": "ankara-fusion-dress",
  "description": "Modern silhouette with Ankara accents",
  "priceNGN": 2850000,
  "salePriceNGN": 2200000,
  "discountPercent": 23,
  "gender": "women",
  "category": "dresses",
  "imageUrl": "https://res.cloudinary.com/zuka/image/upload/v123/dress-main.jpg",
  "images": [
    "https://res.cloudinary.com/zuka/image/upload/v123/dress-1.jpg",
    "https://res.cloudinary.com/zuka/image/upload/v123/dress-2.jpg"
  ],
  "sizes": ["S", "M", "L"],
  "colors": ["multi"],
  "tags": ["dress", "ankara", "traditional"],
  "featured": true,
  "inStock": true,
  "stockCount": 30,
  "sku": "ANK-DRS-MULT-S",
  "brand": "Zuka",
  "material": "Ankara fabric, Cotton blend"
}
```

This product will:
- Appear in `/shop?gender=women`
- Appear in `/shop?category=dresses`
- Appear in `/shop?gender=women&category=dresses`
- Show on homepage if featured
- Be searchable by name, tags, description

## Updating Products

To update a product, submit the same JSON with the same `slug`. The API will:
- Update existing product if slug exists
- Create new product if slug doesn't exist

## Image Best Practices

1. **Use Cloudinary** for automatic optimization
2. **Image URLs** should be publicly accessible
3. **Primary image** (`imageUrl`) is used in product cards
4. **Additional images** (`images` array) shown in product detail page
5. **Recommended size:** 1200x1200px for product images
6. **Format:** JPEG or WebP

## API Endpoints

### Create/Update Single Product
```
POST /api/admin/products
Content-Type: application/json

{ /* product JSON */ }
```

### Bulk Create/Update
```
POST /api/admin/products/bulk
Content-Type: application/json

{
  "products": [ /* array of products */ ]
}
```

### Get Product by Slug
```
GET /api/admin/products?slug=product-slug
```

### Get All Products
```
GET /api/admin/products
```

## Security Note

**Important:** The admin API endpoints currently don't have authentication. Before deploying to production:

1. Add authentication middleware
2. Use NextAuth or similar
3. Protect routes with admin role check
4. Consider using API keys or JWT tokens

Example authentication check (to add in route handlers):
```typescript
// Check if user is authenticated and is admin
const session = await getServerSession();
if (!session || !session.user?.isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Testing

Test locally:
```bash
# Start dev server
pnpm dev

# In another terminal, test API
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "priceNGN": 100000,
    "gender": "men",
    "category": "tshirts"
  }'
```

## Troubleshooting

**Product not appearing?**
- Check gender and category match filter
- Verify `inStock` is true
- Check slug is unique
- Verify database connection

**Images not loading?**
- Ensure image URLs are publicly accessible
- Check CORS settings if using external CDN
- Verify image URLs are correct

**Validation errors?**
- Check required fields are present
- Verify slug format (lowercase, hyphens only)
- Ensure gender/category are valid values
- Check price is positive integer

