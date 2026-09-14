import { Leaf, CircleDot, Blend, Crown, Wheat, Sparkles, type LucideIcon } from 'lucide-react';
import type { Category } from '@/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  CircleDot,
  Blend,
  Crown,
  Wheat,
  Sparkles,
};

interface CategoryStripProps {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
}

export function CategoryStrip({
  categories,
  activeCategory,
  setActiveCategory,
}: CategoryStripProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] ?? Leaf;
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(isActive ? null : cat.slug)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'bg-amber-50 border-amber-300 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-sm'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Icon size={22} />
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  isActive ? 'text-amber-800' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
