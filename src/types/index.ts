// Type definitions for the delivery menu component

// Category interface - matches API response structure
export interface Category {
  id: number;
  restaurant: number;
  address: number;
  name: string;
  description: string;
  image: string | null;
  // Optional UI fields
  slug?: string;
  parentId?: string;
  subcategories?: Category[];
  featured?: boolean;
  sortOrder?: number;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  thumbnailUrl?: string;
  categoryId: string;
  available: boolean;
  hasCustomization: boolean;
  tags?: string[];
  nutritionalInfo?: {
    calories?: number;
    allergens?: string[];
    [key: string]: any;
  };
  featured?: boolean;
  sortOrder?: number;
}

// Variant interface
export interface Variant {
  id: string;
  name: string;
  required: boolean;
  multiSelect: false;
  maxSelections: 1;
  options: VariantOption[];
}

// Variant Option interface
export interface VariantOption {
  id: string;
  name: string;
  priceAdjustment: number;
  default?: boolean;
}

// Modifier interface
export interface Modifier {
  id: string;
  name: string;
  required: boolean;
  multiSelect: true;
  minSelections?: number;
  maxSelections?: number;
  options: ModifierOption[];
}

// Modifier Option interface
export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
  default?: boolean;
  maxQuantity?: number;
}

// Combined type for variants and modifiers
export type CustomizationOption = Variant | Modifier;

// Product customization selections
export interface ProductCustomization {
  productId: string;
  selections: {
    [optionId: string]: string | string[] | { [optionId: string]: number };
  };
  specialInstructions?: string;
}

// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: ProductCustomization;
  totalPrice: number;
}

// Order status types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: Date;
  estimatedDeliveryTime: string;
  items: CartItem[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    deliveryInstructions?: string;
  };
  deliveryAddress: {
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    fees: number;
    total: number;
  };
  restaurant?: {
    id: string;
    name: string;
  };
  tracking?: {
    orderPlaced?: Date;
    confirmed?: Date;
    preparing?: Date;
    ready?: Date;
    outForDelivery?: Date;
    delivered?: Date;
  };
}

// Theme interface for vendor customization
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  borderRadius: string;
  fontFamily: string;
}