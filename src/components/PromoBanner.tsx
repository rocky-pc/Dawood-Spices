import { Flame, ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  onShopNow: () => void;
}

export function PromoBanner({ onShopNow }: PromoBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Promo 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 mb-3">
              <Flame size={12} className="text-amber-200" />
              <span className="text-xs font-medium text-white">Limited Time</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Up to 30% Off
            </h3>
            <p className="text-sm text-orange-100 mb-4">
              Premium saffron & whole spices
            </p>
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-orange-700 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors"
            >
              Shop Deals
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Promo 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 mb-3">
              <span className="text-xs font-medium text-white">New Arrivals</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Fresh Milled Flours
            </h3>
            <p className="text-sm text-amber-100 mb-4">
              Stone-milled rice & chickpea flour
            </p>
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-amber-800 text-sm font-semibold rounded-lg hover:bg-amber-50 transition-colors"
            >
              Explore
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
