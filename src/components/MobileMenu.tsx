import { X, ChevronRight } from 'lucide-react';
import type { Category } from '@/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  categories,
  activeCategory,
  setActiveCategory,
}: MobileMenuProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed left-0 top-0 bottom-0 z-[56] w-72 bg-white shadow-2xl transition-transform duration-300 flex flex-col lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-amber-900">Browse Categories</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <button
            onClick={() => {
              setActiveCategory(null);
              onClose();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
              activeCategory === null
                ? 'bg-amber-50 text-amber-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Products
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.slug);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-amber-50 text-amber-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name}
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
