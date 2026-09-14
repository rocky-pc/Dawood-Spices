/*
# Dawood Spices E-Commerce Schema

## Overview
Creates the full database schema for a Dawood Spices e-commerce website with 5 branches,
categorized spice/mill products, and branch-specific pricing/inventory. This is a
no-auth storefront: all data is public/shared and readable by the anon key.

## New Tables

1. **branches** — The 5 Dawood Spices shop locations
   - id (uuid, PK)
   - name (text) — e.g. "Dawood Spices - Downtown"
   - slug (text, unique) — URL-friendly identifier
   - address (text)
   - phone (text)
   - hours (text)
   - is_active (boolean, default true)
   - created_at (timestamptz)

2. **categories** — Product categories (Whole Spices, Ground Spices, Blends, etc.)
   - id (uuid, PK)
   - name (text)
   - slug (text, unique)
   - icon (text) — lucide icon name
   - sort_order (int, default 0)
   - created_at (timestamptz)

3. **products** — Individual spice/mill products
   - id (uuid, PK)
   - name (text)
   - slug (text, unique)
   - description (text)
   - category_id (uuid, FK → categories)
   - image_url (text)
   - unit (text) — e.g. "100g", "250g", "500g", "1kg"
   - base_price (numeric(10,2)) — default price
   - original_price (numeric(10,2)) — MRP for discount display
   - rating (numeric(2,1)) — 0.0 to 5.0
   - review_count (int, default 0)
   - is_featured (boolean, default false)
   - is_bestseller (boolean, default false)
   - tags (text[]) — e.g. {"organic", "premium"}
   - created_at (timestamptz)

4. **branch_products** — Junction: which products are available at which branch, with branch-specific pricing/stock
   - id (uuid, PK)
   - branch_id (uuid, FK → branches)
   - product_id (uuid, FK → products)
   - price (numeric(10,2)) — branch-specific price
   - stock (int, default 0)
   - is_available (boolean, default true)
   - UNIQUE(branch_id, product_id)

## Security
- RLS enabled on all tables.
- All tables allow anon + authenticated SELECT (public storefront data).
- INSERT/UPDATE/DELETE restricted to authenticated (admin management).
- No user_id columns — this is a single-tenant public storefront.
*/

-- ===================== BRANCHES =====================
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  hours text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_branches" ON branches;
CREATE POLICY "anon_select_branches" ON branches FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_branches" ON branches;
CREATE POLICY "auth_insert_branches" ON branches FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_branches" ON branches;
CREATE POLICY "auth_update_branches" ON branches FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_branches" ON branches;
CREATE POLICY "auth_delete_branches" ON branches FOR DELETE
  TO authenticated USING (true);

-- ===================== CATEGORIES =====================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'Spice',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ===================== PRODUCTS =====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text NOT NULL DEFAULT '',
  unit text NOT NULL DEFAULT '100g',
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  rating numeric(2,1) NOT NULL DEFAULT 4.0,
  review_count int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ===================== BRANCH_PRODUCTS =====================
CREATE TABLE IF NOT EXISTS branch_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  UNIQUE(branch_id, product_id)
);

ALTER TABLE branch_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_branch_products" ON branch_products;
CREATE POLICY "anon_select_branch_products" ON branch_products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_branch_products" ON branch_products;
CREATE POLICY "auth_insert_branch_products" ON branch_products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_branch_products" ON branch_products;
CREATE POLICY "auth_update_branch_products" ON branch_products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_branch_products" ON branch_products;
CREATE POLICY "auth_delete_branch_products" ON branch_products FOR DELETE
  TO authenticated USING (true);

-- ===================== INDEXES =====================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_branch_products_branch ON branch_products(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_products_product ON branch_products(product_id);
CREATE INDEX IF NOT EXISTS idx_branch_products_available ON branch_products(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- ===================== SEED DATA =====================

-- Branches
INSERT INTO branches (name, slug, address, phone, hours) VALUES
('Dawood Spices - Downtown', 'downtown', '123 Main Street, Downtown', '+1 (555) 100-2001', 'Mon-Sun: 8am - 10pm'),
('Dawood Spices - Westside', 'westside', '456 West Avenue, Westside', '+1 (555) 100-2002', 'Mon-Sun: 8am - 10pm'),
('Dawood Spices - Eastside', 'eastside', '789 East Boulevard, Eastside', '+1 (555) 100-2003', 'Mon-Sun: 8am - 10pm'),
('Dawood Spices - Northside', 'northside', '321 North Road, Northside', '+1 (555) 100-2004', 'Mon-Sun: 8am - 10pm'),
('Dawood Spices - Southside', 'southside', '654 South Lane, Southside', '+1 (555) 100-2005', 'Mon-Sun: 8am - 10pm')
ON CONFLICT (slug) DO NOTHING;

-- Categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
('Whole Spices', 'whole-spices', 'Grain', 1),
('Ground Spices', 'ground-spices', 'CircleDot', 2),
('Spice Blends', 'spice-blends', 'Blend', 3),
('Premium Spices', 'premium-spices', 'Crown', 4),
('Milled Products', 'milled-products', 'Wheat', 5),
('Seasonings', 'seasonings', 'Sparkles', 6)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, description, category_id, image_url, unit, base_price, original_price, rating, review_count, is_featured, is_bestseller, tags) VALUES
('Red Chili Powder', 'red-chili-powder', 'Premium ground red chili powder made from sun-dried chilies. Adds bold heat and vibrant color to any dish.', (SELECT id FROM categories WHERE slug='ground-spices'), 'https://images.pexels.com/photos/33440712/pexels-photo-33440712.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '500g', 8.99, 12.99, 4.5, 342, true, true, ARRAY['bestseller','hot']),
('Turmeric Powder', 'turmeric-powder', 'Pure turmeric powder with its golden color and earthy flavor. A staple for curries and wellness.', (SELECT id FROM categories WHERE slug='ground-spices'), 'https://images.pexels.com/photos/6220707/pexels-photo-6220707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '500g', 6.49, 8.99, 4.7, 521, true, true, ARRAY['bestseller','organic']),
('Cinnamon Sticks', 'cinnamon-sticks', 'Aromatic Ceylon cinnamon sticks, perfect for baking, curries, and warm beverages.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/14381804/pexels-photo-14381804.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '200g', 7.99, 10.99, 4.6, 287, true, false, ARRAY['aromatic']),
('Green Cardamom', 'green-cardamom', 'Whole green cardamom pods with intense, sweet aroma. Ideal for chai, desserts, and savory dishes.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/6086300/pexels-photo-6086300.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '100g', 12.99, 16.99, 4.8, 198, true, true, ARRAY['premium','aromatic']),
('Cumin Seeds', 'cumin-seeds', 'Whole cumin seeds with warm, earthy flavor. Essential for tempering and spice blends.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/10487762/pexels-photo-10487762.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '500g', 5.99, 7.99, 4.4, 156, false, true, ARRAY['bestseller']),
('Black Peppercorns', 'black-peppercorns', 'Whole black peppercorns, freshly harvested and sun-dried for maximum pungency.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/37288698/pexels-photo-37288698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '300g', 9.49, 12.99, 4.6, 203, true, false, ARRAY['premium']),
('Cloves', 'cloves', 'Whole dried cloves with intense, sweet-spicy aroma. A little goes a long way.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/6087276/pexels-photo-6087276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '100g', 6.99, 9.49, 4.5, 134, false, false, ARRAY['aromatic']),
('Coriander Powder', 'coriander-powder', 'Freshly ground coriander seeds with citrusy, warm flavor. A curry essential.', (SELECT id FROM categories WHERE slug='ground-spices'), 'https://images.pexels.com/photos/7263626/pexels-photo-7263626.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '500g', 4.99, 6.49, 4.3, 178, false, true, ARRAY['bestseller']),
('Garam Masala', 'garam-masala', 'Signature blend of 12 roasted spices. Adds depth and warmth to any Indian dish.', (SELECT id FROM categories WHERE slug='spice-blends'), 'https://images.pexels.com/photos/8649386/pexels-photo-8649386.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '300g', 10.99, 14.99, 4.9, 412, true, true, ARRAY['bestseller','signature']),
('Star Anise', 'star-anise', 'Whole star anise pods with sweet licorice aroma. Perfect for biryanis and stews.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/39310432/pexels-photo-39310432.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '100g', 8.49, 11.99, 4.5, 97, false, false, ARRAY['aromatic']),
('Mustard Seeds', 'mustard-seeds', 'Whole yellow and black mustard seeds for tempering, pickling, and marinades.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/18346906/pexels-photo-18346906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '400g', 3.99, 5.49, 4.2, 89, false, false, ARRAY[]::text[]),
('Fenugreek Seeds', 'fenugreek-seeds', 'Whole fenugreek seeds with a bitter, nutty flavor. Used in curries and pickles.', (SELECT id FROM categories WHERE slug='whole-spices'), 'https://images.pexels.com/photos/35156984/pexels-photo-35156984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '300g', 4.49, 5.99, 4.3, 76, false, false, ARRAY[]::text[]),
('Saffron Threads', 'saffron-threads', 'Premium grade-A saffron threads. The world''s most precious spice for color and flavor.', (SELECT id FROM categories WHERE slug='premium-spices'), 'https://images.pexels.com/photos/33654800/pexels-photo-33654800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2g', 24.99, 34.99, 4.9, 167, true, true, ARRAY['premium','luxury']),
('Paprika Powder', 'paprika-powder', 'Sweet smoked paprika with rich red color and mild heat. Great for grilling and garnishing.', (SELECT id FROM categories WHERE slug='ground-spices'), 'https://images.pexels.com/photos/33440710/pexels-photo-33440710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '250g', 7.49, 9.99, 4.4, 112, false, false, ARRAY['smoked']),
('Chaat Masala', 'chaat-masala', 'Tangy, salty, spicy blend perfect for street food, fruits, and snacks.', (SELECT id FROM categories WHERE slug='spice-blends'), 'https://images.pexels.com/photos/7925819/pexels-photo-7925819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '200g', 6.99, 9.49, 4.6, 245, false, true, ARRAY['bestseller','tangy']),
('Milled Rice Flour', 'milled-rice-flour', 'Fine stone-milled rice flour, perfect for dosas, idlis, and gluten-free baking.', (SELECT id FROM categories WHERE slug='milled-products'), 'https://images.pexels.com/photos/5336705/pexels-photo-5336705.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1kg', 5.49, 7.49, 4.3, 88, false, false, ARRAY['gluten-free']),
('Milled Chickpea Flour', 'milled-chickpea-flour', 'Stone-milled chickpea flour (besan) for pakoras, sweets, and savory pancakes.', (SELECT id FROM categories WHERE slug='milled-products'), 'https://images.pexels.com/photos/5332494/pexels-photo-5332494.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1kg', 4.99, 6.49, 4.4, 102, false, false, ARRAY['gluten-free']),
('Seasoning Salt', 'seasoning-salt', 'All-purpose seasoning salt with herbs and spices. Enhances any savory dish.', (SELECT id FROM categories WHERE slug='seasonings'), 'https://images.pexels.com/photos/8250269/pexels-photo-8250269.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '300g', 3.49, 4.99, 4.2, 65, false, false, ARRAY[]::text[]),
('Curry Powder', 'curry-powder', 'Classic curry powder blend with turmeric, coriander, cumin, and fenugreek.', (SELECT id FROM categories WHERE slug='spice-blends'), 'https://images.pexels.com/photos/34375933/pexels-photo-34375933.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '300g', 8.99, 11.99, 4.5, 189, true, false, ARRAY['classic']),
('Whole Cloves Premium', 'whole-cloves-premium', 'Hand-selected premium cloves, larger and more aromatic than standard grade.', (SELECT id FROM categories WHERE slug='premium-spices'), 'https://images.pexels.com/photos/12142752/pexels-photo-12142752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '150g', 11.99, 15.99, 4.7, 78, false, false, ARRAY['premium'])
ON CONFLICT (slug) DO NOTHING;

-- Branch Products: make all products available at all branches with slight price variation
INSERT INTO branch_products (branch_id, product_id, price, stock, is_available)
SELECT b.id, p.id, p.base_price, 
  CASE 
    WHEN b.slug = 'downtown' THEN 120
    WHEN b.slug = 'westside' THEN 85
    WHEN b.slug = 'eastside' THEN 95
    WHEN b.slug = 'northside' THEN 75
    WHEN b.slug = 'southside' THEN 110
  END,
  true
FROM branches b
CROSS JOIN products p
ON CONFLICT (branch_id, product_id) DO NOTHING;
