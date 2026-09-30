import { useState, useEffect, type RefObject } from 'react';
import { Search, ShoppingCart, Menu, X, MapPin, ChevronDown, Flame } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { Category } from '@/types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
  onMobileMenuToggle: () => void;
  searchInputRef: RefObject<HTMLInputElement>;
}

export function Header({
  searchQuery,
  setSearchQuery,
  categories,
  activeCategory,
  setActiveCategory,
  onMobileMenuToggle,
  searchInputRef,
}: HeaderProps) {
  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    cartCount,
    setIsCartOpen,
    isBranchMenuOpen,
    setIsBranchMenuOpen,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm shadow-md'
      }`}
    >
      {/* Top bar */}
      <div className="bg-amber-900 text-amber-50 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Free delivery on orders over $50</span>
            <span className="sm:hidden">Free delivery $50+</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Track Order</span>
            <span className="hidden sm:inline">|</span>
            <span>Help</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-amber-700"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-md">
              <Flame size={22} className="text-amber-50" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-amber-900 leading-tight">
                Dawood Spices
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight">
                Premium Spice Collection
              </p>
            </div>
          </div>

          {/* Branch selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-colors text-left"
            >
              <MapPin size={16} className="text-amber-700 shrink-0" />
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-500 leading-tight">
                  Shopping at
                </p>
                <p className="text-xs font-semibold text-gray-800 leading-tight max-w-[140px] truncate">
                  {selectedBranch?.name.replace('Dawood Spices - ', '') ?? 'Select'}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${
                  isBranchMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isBranchMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsBranchMenuOpen(false)}
                />
                <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-20 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                    <p className="text-sm font-semibold text-amber-900">
                      Select your branch
                    </p>
                    <p className="text-xs text-gray-500">
                      Prices & availability may vary
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {branches.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch)}
                        className={`w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors border-b border-gray-50 last:border-0 ${
                          selectedBranch?.id === branch.id
                            ? 'bg-amber-50'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={16}
                            className={`mt-0.5 shrink-0 ${
                              selectedBranch?.id === branch.id
                                ? 'text-amber-700'
                                : 'text-gray-400'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {branch.name.replace('Dawood Spices - ', '')}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {branch.address}
                            </p>
                            <p className="text-xs text-gray-400">{branch.hours}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for spices, blends, milled products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 border border-transparent focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-amber-700 transition-colors shrink-0"
            aria-label="Cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden lg:block border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === null
                  ? 'text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.slug
                    ? 'text-amber-700 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
