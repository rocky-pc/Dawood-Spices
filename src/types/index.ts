export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  hours: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  image_url: string;
  unit: string;
  base_price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  tags: string[];
}

export interface BranchProduct {
  id: string;
  branch_id: string;
  product_id: string;
  price: number;
  stock: number;
  is_available: boolean;
}

export interface ProductWithPricing extends Product {
  branch_price: number | null;
  branch_stock: number | null;
  is_available_at_branch: boolean;
}

export interface CartItem {
  product: ProductWithPricing;
  quantity: number;
}
