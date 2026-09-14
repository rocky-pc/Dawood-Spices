import { Star, Plus, Minus, Flame } from 'lucide-react';
import type { ProductWithPricing } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: ProductWithPricing;
  onQuickView: (product: ProductWithPricing) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, getCartQuantity, updateQuantity } = useStore();
  const cartQty = getCartQuantity(product.id);

  const price = product.branch_price ?? product.base_price;
  const hasDiscount =
    product.original_price && product.original_price > price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.original_price! - price) / product.original_price!) * 100
      )
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div
        className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_bestseller && (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded">
              BESTSELLER
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        {product.tags.includes('premium') && (
          <div className="absolute top-2 right-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
              <Flame size={14} className="text-amber-700" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3
          className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-amber-700 transition-colors"
          onClick={() => onQuickView(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-green-600 text-green-600" />
            <span className="text-xs font-medium text-gray-700">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            ({product.review_count})
          </span>
        </div>

        {/* Unit */}
        <p className="text-xs text-gray-500 mb-2">{product.unit}</p>

        {/* Price + Add/Stepper */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.original_price!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {cartQty > 0 ? (
            <div className="flex items-center gap-1.5 bg-amber-50 rounded-lg p-0.5 border border-amber-200 shrink-0 whitespace-nowrap">
              <button
                onClick={() => updateQuantity(product.id, cartQty - 1)}
                disabled={!product.is_available_at_branch}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-amber-700 hover:bg-amber-100 transition-colors shadow-sm disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[28px] text-center text-sm font-bold text-amber-900 tabular-nums">
                {cartQty}
              </span>
              <button
                onClick={() => addToCart(product, 1)}
                disabled={!product.is_available_at_branch}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={!product.is_available_at_branch}
              className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              aria-label="Add to cart"
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        {!product.is_available_at_branch && (
          <p className="text-xs text-red-500 mt-1">Out of stock at this branch</p>
        )}
      </div>
    </div>
  );
}
