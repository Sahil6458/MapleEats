import { useState, useEffect } from 'react';
import { CustomizationOption, ProductCustomization } from '../types';

// Mock API function - replace with actual API call
const fetchCustomizationOptions = async (productId: string): Promise<CustomizationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock data - different options based on productId
  switch (productId) {
    case 'p1': // Calamari
      return [
        {
          id: 'c1',
          name: 'Dipping Sauce',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c1-1', name: 'Marinara', priceAdjustment: 0, default: true },
            { id: 'c1-2', name: 'Tartar Sauce', priceAdjustment: 0 },
            { id: 'c1-3', name: 'Spicy Aioli', priceAdjustment: 0.75 }
          ]
        }
      ];
    case 'p4': // Grilled Salmon
      return [
        {
          id: 'c2',
          name: 'Cooking Preference',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c2-1', name: 'Medium Rare', priceAdjustment: 0 },
            { id: 'c2-2', name: 'Medium', priceAdjustment: 0, default: true },
            { id: 'c2-3', name: 'Well Done', priceAdjustment: 0 }
          ]
        },
        {
          id: 'c3',
          name: 'Side Options',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c3-1', name: 'Seasonal Vegetables', priceAdjustment: 0, default: true },
            { id: 'c3-2', name: 'Mashed Potatoes', priceAdjustment: 0 },
            { id: 'c3-3', name: 'Wild Rice', priceAdjustment: 0 }
          ]
        }
      ];
    case 'p5': // Fettuccine Alfredo
      return [
        {
          id: 'c4',
          name: 'Protein Add-ons',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 2,
          options: [
            { id: 'c4-1', name: 'Grilled Chicken', priceAdjustment: 4.99 },
            { id: 'c4-2', name: 'Shrimp', priceAdjustment: 5.99 },
            { id: 'c4-3', name: 'Italian Sausage', priceAdjustment: 3.99 }
          ]
        },
        {
          id: 'c5',
          name: 'Extra Toppings',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 3,
          options: [
            { id: 'c5-1', name: 'Mushrooms', priceAdjustment: 1.49 },
            { id: 'c5-2', name: 'Spinach', priceAdjustment: 1.49 },
            { id: 'c5-3', name: 'Roasted Garlic', priceAdjustment: 0.99 },
            { id: 'c5-4', name: 'Sun-dried Tomatoes', priceAdjustment: 1.99 }
          ]
        }
      ];
    case 'p6': // Cheeseburger
      return [
        {
          id: 'c6',
          name: 'Doneness',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c6-1', name: 'Medium Rare', priceAdjustment: 0 },
            { id: 'c6-2', name: 'Medium', priceAdjustment: 0, default: true },
            { id: 'c6-3', name: 'Well Done', priceAdjustment: 0 }
          ]
        },
        {
          id: 'c7',
          name: 'Cheese Selection',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c7-1', name: 'Cheddar', priceAdjustment: 0, default: true },
            { id: 'c7-2', name: 'American', priceAdjustment: 0 },
            { id: 'c7-3', name: 'Swiss', priceAdjustment: 0 },
            { id: 'c7-4', name: 'Blue Cheese', priceAdjustment: 1.5 }
          ]
        },
        {
          id: 'c8',
          name: 'Toppings',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 10,
          options: [
            { id: 'c8-1', name: 'Lettuce', priceAdjustment: 0, default: true },
            { id: 'c8-2', name: 'Tomato', priceAdjustment: 0, default: true },
            { id: 'c8-3', name: 'Onion', priceAdjustment: 0, default: true },
            { id: 'c8-4', name: 'Pickles', priceAdjustment: 0 },
            { id: 'c8-5', name: 'Bacon', priceAdjustment: 1.99 },
            { id: 'c8-6', name: 'Avocado', priceAdjustment: 2.49 },
            { id: 'c8-7', name: 'Fried Egg', priceAdjustment: 1.49 },
            { id: 'c8-8', name: 'Jalapeños', priceAdjustment: 0.99 },
            { id: 'c8-9', name: 'Sautéed Mushrooms', priceAdjustment: 1.49 },
            { id: 'c8-10', name: 'Caramelized Onions', priceAdjustment: 1.49 }
          ]
        }
      ];
    case 'p8': // Fresh Lemonade
      return [
        {
          id: 'c9',
          name: 'Flavor',
          required: false,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c9-1', name: 'Classic', priceAdjustment: 0, default: true },
            { id: 'c9-2', name: 'Strawberry', priceAdjustment: 0.99 },
            { id: 'c9-3', name: 'Raspberry', priceAdjustment: 0.99 },
            { id: 'c9-4', name: 'Mint', priceAdjustment: 0.99 }
          ]
        },
        {
          id: 'c10',
          name: 'Sweetness',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c10-1', name: 'Regular', priceAdjustment: 0, default: true },
            { id: 'c10-2', name: 'Less Sweet', priceAdjustment: 0 },
            { id: 'c10-3', name: 'More Sweet', priceAdjustment: 0 }
          ]
        }
      ];
    default:
      return [];
  }
};

export const useCustomization = (productId: string) => {
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customization, setCustomization] = useState<ProductCustomization>({
    productId,
    selections: {}
  });

  useEffect(() => {
    const loadCustomizationOptions = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const data = await fetchCustomizationOptions(productId);
        setOptions(data);
        
        // Initialize selections with defaults
        const initialSelections: ProductCustomization['selections'] = {};
        
        data.forEach(option => {
          if (option.multiSelect === false) {
            // For single select variants
            const defaultOption = option.options.find(opt => opt.default);
            if (defaultOption) {
              initialSelections[option.id] = defaultOption.id;
            } else if (option.required && option.options.length > 0) {
              initialSelections[option.id] = option.options[0].id;
            }
          } else {
            // For multi-select modifiers
            const defaultOptions = option.options
              .filter(opt => opt.default)
              .map(opt => opt.id);
            
            if (defaultOptions.length > 0) {
              initialSelections[option.id] = defaultOptions;
            } else if (option.required && option.minSelections && option.minSelections > 0) {
              // If required with minimum selections, pre-select the first N options
              initialSelections[option.id] = option.options
                .slice(0, option.minSelections)
                .map(opt => opt.id);
            } else {
              initialSelections[option.id] = [];
            }
          }
        });
        
        setCustomization({
          productId,
          selections: initialSelections
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load customization options');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomizationOptions();
  }, [productId]);

  // Update selections for single-select options
  const updateSingleSelection = (optionId: string, selectionId: string) => {
    setCustomization(prev => ({
      ...prev,
      selections: {
        ...prev.selections,
        [optionId]: selectionId
      }
    }));
  };

  // Update selections for multi-select options
  const updateMultiSelection = (optionId: string, selectionId: string, isSelected: boolean) => {
    setCustomization(prev => {
      const currentSelections = prev.selections[optionId] as string[] || [];
      let newSelections: string[];
      
      if (isSelected) {
        // Add selection
        newSelections = [...currentSelections, selectionId];
      } else {
        // Remove selection
        newSelections = currentSelections.filter(id => id !== selectionId);
      }
      
      return {
        ...prev,
        selections: {
          ...prev.selections,
          [optionId]: newSelections
        }
      };
    });
  };

  // Calculate total price based on selections
  const calculateTotalPrice = (basePrice: number): number => {
    if (!options.length) return basePrice;
    
    let additionalCost = 0;
    
    Object.entries(customization.selections).forEach(([optionId, selection]) => {
      const option = options.find(opt => opt.id === optionId);
      if (!option) return;
      
      if (!option.multiSelect && typeof selection === 'string') {
        // Single selection
        const selectedOption = option.options.find(opt => opt.id === selection);
        if (selectedOption) {
          additionalCost += selectedOption.priceAdjustment;
        }
      } else if (option.multiSelect && Array.isArray(selection)) {
        // Multiple selections
        selection.forEach(selId => {
          const selectedOption = option.options.find(opt => opt.id === selId);
          if (selectedOption) {
            additionalCost += selectedOption.priceAdjustment;
          }
        });
      }
    });
    
    return basePrice + additionalCost;
  };

  // Validate if all required selections are made
  const validateSelections = (): boolean => {
    return options.every(option => {
      const selection = customization.selections[option.id];
      
      if (!option.required) return true;
      
      if (!option.multiSelect) {
        // Single select validation
        return typeof selection === 'string' && selection.length > 0;
      } else {
        // Multi-select validation
        return Array.isArray(selection) && 
               selection.length >= (option.minSelections || 0) && 
               selection.length <= (option.maxSelections || Infinity);
      }
    });
  };

  // Update special instructions
  const updateSpecialInstructions = (instructions: string) => {
    setCustomization(prev => ({
      ...prev,
      specialInstructions: instructions
    }));
  };

  return {
    options,
    loading,
    error,
    customization,
    updateSingleSelection,
    updateMultiSelection,
    calculateTotalPrice,
    validateSelections,
    updateSpecialInstructions
  };
};