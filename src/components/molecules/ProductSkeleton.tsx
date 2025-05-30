import React from 'react';

interface ProductSkeletonProps {
  count?: number;
  viewType?: 'grid' | 'list';
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
  count = 4,
  viewType = 'grid',
  className = ''
}) => {
  const isGridView = viewType === 'grid';
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`
            bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse
            ${isGridView ? 'flex flex-col' : 'flex flex-row'}
            ${className}
          `}
          aria-hidden="true"
        >
          {/* Image Skeleton */}
          <div 
            className={`
              bg-gray-200
              ${isGridView ? 'w-full aspect-[4/3]' : 'w-24 h-24 sm:w-32 sm:h-32'}
            `}
          />
          
          {/* Content Skeleton */}
          <div className={`flex-1 p-4 ${isGridView ? '' : 'flex flex-col justify-between'}`}>
            <div>
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              
              {/* Description Skeleton */}
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              
              {/* Tags Skeleton */}
              <div className="flex gap-1 mb-3">
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                <div className="h-5 bg-gray-200 rounded-full w-12"></div>
              </div>
            </div>
            
            {/* Price & Button Skeleton */}
            <div className="flex items-center justify-between mt-auto">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;