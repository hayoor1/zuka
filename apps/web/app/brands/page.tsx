'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Button } from '@gemcart/ui';
import { listBrandStats } from '../../lib/catalog';
import { Search } from 'lucide-react';
import { Navbar } from '../../components/Navbar';

export default function BrandsPage() {
  const [query, setQuery] = useState('');
  const brands = useMemo(() => listBrandStats(), []);
  const filtered = brands.filter((brand) =>
    brand.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Badge className="bg-brand-gold-gradient text-brand-purple border-0 mb-4 text-xs uppercase tracking-[0.4em]">
              Brand Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl font-semibold text-brand-purple tracking-tight mb-3">
              Shop by Brand
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Browse every label on Zuka and jump straight into a brand edit.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white text-sm"
              />
            </div>
            <Link href="/shop">
              <Button className="bg-brand-gradient text-white hover:opacity-90">
                Shop all products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((brand) => (
              <Link key={brand.name} href={`/shop?brand=${encodeURIComponent(brand.name)}`}>
                <div className="brand-card border border-white/70 p-4 flex items-center gap-3 hover:shadow-lg transition-all">
                  <div className="h-12 w-12 rounded-full bg-brand-gradient text-white flex items-center justify-center font-semibold text-lg">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-purple">{brand.name}</p>
                    <p className="text-xs text-gray-500">{brand.count} styles</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No brands found. Try another search.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
