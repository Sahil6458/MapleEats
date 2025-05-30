import React from 'react';
import { Product } from '../../types';
import ProductCard from '../molecules/ProductCard';
import ProductSkeleton from '../molecules/ProductSkeleton';
import { Grid, List, AlertCircle } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  loading?: boolean;
  error?: string | null;
  viewType?: 'grid' | 'list';
  onToggleView?: (viewType: 'grid' | 'list') => void;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  loading = false,
  error = null,
  viewType = 'grid',
  onToggleView,
  className = ''
}) => {
  const isGridView = viewType === 'grid';
  
  return (
    <div className={`bg-gray-50 ${className}`}>
      {/* Header with view toggle */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </h2>
        
        {onToggleView && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleView('grid')}
              className={`p-2 rounded-md ${isGridView ? 'bg-gray-100 text-blue-600' : 'text-gray-500'}`}
              aria-label="Grid view"
              aria-pressed={isGridView}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => onToggleView('list')}
              className={`p-2 rounded-md ${!isGridView ? 'bg-gray-100 text-blue-600' : 'text-gray-500'}`}
              aria-label="List view"
              aria-pressed={!isGridView}
            >
              <List size={20} />
            </button>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">Something went wrong</p>
          <p className="text-gray-500">{error}</p>
        </div>
      )}
      
      {/* No Products */}
      {!loading && !error && products.length === 0 && (
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}
      
      {/* Product Grid/List */}
      <div 
        className={`
          p-4 grid gap-4
          ${isGridView 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
          }
        `}
      >
        {loading ? (
          <ProductSkeleton count={isGridView ? 8 : 4} viewType={viewType} />
        ) : (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              viewType={viewType}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;