import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, ProductCustomization } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, customization?: ProductCustomization) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculate total number of items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Helper function to calculate price adjustments from customizations
  const calculateCustomizationPrice = (basePrice: number, customization?: ProductCustomization): number => {
    if (!customization || !customization.selections) return basePrice;

    let adjustmentTotal = 0;

    // Price adjustment mappings based on our mock data
    const priceAdjustments: { [key: string]: number } = {
      // Wing Sauce options
      'c1-1': 0, 'c1-2': 0, 'c1-3': 0.5, 'c1-4': 0.5,
      // Quantity options (these are multiplicative, not additive)
      'c2-1': 0, 'c2-2': 6.99, 'c2-3': 12.99,
      // Dipping Sauce options
      'c3-1': 0, 'c3-2': 0, 'c3-3': 0.5,
      // Protein Add-ons
      'c4-1': 3.99, 'c4-2': 4.99, 'c4-3': 4.99,
      // Doneness
      'c5-1': 0, 'c5-2': 0, 'c5-3': 0,
      // Extra Toppings (Burgers)
      'c6-1': 1.5, 'c6-2': 2.99, 'c6-3': 2.49, 'c6-4': 1.99, 'c6-5': 1.49,
      // Side options
      'c7-1': 0, 'c7-2': 1.99, 'c7-3': 2.49, 'c7-4': 1.49,
      // Veggie Burger toppings
      'c8-1': 1.99, 'c8-2': 1.49, 'c8-3': 0.99, 'c8-4': 1.49,
      // Veggie sides
      'c9-1': 0, 'c9-2': 0, 'c9-3': 1.99,
      // Pizza sizes
      'c10-1': -3.00, 'c10-2': 0, 'c10-3': 4.00, 'c10-4': 7.00,
      // Crust types
      'c11-1': 0, 'c11-2': 0, 'c11-3': 1.99, 'c11-4': 3.99,
      // Pizza toppings
      'c12-1': 2.99, 'c12-2': 2.49, 'c12-3': 1.99, 'c12-4': 1.99,
      'c12-5': 2.99, 'c12-6': 1.99, 'c12-7': 1.99, 'c12-8': 1.49,
      // Lemonade flavors
      'c13-1': 0, 'c13-2': 0.99, 'c13-3': 0.99, 'c13-4': 0.99,
      // Beverage sizes
      'c14-1': -1.00, 'c14-2': 0, 'c14-3': 1.50,
      'c15-1': -1.00, 'c15-2': 0, 'c15-3': 1.50,
      'c17-1': -1.50, 'c17-2': 0, 'c17-3': 2.00,
      // Coffee add-ons
      'c16-1': 1.50, 'c16-2': 0.75, 'c16-3': 0.75, 'c16-4': 0.60,
      // Milkshake toppings
      'c18-1': 0.99, 'c18-2': 0.50, 'c18-3': 1.49, 'c18-4': 1.99
    };

    Object.entries(customization.selections).forEach(([optionId, selection]) => {
      if (typeof selection === 'string') {
        // Single selection
        adjustmentTotal += priceAdjustments[selection] || 0;
      } else if (Array.isArray(selection)) {
        // Multiple selections
        selection.forEach(selectionId => {
          adjustmentTotal += priceAdjustments[selectionId] || 0;
        });
      }
    });

    return basePrice + adjustmentTotal;
  };

  // Add item to cart
  const addToCart = (product: Product, quantity: number, customization?: ProductCustomization) => {
    // Generate a unique ID for the cart item
    const itemId = `${product.id}_${Date.now()}`;
    
    // Calculate the price per item including customizations
    const pricePerItem = calculateCustomizationPrice(product.price, customization);
    const totalPrice = pricePerItem * quantity;
    
    const newItem: CartItem = {
      id: itemId,
      productId: product.id,
      name: product.name,
      price: pricePerItem, // Store the adjusted price per item
      quantity,
      customization,
      totalPrice
    };
    
    setItems(prevItems => [...prevItems, newItem]);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.price * quantity
          };
        }
        return item;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};