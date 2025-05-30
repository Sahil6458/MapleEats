import React from 'react';
import { Product } from '../../types';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
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
  
  // Format price with correct currency symbol and decimals
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price);
  
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
            <Badge text="Sold Out\" variant="error" />
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
        
        {/* Price & Add Button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-medium text-gray-900">{formattedPrice}</span>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSelect(product)}
            disabled={!product.available}
            className="flex items-center"
          >
            {product.hasCustomization ? 'Customize' : 'Add'}
            {product.hasCustomization && <ChevronRight size={16} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;