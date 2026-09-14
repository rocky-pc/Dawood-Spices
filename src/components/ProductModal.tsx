import { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, ShoppingCart, Flame, Check } from 'lucide-react';
import type { ProductWithPricing } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductModalProps {
  product: ProductWithPricing;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const price = product.branch_price ?? product.base_price;
  const hasDiscount =
    product.original_price && product.original_price > price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.original_price! - price) / product.original_price!) * 100
      )
    : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 sm:rounded-l-2xl overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
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
          </div>

          {/* Details */}
          <div className="p-5 sm:p-6 flex flex-col">
            {product.tags.includes('premium') && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium w-fit mb-3">
                <Flame size={12} />
                Premium Selection
              </div>
            )}

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={
                      n <= Math.round(product.rating)
                        ? 'fill-green-600 text-green-600'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {product.rating}
              </span>
              <span className="text-sm text-gray-400">
                ({product.review_count} reviews)
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-sm text-gray-700">
                {product.unit}
              </span>
              {product.is_available_at_branch && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Check size={14} />
                  In stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-base text-gray-400 line-through">
                  ${product.original_price!.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm text-green-600 font-medium">
                  Save ${(product.original_price! - price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity + Add */}
            <div className="mt-auto flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-50 text-gray-600"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-gray-800 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-gray-50 text-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                disabled={!product.is_available_at_branch}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
