import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index';
import { LocationData } from '../../App';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { useCustomization } from '../../hooks/useCustomization';
import { useCart } from '../../context/CartContext';
import CategoryNavigation from '../organisms/CategoryNavigation';
import ProductGrid from '../organisms/ProductGrid';
import ProductCustomizationModal from '../organisms/ProductCustomizationModal';
import CartButton from '../molecules/CartButton';
import CartOverlay from '../organisms/CartOverlay';
import TopBar from '../molecules/TopBar';
import OrdersButton from '../atoms/OrdersButton';

interface DeliveryMenuProps {
  vendorId: string;
  addressId: number;
  deliveryLocation: LocationData;
  onBackToRestaurants?: () => void;
  className?: string;
}

const DeliveryMenu: React.FC<DeliveryMenuProps> = ({
  vendorId,
  addressId,
  deliveryLocation,
  onBackToRestaurants,
  className = ''
}) => {
  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hooks
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(addressId.toString());
  console.log("CATEGORIES>>>>>>>>>>>>>>>", categories);
  const { products, loading: productsLoading, error: productsError } = useProducts(selectedCategoryId?.toString());
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
  const handleCategorySelect = (categoryId: number) => {
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
      {/* Top Bar */}
      <TopBar 
        title="MapleEats"
        subtitle="Fresh Food Delivered"
        showBackButton={!!onBackToRestaurants}
        onBackClick={onBackToRestaurants}
      />

      {/* Sticky Header with Cart */}
      <header className="sticky top-[64px] z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {/* Restaurant Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Restaurant Menu</h1>
              <p className="text-xs text-gray-500">Delivering to {deliveryLocation.address.split(',')[0]}</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-gray-900">Menu</h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <OrdersButton showLabel={false} className="hidden sm:flex" />
            <CartButton onClick={() => setIsCartOpen(true)} />
          </div>
        </div>
      </header>

      {/* Category Navigation - Also sticky but below header */}
      <CategoryNavigation
        categories={categories}
        activeCategory={selectedCategoryId}
        onSelectCategory={handleCategorySelect}
        loading={categoriesLoading}
        className="sticky top-[128px] z-20 bg-white"
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
      <CartOverlay 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        deliveryLocation={deliveryLocation}
      />
    </div>
  );
};

export default DeliveryMenu;