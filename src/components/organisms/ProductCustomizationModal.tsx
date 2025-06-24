import React, { useState } from 'react';
import { Product, CustomizationOption, ProductCustomization } from '../../types';
import Button from '../atoms/Button';
import QuantitySelector from '../atoms/QuantitySelector';
import { X, Info } from 'lucide-react';

interface ProductCustomizationModalProps {
  product: Product;
  options: CustomizationOption[];
  initialCustomization: ProductCustomization;
  onUpdateSingleSelection: (optionId: string, selectionId: string) => void;
  onUpdateMultiSelection: (optionId: string, selectionId: string, isSelected: boolean) => void;
  onUpdateSpecialInstructions: (instructions: string) => void;
  calculateTotalPrice: (basePrice: number) => number;
  isValid: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  loading?: boolean;
}

const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  product,
  options,
  initialCustomization,
  onUpdateSingleSelection,
  onUpdateMultiSelection,
  onUpdateSpecialInstructions,
  calculateTotalPrice,
  isValid,
  onClose,
  onAddToCart,
  loading = false
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState(initialCustomization.specialInstructions || '');
  
  // Format total price
  const totalPrice = calculateTotalPrice(product.price) * quantity;
  const formattedTotalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalPrice);
  
  // Handle special instructions change
  const handleSpecialInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSpecialInstructions(value);
    onUpdateSpecialInstructions(value);
  };
  
  // Handle quantity change
  const handleIncreaseQuantity = () => setQuantity(prev => prev + 1);
  const handleDecreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  
  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(quantity);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mt-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <>
              {/* Product Image */}
              <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Description */}
              <p className="text-gray-500 mb-6">{product.description}</p>
              
              {/* Customization Options */}
              {options.map((option) => (
                <div key={option.id} className="mb-6">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{option.name}</h4>
                    {option.required && (
                      <span className="ml-2 text-xs text-red-600 font-medium">Required</span>
                    )}
                  </div>
                  
                  {!option.multiSelect ? (
                    // Single select variant
                    <div className="space-y-2">
                      {option.options.map((opt) => {
                        const isSelected = initialCustomization.selections[option.id] === opt.id;
                        return (
                          <label 
                            key={opt.id}
                            className={`
                              flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                              ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                            `}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name={option.id}
                                value={opt.id}
                                checked={isSelected}
                                onChange={() => onUpdateSingleSelection(option.id, opt.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-3 text-gray-900">{opt.name}</span>
                            </div>
                            {opt.priceAdjustment > 0 && (
                              <span className="text-gray-500">
                                +{new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(opt.priceAdjustment)}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    // Multi-select modifier
                    <div className="space-y-2">
                      {/* {option.minSelections && option.minSelections > 0 && (
                        <p className="text-sm text-gray-500 mb-2">
                          Select at least {option.minSelections}
                          {option.maxSelections && `, up to ${option.maxSelections}`}
                        </p>
                      )} */}
                      
                      {option.options.map((opt) => {
                        const selections = initialCustomization.selections[option.id] as string[] || [];
                        const isSelected = selections.includes(opt.id);
                        
                        return (
                          <label 
                            key={opt.id}
                            className={`
                              flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                              ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                            `}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name={option.id}
                                value={opt.id}
                                checked={isSelected}
                                onChange={(e) => onUpdateMultiSelection(option.id, opt.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-3 text-gray-900">{opt.name}</span>
                            </div>
                            {opt.priceAdjustment > 0 && (
                              <span className="text-gray-500">
                                +{new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(opt.priceAdjustment)}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Special Instructions */}
              <div className="mb-6">
                <label htmlFor="special-instructions" className="block text-lg font-medium text-gray-900 mb-2">
                  Special Instructions
                </label>
                <textarea
                  id="special-instructions"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Any special requests or allergies? Let us know!"
                  value={specialInstructions}
                  onChange={handleSpecialInstructionsChange}
                ></textarea>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Quantity</span>
            <QuantitySelector
              quantity={quantity}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              min={1}
              max={10}
            />
          </div>
          
          {/* Invalid Selection Warning */}
          {!isValid && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <Info size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Please make all required selections before adding to cart.
              </p>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900 mr-4">{formattedTotalPrice}</span>
            <Button
              variant="primary"
              fullWidth
              disabled={!isValid || loading}
              loading={loading}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizationModal;