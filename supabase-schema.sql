-- ========================================
-- PRODUCTS
-- ========================================

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT
);

-- ========================================
-- ORDERS
-- ========================================

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT,
  customer_name VARCHAR(255) NOT NULL,
  note TEXT,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- ORDER ITEMS
-- ========================================

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- ========================================
-- ADMINS
-- Used with Supabase Auth
-- Stores emails allowed to access dashboard
-- ========================================

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);