-- MapleEats Database Schema for Supabase

-- Enable RLS (Row Level Security)
-- This ensures users can only access their own data

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  customer_details JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  pricing JSONB NOT NULL,
  restaurant_info JSONB,
  estimated_delivery_time TEXT NOT NULL,
  tracking JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- You can run this after setting up authentication

-- INSERT INTO users (id, phone, name, email) VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', '+1234567890', 'John Doe', 'john@example.com');

-- INSERT INTO orders (user_id, order_number, status, items, customer_details, delivery_address, pricing, estimated_delivery_time) VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', 'ME123456789', 'preparing', 
--    '[{"id": "1", "name": "Burger", "quantity": 2, "price": 12.99}]',
--    '{"name": "John Doe", "phone": "+1234567890", "email": "john@example.com"}',
--    '{"address": "123 Main St", "city": "Toronto", "pincode": "M5V 3A8"}',
--    '{"subtotal": 25.98, "tax": 3.38, "deliveryFee": 2.99, "fees": 1.99, "total": 34.34}',
--    '25-35 min');

-- Notes for Supabase setup:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Run this script to create the tables and policies
-- 4. Enable phone authentication in Authentication > Settings
-- 5. Add your environment variables to your .env file:
--    VITE_SUPABASE_URL=your_project_url
--    VITE_SUPABASE_ANON_KEY=your_anon_key 