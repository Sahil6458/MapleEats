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

  // Add item to cart
  const addToCart = (product: Product, quantity: number, customization?: ProductCustomization) => {
    // Generate a unique ID for the cart item
    const itemId = `${product.id}_${Date.now()}`;
    
    // Calculate the total price for this item
    const totalPrice = product.price * quantity;
    
    const newItem: CartItem = {
      id: itemId,
      productId: product.id,
      name: product.name,
      price: product.price,
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