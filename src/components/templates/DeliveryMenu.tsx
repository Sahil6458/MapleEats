import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { useCustomization } from '../../hooks/useCustomization';
import { useCart } from '../../context/CartContext';
import CategoryNavigation from '../organisms/CategoryNavigation';
import ProductGrid from '../organisms/ProductGrid';
import ProductCustomizationModal from '../organisms/ProductCustomizationModal';
import CartButton from '../molecules/CartButton';
import CartOverlay from '../organisms/CartOverlay';

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  
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
          <CartButton onClick={() => setIsCartOpen(true)} />
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

      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default DeliveryMenu;