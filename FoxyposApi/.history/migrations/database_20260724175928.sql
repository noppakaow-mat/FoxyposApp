-- ============================================
-- FOXY POS DATABASE SCHEMA
-- ============================================

-- =========================
-- USERS
-- =========================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (
        role IN ('manager','cashier', 'kitchen')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLES
-- =========================

CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (
        status IN (
            'available',
            'occupied',
            'cleaning'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- BUFFET PACKAGES
-- =========================

CREATE TABLE IF NOT EXISTS buffet_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_per_person NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =========================
-- TABLE SESSIONS
-- =========================

CREATE TABLE IF NOT EXISTS table_sessions (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables (id),
    package_id INT REFERENCES buffet_packages (id),
    number_of_guests INT NOT NULL,
    package_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    vat_rate NUMERIC(5, 2) DEFAULT 7,
    vat_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (
        status IN ('active', 'completed')
    ),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- =========================
-- CATEGORIES
-- =========================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- =========================
-- PRODUCTS
-- =========================

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories (id),
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0,
    image_url TEXT,
    is_complimentary BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE
);

-- =========================
-- ORDERS
-- =========================

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    table_session_id INT REFERENCES table_sessions (id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'cooking',
            'served',
            'cancelled'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDER ITEMS
-- =========================

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders (id) ON DELETE CASCADE,
    product_id INT REFERENCES products (id),
    quantity INT NOT NULL,
    price_each NUMERIC(10, 2),
    subtotal NUMERIC(10, 2)
);

-- =========================
-- PAYMENTS
-- =========================

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES table_sessions (id) ON DELETE CASCADE,
    charge_id VARCHAR(100) UNIQUE,
    source_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    method VARCHAR(30) DEFAULT 'promptpay',
    status VARCHAR(30) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS minimum_stock INT DEFAULT 10;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_complimentary BOOLEAN DEFAULT FALSE;

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('manager','cashier','kitchen'));