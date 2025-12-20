-- QR Pay Database Schema for Supabase
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (for user management)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'business_owner', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create business_products junction table
CREATE TABLE IF NOT EXISTS business_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    price_override DECIMAL(10,2) CHECK (price_override >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, product_id)
);

-- Create qr_scans table (for tracking QR code generation and usage)
CREATE TABLE IF NOT EXISTS qr_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    qr_data TEXT, -- Base64 encoded QR code or UPI intent
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, product_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('captured', 'failed', 'pending')),
    upi_transaction_id TEXT,
    provider_reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    price_at_time DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_business_products_business_id ON business_products(business_id);
CREATE INDEX IF NOT EXISTS idx_business_products_product_id ON business_products(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_business_id ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_product_id ON payments(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_business_id ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_business_product ON qr_scans(business_id, product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Businesses: Business owners can manage their businesses
CREATE POLICY "Business owners can manage their businesses" ON businesses
    FOR ALL USING (
        auth.uid() = owner_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Products: Admins can manage all products, business owners can read
CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'business_owner')
        )
    );

-- Business Products: Business owners can manage their business products
CREATE POLICY "Business owners can manage their business products" ON business_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_products.business_id 
            AND businesses.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- QR Scans: Business owners can manage their QR codes
CREATE POLICY "Business owners can manage their QR codes" ON qr_scans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = qr_scans.business_id 
            AND businesses.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Payments: Business owners can view their payments, admins can view all
CREATE POLICY "Business owners can view their payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = payments.business_id 
            AND businesses.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Orders: Business owners can view their orders
CREATE POLICY "Business owners can view their orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = orders.business_id 
            AND businesses.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Order Items: Inherit permissions from orders
CREATE POLICY "Users can view order items for accessible orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            JOIN businesses ON businesses.id = orders.business_id
            WHERE orders.id = order_items.order_id 
            AND (
                businesses.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            )
        )
    );

-- Insert sample data (optional)
-- Uncomment the following lines to insert sample data for testing

/*
-- Sample profile (admin user)
INSERT INTO profiles (id, name, role) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin');

-- Sample businesses
INSERT INTO businesses (id, name, owner_id) VALUES 
    ('10000000-0000-0000-0000-000000000001', 'Coffee Corner', '00000000-0000-0000-0000-000000000001'),
    ('10000000-0000-0000-0000-000000000002', 'Book Store', '00000000-0000-0000-0000-000000000001');

-- Sample products
INSERT INTO products (id, name, base_price) VALUES 
    ('20000000-0000-0000-0000-000000000001', 'Cappuccino', 150.00),
    ('20000000-0000-0000-0000-000000000002', 'Latte', 180.00),
    ('20000000-0000-0000-0000-000000000003', 'Programming Book', 500.00);

-- Sample business-product assignments
INSERT INTO business_products (business_id, product_id, price_override) VALUES 
    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', NULL),
    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 200.00),
    ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 450.00);
*/