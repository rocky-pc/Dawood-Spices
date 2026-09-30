import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { Branch, CartItem, ProductWithPricing } from '@/types';

interface BranchPricingEntry {
  price: number;
  stock: number;
  is_available: boolean;
}

interface StoreContextValue {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  cart: CartItem[];
  addToCart: (product: ProductWithPricing, quantity?: number) => void;
  getCartQuantity: (productId: string) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setPreferredBranchForItem: (productId: string, branchId: string | null) => void;
  getItemPrice: (productId: string) => number;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isBranchMenuOpen: boolean;
  setIsBranchMenuOpen: (open: boolean) => void;
  branchPricingMap: Record<string, Record<string, BranchPricingEntry>>;
  setBranchPricingMap: (
    map: Record<string, Record<string, BranchPricingEntry>>
  ) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STORAGE_KEY_BRANCH = 'dawood_selected_branch';
const STORAGE_KEY_CART = 'dawood_cart';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [branchPricingMap, setBranchPricingMap] = useState<
    Record<string, Record<string, BranchPricingEntry>>
  >({});

  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY_CART);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        setCart(
          parsed.map((item) =>
            item.preferredBranchId === undefined
              ? { ...item, preferredBranchId: null }
              : item
          )
        );
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (!data || data.length === 0) return;
      setBranches(data);
      const saved = localStorage.getItem(STORAGE_KEY_BRANCH);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Branch;
          const found = data.find((b) => b.id === parsed.id);
          if (found) {
            setSelectedBranchState(found);
            return;
          }
        } catch {
          // ignore
        }
      }
      setSelectedBranchState(data[0]);
    })();
  }, []);

  const setSelectedBranch = useCallback((branch: Branch) => {
    setSelectedBranchState(branch);
    localStorage.setItem(STORAGE_KEY_BRANCH, JSON.stringify(branch));
    setIsBranchMenuOpen(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: ProductWithPricing, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          { product, quantity, preferredBranchId: selectedBranch?.id ?? null },
        ];
      });
    },
    [selectedBranch]
  );

  const getCartQuantity = useCallback(
    (productId: string) => {
      const item = cart.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setPreferredBranchForItem = useCallback(
    (productId: string, branchId: string | null) => {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, preferredBranchId: branchId }
            : item
        )
      );
    },
    []
  );

  const getItemPrice = useCallback(
    (productId: string): number => {
      const item = cart.find((i) => i.product.id === productId);
      if (!item) return 0;
      if (item.preferredBranchId) {
        const bp = branchPricingMap[item.product.id]?.[item.preferredBranchId];
        if (bp) return bp.price;
      }
      return item.product.base_price;
    },
    [cart, branchPricingMap]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price =
      item.preferredBranchId !== null
        ? branchPricingMap[item.product.id]?.[item.preferredBranchId]?.price
        : undefined;
    return sum + item.quantity * (price ?? item.product.base_price);
  }, 0);

  return (
    <StoreContext.Provider
      value={{
        branches,
        selectedBranch,
        setSelectedBranch,
        cart,
        addToCart,
        getCartQuantity,
        removeFromCart,
        updateQuantity,
        clearCart,
        setPreferredBranchForItem,
        getItemPrice,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isBranchMenuOpen,
        setIsBranchMenuOpen,
        branchPricingMap,
        setBranchPricingMap,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
