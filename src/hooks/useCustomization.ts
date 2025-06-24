import { useState, useEffect } from 'react';
import { CustomizationOption, ProductCustomization } from '../types';

// Mock API function - replace with actual API call
const fetchCustomizationOptions = async (productId: string): Promise<CustomizationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock data - Updated for new product structure
  switch (productId) {
    // Starters
    case 'p1': // Buffalo Wings
      return [
        {
          id: 'c1',
          name: 'Wing Sauce',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c1-1', name: 'Buffalo', priceAdjustment: 0, default: true },
            { id: 'c1-2', name: 'BBQ', priceAdjustment: 0 },
            { id: 'c1-3', name: 'Honey Garlic', priceAdjustment: 0.5 },
            { id: 'c1-4', name: 'Extra Hot', priceAdjustment: 0.5 }
          ]
        },
        {
          id: 'c2',
          name: 'Quantity',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c2-1', name: '6 Wings', priceAdjustment: 0, default: true },
            { id: 'c2-2', name: '12 Wings', priceAdjustment: 6.99 },
            { id: 'c2-3', name: '24 Wings', priceAdjustment: 12.99 }
          ]
        }
      ];
    case 'p2': // Mozzarella Sticks
      return [
        {
          id: 'c3',
          name: 'Dipping Sauce',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c3-1', name: 'Marinara', priceAdjustment: 0, default: true },
            { id: 'c3-2', name: 'Ranch', priceAdjustment: 0 },
            { id: 'c3-3', name: 'Garlic Aioli', priceAdjustment: 0.5 }
          ]
        }
      ];
    case 'p3': // Loaded Nachos
      return [
        {
          id: 'c4',
          name: 'Protein Add-ons',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 2,
          options: [
            { id: 'c4-1', name: 'Grilled Chicken', priceAdjustment: 3.99 },
            { id: 'c4-2', name: 'Ground Beef', priceAdjustment: 4.99 },
            { id: 'c4-3', name: 'Pulled Pork', priceAdjustment: 4.99 }
          ]
        }
      ];

    // Burgers
    case 'p4': // Classic Cheeseburger
    case 'p5': // BBQ Bacon Burger
      return [
        {
          id: 'c5',
          name: 'Doneness',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c5-1', name: 'Medium Rare', priceAdjustment: 0 },
            { id: 'c5-2', name: 'Medium', priceAdjustment: 0, default: true },
            { id: 'c5-3', name: 'Well Done', priceAdjustment: 0 }
          ]
        },
        {
          id: 'c6',
          name: 'Extra Toppings',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 5,
          options: [
            { id: 'c6-1', name: 'Extra Cheese', priceAdjustment: 1.5 },
            { id: 'c6-2', name: 'Bacon', priceAdjustment: 2.99 },
            { id: 'c6-3', name: 'Avocado', priceAdjustment: 2.49 },
            { id: 'c6-4', name: 'Fried Egg', priceAdjustment: 1.99 },
            { id: 'c6-5', name: 'Mushrooms', priceAdjustment: 1.49 }
          ]
        },
        {
          id: 'c7',
          name: 'Side',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c7-1', name: 'French Fries', priceAdjustment: 0, default: true },
            { id: 'c7-2', name: 'Sweet Potato Fries', priceAdjustment: 1.99 },
            { id: 'c7-3', name: 'Onion Rings', priceAdjustment: 2.49 },
            { id: 'c7-4', name: 'Side Salad', priceAdjustment: 1.49 }
          ]
        }
      ];
    case 'p6': // Veggie Burger
      return [
        {
          id: 'c8',
          name: 'Extra Toppings',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 5,
          options: [
            { id: 'c8-1', name: 'Extra Avocado', priceAdjustment: 1.99 },
            { id: 'c8-2', name: 'Hummus', priceAdjustment: 1.49 },
            { id: 'c8-3', name: 'Sprouts', priceAdjustment: 0.99 },
            { id: 'c8-4', name: 'Roasted Red Peppers', priceAdjustment: 1.49 }
          ]
        },
        {
          id: 'c9',
          name: 'Side',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c9-1', name: 'Sweet Potato Fries', priceAdjustment: 0, default: true },
            { id: 'c9-2', name: 'Side Salad', priceAdjustment: 0 },
            { id: 'c9-3', name: 'Fruit Cup', priceAdjustment: 1.99 }
          ]
        }
      ];

    // Pizzas
    case 'p7': // Margherita Pizza
    case 'p8': // Pepperoni Pizza
    case 'p9': // Supreme Pizza
      return [
        {
          id: 'c10',
          name: 'Size',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c10-1', name: 'Small (10")', priceAdjustment: -3.00 },
            { id: 'c10-2', name: 'Medium (12")', priceAdjustment: 0, default: true },
            { id: 'c10-3', name: 'Large (14")', priceAdjustment: 4.00 },
            { id: 'c10-4', name: 'Extra Large (16")', priceAdjustment: 7.00 }
          ]
        },
        {
          id: 'c11',
          name: 'Crust Type',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c11-1', name: 'Regular Crust', priceAdjustment: 0, default: true },
            { id: 'c11-2', name: 'Thin Crust', priceAdjustment: 0 },
            { id: 'c11-3', name: 'Thick Crust', priceAdjustment: 1.99 },
            { id: 'c11-4', name: 'Stuffed Crust', priceAdjustment: 3.99 }
          ]
        },
        {
          id: 'c12',
          name: 'Extra Toppings',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 8,
          options: [
            { id: 'c12-1', name: 'Extra Cheese', priceAdjustment: 2.99 },
            { id: 'c12-2', name: 'Pepperoni', priceAdjustment: 2.49 },
            { id: 'c12-3', name: 'Mushrooms', priceAdjustment: 1.99 },
            { id: 'c12-4', name: 'Bell Peppers', priceAdjustment: 1.99 },
            { id: 'c12-5', name: 'Italian Sausage', priceAdjustment: 2.99 },
            { id: 'c12-6', name: 'Olives', priceAdjustment: 1.99 },
            { id: 'c12-7', name: 'Pineapple', priceAdjustment: 1.99 },
            { id: 'c12-8', name: 'Jalapeños', priceAdjustment: 1.49 }
          ]
        }
      ];

    // Beverages
    case 'p10': // Fresh Lemonade
      return [
        {
          id: 'c13',
          name: 'Flavor',
          required: false,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c13-1', name: 'Classic', priceAdjustment: 0, default: true },
            { id: 'c13-2', name: 'Strawberry', priceAdjustment: 0.99 },
            { id: 'c13-3', name: 'Raspberry', priceAdjustment: 0.99 },
            { id: 'c13-4', name: 'Mint', priceAdjustment: 0.99 }
          ]
        },
        {
          id: 'c14',
          name: 'Size',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c14-1', name: 'Small', priceAdjustment: -1.00 },
            { id: 'c14-2', name: 'Medium', priceAdjustment: 0, default: true },
            { id: 'c14-3', name: 'Large', priceAdjustment: 1.50 }
          ]
        }
      ];
    case 'p11': // Cold Brew Coffee
      return [
        {
          id: 'c15',
          name: 'Size',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c15-1', name: 'Small', priceAdjustment: -1.00 },
            { id: 'c15-2', name: 'Medium', priceAdjustment: 0, default: true },
            { id: 'c15-3', name: 'Large', priceAdjustment: 1.50 }
          ]
        },
        {
          id: 'c16',
          name: 'Add-ons',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 3,
          options: [
            { id: 'c16-1', name: 'Extra Shot', priceAdjustment: 1.50 },
            { id: 'c16-2', name: 'Vanilla Syrup', priceAdjustment: 0.75 },
            { id: 'c16-3', name: 'Caramel Syrup', priceAdjustment: 0.75 },
            { id: 'c16-4', name: 'Almond Milk', priceAdjustment: 0.60 }
          ]
        }
      ];
    case 'p12': // Strawberry Milkshake
      return [
        {
          id: 'c17',
          name: 'Size',
          required: true,
          multiSelect: false,
          maxSelections: 1,
          options: [
            { id: 'c17-1', name: 'Small', priceAdjustment: -1.50 },
            { id: 'c17-2', name: 'Medium', priceAdjustment: 0, default: true },
            { id: 'c17-3', name: 'Large', priceAdjustment: 2.00 }
          ]
        },
        {
          id: 'c18',
          name: 'Toppings',
          required: false,
          multiSelect: true,
          minSelections: 0,
          maxSelections: 3,
          options: [
            { id: 'c18-1', name: 'Whipped Cream', priceAdjustment: 0.99 },
            { id: 'c18-2', name: 'Cherry', priceAdjustment: 0.50 },
            { id: 'c18-3', name: 'Chocolate Chips', priceAdjustment: 1.49 },
            { id: 'c18-4', name: 'Extra Strawberries', priceAdjustment: 1.99 }
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