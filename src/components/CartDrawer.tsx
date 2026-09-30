import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { CartItem } from '@/types';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    branches,
    branchPricingMap,
    setPreferredBranchForItem,
    getItemPrice,
  } = useStore();

  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    setCheckoutMsg('Order placed! You will receive a confirmation shortly.');
    setTimeout(() => {
      setCheckoutMsg(null);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[56] w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-700" />
            <h2 className="text-lg font-bold text-gray-900">
              Cart ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-400">
                Add some spices to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const price = getItemPrice(item.product.id);
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500">{item.product.unit}</p>

                      {/* Preferred shop selector */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="relative">
                          <MapPin
                            size={12}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                          <select
                            value={item.preferredBranchId ?? ''}
                            onChange={(e) =>
                              setPreferredBranchForItem(
                                item.product.id,
                                e.target.value || null
                              )
                            }
                            className="text-xs border border-gray-200 rounded-lg pl-7 pr-6 py-1.5 bg-white text-gray-700 appearance-none"
                          >
                            <option value="">Base Price</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name.replace('Dawood Spices - ', '')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          ${price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-gray-50 text-gray-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-gray-50 text-gray-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            {checkoutMsg ? (
              <div className="text-center py-4 text-green-600 font-medium">
                {checkoutMsg}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-semibold text-green-600">
                    {cartTotal >= 50 ? 'FREE' : '$4.99'}
                  </span>
                </div>
                {cartTotal < 50 && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    Add ${(50 - cartTotal).toFixed(2)} more for free delivery!
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${(cartTotal + (cartTotal >= 50 ? 0 : 4.99)).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Checkout
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
