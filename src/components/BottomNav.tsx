import { Home, Search, ShoppingBag, MapPin, Flame } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface BottomNavProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onBranchClick: () => void;
}

export function BottomNav({ onHomeClick, onSearchClick, onBranchClick }: BottomNavProps) {
  const { cartCount, setIsCartOpen, setIsBranchMenuOpen } = useStore();

  return (
    <>
      {/* Spacer to prevent content being hidden behind the bar */}
      <div className="h-16 sm:hidden" aria-hidden="true" />

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-stretch justify-around h-16">
          {/* Home */}
          <button
            onClick={onHomeClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-amber-700"
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Search */}
          <button
            onClick={onSearchClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-amber-700 transition-colors"
          >
            <Search size={20} />
            <span className="text-[10px] font-medium">Search</span>
          </button>

          {/* Branches */}
          <button
            onClick={() => {
              onBranchClick();
              setIsBranchMenuOpen(true);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-amber-700 transition-colors"
          >
            <MapPin size={20} />
            <span className="text-[10px] font-medium">Branch</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-amber-700 transition-colors relative"
          >
            <div className="relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>

          {/* Brand accent */}
          <div className="flex items-center justify-center px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md">
              <Flame size={18} className="text-amber-50" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
