import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { useCustomization } from '../../hooks/useCustomization';
import { useCart } from '../../context/CartContext';
import CategoryNavigation from '../organisms/CategoryNavigation';
import ProductGrid from '../organisms/ProductGrid';
import ProductCustomizationModal from '../organisms/ProductCustomizationModal';
import { ShoppingBag } from 'lucide-react';

interface DeliveryMenuProps {
  vendorId: string;
  className?: string;
}

const DeliveryMenu: React.FC<DeliveryMenuProps> = ({
  vendorId,
  className = ''
}) => {
  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Hooks
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { products, loading: productsLoading, error: productsError } = useProducts(selectedCategoryId);
  const { 
    options, 
    loading: customizationLoading, 
    customization, 
    updateSingleSelection, 
    updateMultiSelection, 
    calculateTotalPrice, 
    validateSelections,
    updateSpecialInstructions
  } = useCustomization(selectedProduct?.id || '');
  const { addToCart, totalItems } = useCart();
  
  // Set the first category as selected when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };
  
  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    
    // If product doesn't have customization options, add it to cart directly
    if (!product.hasCustomization) {
      addToCart(product, 1);
    }
  };
  
  // Handle add to cart with customization
  const handleAddToCartWithCustomization = (quantity: number) => {
    if (selectedProduct && validateSelections()) {
      addToCart(selectedProduct, quantity, customization);
      setSelectedProduct(null);
    }
  };
  
  // Close customization modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with cart button */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Food Delivery</h1>
          
          <button 
            className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            aria-label={`View cart with ${totalItems} items`}
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      
      {/* Category Navigation */}
      <CategoryNavigation
        categories={categories}
        activeCategory={selectedCategoryId}
        onSelectCategory={handleCategorySelect}
        loading={categoriesLoading}
        className="sticky top-0 z-20"
      />
      
      {/* Product Grid */}
      <ProductGrid
        products={products}
        onSelectProduct={handleProductSelect}
        loading={productsLoading}
        error={productsError}
        viewType={viewType}
        onToggleView={setViewType}
        className="flex-1 overflow-y-auto"
      />
      
      {/* Product Customization Modal */}
      {selectedProduct && selectedProduct.hasCustomization && (
        <ProductCustomizationModal
          product={selectedProduct}
          options={options}
          initialCustomization={customization}
          onUpdateSingleSelection={updateSingleSelection}
          onUpdateMultiSelection={updateMultiSelection}
          onUpdateSpecialInstructions={updateSpecialInstructions}
          calculateTotalPrice={calculateTotalPrice}
          isValid={validateSelections()}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCartWithCustomization}
          loading={customizationLoading}
        />
      )}
    </div>
  );
};

export default DeliveryMenu;