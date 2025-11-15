'use client';

import { useState } from 'react';
import { Button, Card } from '@gemcart/ui';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

  const handleSubmit = async (isBulk: boolean) => {
    setLoading(true);
    setResult(null);

    try {
      const endpoint = isBulk 
        ? '/api/admin/products/bulk'
        : '/api/admin/products';

      let payload;
      if (isBulk) {
        // For bulk, wrap in products array if not already
        const parsed = JSON.parse(jsonInput);
        payload = Array.isArray(parsed.products) ? parsed : { products: Array.isArray(parsed) ? parsed : [parsed] };
      } else {
        payload = JSON.parse(jsonInput);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || 'Product(s) processed successfully',
          data: data.product || data.results,
        });
        setJsonInput(''); // Clear on success
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to process product(s)',
          data: data.details,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to parse JSON',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = () => {
    const template = {
      name: "Lagos Street Hoodie",
      slug: "lagos-street-hoodie",
      description: "Cozy fleece hoodie for cool nights with Lagos skyline print",
      priceNGN: 1950000,
      gender: "men",
      category: "tops",
      imageUrl: "https://res.cloudinary.com/your-cloud/image/upload/v123/hoodie-main.jpg",
      images: [
        "https://res.cloudinary.com/your-cloud/image/upload/v123/hoodie-1.jpg",
        "https://res.cloudinary.com/your-cloud/image/upload/v123/hoodie-2.jpg"
      ],
      sizes: ["M", "L", "XL"],
      colors: ["black", "grey"],
      tags: ["hoodie", "streetwear", "lagos"],
      featured: true,
      inStock: true,
      stockCount: 50,
      sku: "LAG-HOOD-BLK-M",
      brand: "Zuka",
      material: "100% Cotton, Fleece lining",
      careInstructions: "Machine wash cold, tumble dry low"
    };
    setJsonInput(JSON.stringify(template, null, 2));
  };

  const loadBulkTemplate = () => {
    const template = {
      products: [
        {
          name: "Product 1",
          slug: "product-1",
          priceNGN: 100000,
          gender: "men",
          category: "tops",
          imageUrl: "https://example.com/image1.jpg"
        },
        {
          name: "Product 2",
          slug: "product-2",
          priceNGN: 200000,
          gender: "women",
          category: "dresses",
          imageUrl: "https://example.com/image2.jpg"
        }
      ]
    };
    setJsonInput(JSON.stringify(template, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Add or update products using JSON format</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <Button onClick={loadTemplate} variant="secondary" size="sm">
              Load Single Template
            </Button>
            <Button onClick={loadBulkTemplate} variant="secondary" size="sm">
              Load Bulk Template
            </Button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product JSON
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your product JSON here...'
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleSubmit(false)}
              disabled={loading || !jsonInput.trim()}
              className="bg-brand-purple text-white hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Add/Update Product
                </>
              )}
            </Button>

            <Button
              onClick={() => handleSubmit(true)}
              disabled={loading || !jsonInput.trim()}
              variant="secondary"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Add/Update
                </>
              )}
            </Button>
          </div>
        </Card>

        {result && (
          <Card className={`p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.message}
                </p>
                {result.data && (
                  <pre className="mt-2 text-xs overflow-auto bg-white p-3 rounded border">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h2 className="font-semibold text-blue-900 mb-2">Quick Reference</h2>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Required fields: name, slug, priceNGN, gender, category</li>
            <li>Gender: &quot;men&quot;, &quot;women&quot;, &quot;kids&quot;, &quot;unisex&quot;</li>
            <li>Categories: tops, dresses, shoes, trousers, jewellery, activewear, swimwear, lingerie, beauty, bags, outerwear, traditional</li>
            <li>Slug must be unique and URL-friendly (lowercase, hyphens)</li>
            <li>Price in NGN (in kobo: 1950000 = ₦19,500)</li>
            <li>See PRODUCT_MANAGEMENT.md for full documentation</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

