import { useState, useEffect, useCallback, useRef } from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import type { Branch, Category, Product, ProductWithPricing } from '@/types';
import { Header } from '@/components/Header';
import { BannerCarousel } from '@/components/BannerCarousel';
import { CategoryStrip } from '@/components/CategoryStrip';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { PromoBanner } from '@/components/PromoBanner';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { MobileMenu } from '@/components/MobileMenu';
import { BottomNav } from '@/components/BottomNav';

function StoreFront() {
  const { selectedBranch } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [branchPricing, setBranchPricing] = useState<
    Record<string, { price: number; stock: number; is_available: boolean }>
  >({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      if (cats) setCategories(cats);

      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .order('created_at');
      if (prods) setAllProducts(prods);
    })();
  }, []);

  // Fetch branch-specific pricing when branch changes
  useEffect(() => {
    if (!selectedBranch) return;
    void (async () => {
      const { data } = await supabase
        .from('branch_products')
        .select('*')
        .eq('branch_id', selectedBranch.id);
      if (!data) return;
      const map: Record<string, { price: number; stock: number; is_available: boolean }> = {};
      for (const bp of data) {
        map[bp.product_id] = {
          price: Number(bp.price),
          stock: bp.stock,
          is_available: bp.is_available,
        };
      }
      setBranchPricing(map);
    })();
  }, [selectedBranch]);

  const productsWithPricing: ProductWithPricing[] = allProducts.map((p) => {
    const bp = branchPricing[p.id];
    return {
      ...p,
      base_price: Number(p.base_price),
      original_price: p.original_price ? Number(p.original_price) : null,
      branch_price: bp?.price ?? null,
      branch_stock: bp?.stock ?? null,
      is_available_at_branch: bp?.is_available ?? true,
    };
  });

  const filteredProducts = productsWithPricing.filter((p) => {
    if (activeCategory) {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (!cat || p.category_id !== cat.id) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const scrollToProducts = useCallback(() => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        searchInputRef={searchInputRef}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="flex-1">
        <BannerCarousel onShopNow={scrollToProducts} />
        <CategoryStrip
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <FeaturedProducts
          products={productsWithPricing}
          onShopAll={scrollToProducts}
        />
        <PromoBanner onShopNow={scrollToProducts} />
        <ProductGrid
          products={filteredProducts}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
        />
      </main>

      <Footer />
      <CartDrawer />
      <BottomNav
        onHomeClick={scrollToTop}
        onSearchClick={focusSearch}
        onBranchClick={scrollToTop}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreFront />
    </StoreProvider>
  );
}
