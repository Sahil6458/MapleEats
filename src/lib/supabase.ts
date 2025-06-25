import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database types for TypeScript
export interface User {
  id: string
  phone: string
  name?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
  items: any[] // JSON field
  customer_details: any // JSON field
  delivery_address: any // JSON field
  pricing: any // JSON field
  restaurant_info?: any // JSON field
  estimated_delivery_time: string
  created_at: string
  updated_at: string
  tracking?: any // JSON field
} 