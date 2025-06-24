import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCartCalculation } from '../../hooks/useCartCalculation';
import { ProductCustomization } from '../../types';
import { LocationData } from '../../App';
import Button from '../atoms/Button';
import CheckoutModal from './CheckoutModal';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryLocation: LocationData;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose, deliveryLocation }) => {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Use cart calculation hook - only calculate when cart is open
  const {
    loading: calculationLoading,
    error: calculationError,
    formattedBreakdown,
    recalculate,
    hasSmallOrderFee,
    smallOrderThreshold,
    total,
    estimatedDeliveryTime
  } = useCartCalculation({
    subtotal,
    autoCalculate: isOpen && items.length > 0, // Only auto-calculate when cart is open and has items
    // You can add delivery address and restaurant info here when available
    // deliveryAddress: { ... },
    // restaurantId: "...",
    // addressId: 123
  });

  // Trigger calculation when cart opens with items
  useEffect(() => {
    if (isOpen && items.length > 0 && !formattedBreakdown) {
      recalculate();
    }
  }, [isOpen, items.length]);

  // Helper function to format customization selections for display
  const formatCustomizations = (customization?: ProductCustomization) => {
    if (!customization || !customization.selections) return [];

    const formattedSelections: string[] = [];
    
    // This is a simplified version - in a real app, you'd want to fetch the actual option names
    // from your customization options data. For now, we'll format based on the selection structure.
    Object.entries(customization.selections).forEach(([optionId, selection]) => {
      if (typeof selection === 'string') {
        // Single selection - try to extract meaningful name from ID
        const optionName = getOptionDisplayName(optionId);
        const selectionName = getSelectionDisplayName(selection);
        if (optionName && selectionName) {
          formattedSelections.push(`${optionName}: ${selectionName}`);
        }
      } else if (Array.isArray(selection)) {
        // Multiple selections
        const optionName = getOptionDisplayName(optionId);
        const selectionNames = selection.map(getSelectionDisplayName).filter(Boolean);
        if (optionName && selectionNames.length > 0) {
          formattedSelections.push(`${optionName}: ${selectionNames.join(', ')}`);
        }
      }
    });

    return formattedSelections;
  };

  // Helper to get display name for option (simplified - in real app, fetch from API/store)
  const getOptionDisplayName = (optionId: string): string => {
    // Map option IDs to display names based on our mock data structure
    const optionNames: { [key: string]: string } = {
      'c1': 'Wing Sauce',
      'c2': 'Quantity',
      'c3': 'Dipping Sauce',
      'c4': 'Protein Add-ons',
      'c5': 'Doneness',
      'c6': 'Extra Toppings',
      'c7': 'Side',
      'c8': 'Extra Toppings',
      'c9': 'Side',
      'c10': 'Size',
      'c11': 'Crust Type',
      'c12': 'Extra Toppings',
      'c13': 'Flavor',
      'c14': 'Size',
      'c15': 'Size',
      'c16': 'Add-ons',
      'c17': 'Size',
      'c18': 'Toppings'
    };
    return optionNames[optionId] || optionId;
  };

  // Helper to get display name for selection (simplified - in real app, fetch from API/store)
  const getSelectionDisplayName = (selectionId: string): string => {
    // Map selection IDs to display names based on our mock data structure
    const selectionNames: { [key: string]: string } = {
      // Wing Sauce options
      'c1-1': 'Buffalo', 'c1-2': 'BBQ', 'c1-3': 'Honey Garlic', 'c1-4': 'Extra Hot',
      // Quantity options
      'c2-1': '6 Wings', 'c2-2': '12 Wings', 'c2-3': '24 Wings',
      // Dipping Sauce options
      'c3-1': 'Marinara', 'c3-2': 'Ranch', 'c3-3': 'Garlic Aioli',
      // Protein Add-ons
      'c4-1': 'Grilled Chicken', 'c4-2': 'Ground Beef', 'c4-3': 'Pulled Pork',
      // Doneness
      'c5-1': 'Medium Rare', 'c5-2': 'Medium', 'c5-3': 'Well Done',
      // Extra Toppings (Burgers)
      'c6-1': 'Extra Cheese', 'c6-2': 'Bacon', 'c6-3': 'Avocado', 'c6-4': 'Fried Egg', 'c6-5': 'Mushrooms',
      // Side options
      'c7-1': 'French Fries', 'c7-2': 'Sweet Potato Fries', 'c7-3': 'Onion Rings', 'c7-4': 'Side Salad',
      // Veggie Burger toppings
      'c8-1': 'Extra Avocado', 'c8-2': 'Hummus', 'c8-3': 'Sprouts', 'c8-4': 'Roasted Red Peppers',
      // Veggie sides
      'c9-1': 'Sweet Potato Fries', 'c9-2': 'Side Salad', 'c9-3': 'Fruit Cup',
      // Pizza sizes
      'c10-1': 'Small (10")', 'c10-2': 'Medium (12")', 'c10-3': 'Large (14")', 'c10-4': 'Extra Large (16")',
      // Crust types
      'c11-1': 'Regular Crust', 'c11-2': 'Thin Crust', 'c11-3': 'Thick Crust', 'c11-4': 'Stuffed Crust',
      // Pizza toppings
      'c12-1': 'Extra Cheese', 'c12-2': 'Pepperoni', 'c12-3': 'Mushrooms', 'c12-4': 'Bell Peppers',
      'c12-5': 'Italian Sausage', 'c12-6': 'Olives', 'c12-7': 'Pineapple', 'c12-8': 'Jalapeños',
      // Lemonade flavors
      'c13-1': 'Classic', 'c13-2': 'Strawberry', 'c13-3': 'Raspberry', 'c13-4': 'Mint',
      // Beverage sizes
      'c14-1': 'Small', 'c14-2': 'Medium', 'c14-3': 'Large',
      'c15-1': 'Small', 'c15-2': 'Medium', 'c15-3': 'Large',
      'c17-1': 'Small', 'c17-2': 'Medium', 'c17-3': 'Large',
      // Coffee add-ons
      'c16-1': 'Extra Shot', 'c16-2': 'Vanilla Syrup', 'c16-3': 'Caramel Syrup', 'c16-4': 'Almond Milk',
      // Milkshake toppings
      'c18-1': 'Whipped Cream', 'c18-2': 'Cherry', 'c18-3': 'Chocolate Chips', 'c18-4': 'Extra Strawberries'
    };
    return selectionNames[selectionId] || selectionId;
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 250 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to extract city and postal code from address
  const parseAddress = (address: string) => {
    // Try to extract city and postal code from the address
    // This is a simple implementation - in a real app, you might want to use a more sophisticated parser
    const parts = address.split(',').map(part => part.trim());
    const lastPart = parts[parts.length - 1];
    
    // Check if the last part contains a postal code pattern (Canadian postal code)
    const postalCodeMatch = lastPart.match(/([A-Z]\d[A-Z]\s?\d[A-Z]\d)/i);
    
    if (postalCodeMatch) {
      const postalCode = postalCodeMatch[1];
      const city = lastPart.replace(postalCodeMatch[0], '').trim();
      return { city: city || parts[parts.length - 2] || 'Unknown', postalCode };
    }
    
    // Fallback: assume the last part is the city
    return { city: lastPart || 'Unknown', postalCode: 'N/A' };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
            variants={drawerVariants}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Your Cart ({totalItems})</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-lg mb-4">Your cart is empty</p>
                  <Button variant="outline" onClick={onClose}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <motion.div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        
                        {/* Display customizations */}
                        {item.customization && (
                          <div className="mt-1">
                            {formatCustomizations(item.customization).map((customization, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                • {customization}
                              </p>
                            ))}
                            {item.customization.specialInstructions && (
                              <p className="text-sm text-gray-500 mt-1 italic">
                                Note: {item.customization.specialInstructions}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Small Order Fee Warning */}
                  {hasSmallOrderFee && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2">
                      <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Small order fee applies</p>
                        <p>Add ${(smallOrderThreshold - subtotal).toFixed(2)} more to avoid the small order fee.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer with Calculation */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {/* Calculation Loading/Error State */}
                {calculationLoading && (
                  <div className="flex items-center justify-center py-2 text-gray-500">
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    <span className="text-sm">Calculating totals...</span>
                  </div>
                )}
                
                {calculationError && (
                  <div className="flex items-center justify-between py-2 text-amber-600 bg-amber-50 rounded px-3 mb-3">
                    <div className="flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      <span className="text-sm">{calculationError}</span>
                    </div>
                    <button
                      onClick={recalculate}
                      className="text-amber-700 hover:text-amber-800 text-sm underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Order Summary */}
                {formattedBreakdown ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>{formattedBreakdown.subtotal.label}</span>
                      <span>{formattedBreakdown.subtotal.formatted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formattedBreakdown.deliveryFee.label}</span>
                      <span>{formattedBreakdown.deliveryFee.formatted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formattedBreakdown.fees.label}</span>
                      <span>{formattedBreakdown.fees.formatted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formattedBreakdown.tax.label}</span>
                      <span>{formattedBreakdown.tax.formatted}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>{formattedBreakdown.total.label}</span>
                      <span>{formattedBreakdown.total.formatted}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Estimated delivery: {formattedBreakdown.estimatedDeliveryTime}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                )}
                
                <Button 
                  variant="primary" 
                  fullWidth
                  disabled={calculationLoading}
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  {calculationLoading ? 'Calculating...' : 'Proceed to Checkout'}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        deliveryAddress={{
          address: deliveryLocation.address,
          city: parseAddress(deliveryLocation.address).city,
          pincode: parseAddress(deliveryLocation.address).postalCode,
          phone: "" // Will be filled during checkout process
        }}
        orderTotal={total || subtotal}
      />
    </AnimatePresence>
  );
};

export default CartOverlay;