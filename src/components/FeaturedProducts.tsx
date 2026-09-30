import { Flame, ArrowRight } from 'lucide-react';
import type { ProductWithPricing } from '@/types';
import { ProductCard } from './ProductCard';
import { useState } from 'react';
import { ProductModal } from './ProductModal';

interface FeaturedProductsProps {
  products: ProductWithPricing[];
  onShopAll: () => void;
}

export function FeaturedProducts({ products, onShopAll }: FeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] =
    useState<ProductWithPricing | null>(null);

  const featured = products.filter((p) => p.is_featured).slice(0, 5);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Flame size={18} className="text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-xs text-gray-500">Handpicked for you</p>
          </div>
        </div>
        <button
          onClick={onShopAll}
          className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
