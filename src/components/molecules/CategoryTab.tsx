import React from 'react';
import { Category } from '../../types';

interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  category,
  isActive,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center py-2 px-4 transition-colors focus:outline-none
        ${isActive 
          ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
          : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}
        ${className}
      `}
      aria-selected={isActive}
      role="tab"
    >
      {category.imageUrl && (
        <div className="w-12 h-12 rounded-full overflow-hidden mb-1">
          <img 
            src={category.imageUrl} 
            alt={category.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=Category';
            }}
          />
        </div>
      )}
      <span className={`truncate max-w-[100px] text-sm ${isActive ? 'font-medium' : ''}`}>
        {category.name}
      </span>
    </button>
  );
};

export default CategoryTab;