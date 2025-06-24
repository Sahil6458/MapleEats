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