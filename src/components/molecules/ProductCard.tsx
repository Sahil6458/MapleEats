import React from 'react';
import { Product } from '../../types';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import QuantitySelector from '../atoms/QuantitySelector';
import { useCart } from '../../context/CartContext';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  className?: string;
  viewType?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  className = '',
  viewType = 'grid'
}) => {
  const isGridView = viewType === 'grid';
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  
  // Format price with correct currency symbol and decimals
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price);

  // Get total quantity of this product in cart (sum of all cart items with same productId)
  const cartQuantity = items
    .filter(item => item.productId === product.id)
    .reduce((total, item) => total + item.quantity, 0);

  // Handle adding product to cart (for products without customization)
  const handleAddToCart = () => {
    if (product.hasCustomization) {
      onSelect(product);
    } else {
      addToCart(product, 1);
    }
  };

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    if (cartQuantity === 0) {
      // If not in cart, add it
      addToCart(product, 1);
    } else {
      // If already in cart, find the most recent item and update its quantity
      const latestCartItem = items
        .filter(item => item.productId === product.id)
        .sort((a, b) => parseInt(b.id.split('_')[1]) - parseInt(a.id.split('_')[1]))[0];
      
      if (latestCartItem) {
        updateQuantity(latestCartItem.id, latestCartItem.quantity + 1);
      }
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    if (cartQuantity > 0) {
      // Find the most recent item and decrease its quantity
      const latestCartItem = items
        .filter(item => item.productId === product.id)
        .sort((a, b) => parseInt(b.id.split('_')[1]) - parseInt(a.id.split('_')[1]))[0];
      
      if (latestCartItem) {
        if (latestCartItem.quantity > 1) {
          updateQuantity(latestCartItem.id, latestCartItem.quantity - 1);
        } else {
          removeFromCart(latestCartItem.id);
        }
      }
    }
  };
  
  return (
    <div 
      className={`
        bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md
        ${isGridView ? 'flex flex-col' : 'flex flex-row'}
        ${className}
      `}
    >
      {/* Product Image */}
      <div 
        className={`
          relative overflow-hidden bg-gray-100
          ${isGridView ? 'w-full aspect-[4/3]' : 'w-24 h-24 sm:w-32 sm:h-32'}
        `}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Food';
          }}
        />
        
        {/* Availability Badge */}
        {!product.available && (
          <div className="absolute top-0 right-0 m-2">
            <Badge text="Sold Out" variant="error" />
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className={`flex-1 p-4 ${isGridView ? '' : 'flex flex-col justify-between'}`}>
        <div>
          {/* Product Name & Tags */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            {product.hasCustomization && (
              <span className="text-blue-600 ml-2" title="Customizable">
                <AlertCircle size={16} />
              </span>
            )}
          </div>
          
          {/* Product Description */}
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map(tag => (
                <Badge key={tag} text={tag} variant="default" className="text-xs" />
              ))}
            </div>
          )}
        </div>
        
        {/* Price & Add Button / Quantity Controls */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-medium text-gray-900">{formattedPrice}</span>
          
          <div className="flex items-center gap-2">
            {cartQuantity > 0 && !product.hasCustomization ? (
              // Show quantity controls if item is in cart and doesn't need customization
              <QuantitySelector
                quantity={cartQuantity}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                size="sm"
                min={0}
              />
            ) : (
              // Show add/customize button with quantity indicator
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className="flex items-center"
                >
                  {product.hasCustomization ? 'Customize' : 'Add'}
                  {product.hasCustomization && <ChevronRight size={16} className="ml-1" />}
                </Button>
                {cartQuantity > 0 && (
                  <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartQuantity}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;