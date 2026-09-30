import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { ProductWithPricing, Category } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';

interface ProductGridProps {
  products: ProductWithPricing[];
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
  searchQuery: string;
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating';

export function ProductGrid({
  products,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
}: ProductGridProps) {
  const [sort, setSort] = useState<SortOption>('relevance');
  const [quickViewProduct, setQuickViewProduct] =
    useState<ProductWithPricing | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const sorted = useMemo(() => {
    const result = [...products];
    switch (sort) {
      case 'price-low':
        return result.sort(
          (a, b) =>
            (a.branch_price ?? a.base_price) - (b.branch_price ?? b.base_price)
        );
      case 'price-high':
        return result.sort(
          (a, b) =>
            (b.branch_price ?? b.base_price) - (a.branch_price ?? a.base_price)
        );
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      default:
        return result.sort((a, b) => {
          if (a.is_bestseller && !b.is_bestseller) return -1;
          if (!a.is_bestseller && b.is_bestseller) return 1;
          return b.review_count - a.review_count;
        });
    }
  }, [products, sort]);

  const activeCat = categories.find((c) => c.slug === activeCategory);

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCat
                ? activeCat.name
                : 'All Products'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {sorted.length} {sorted.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-amber-400"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-44 bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === null
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowFilters(false)}
            />
            <div className="relative w-72 bg-white h-full p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    activeCategory === null
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.slug);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      activeCategory === cat.slug
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {sorted.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-sm text-gray-500">
                Try a different search or category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {sorted.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>
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
