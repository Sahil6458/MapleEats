import React from 'react';
import { Category } from '../../types';
import { ChefHat, Pizza, Coffee, Sandwich, Salad } from 'lucide-react';

interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

// Icon mapping for different categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('pizza')) return Pizza;
  if (name.includes('burger')) return Sandwich;
  if (name.includes('beverage') || name.includes('drink')) return Coffee;
  if (name.includes('starter') || name.includes('appetizer')) return Salad;
  return ChefHat;
};

const CategoryTab: React.FC<CategoryTabProps> = ({
  category,
  isActive,
  onClick,
  className = ''
}) => {
  const IconComponent = getCategoryIcon(category.name);

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200 hover:border-gray-300 hover:shadow-md'}
        ${className}
      `}
      aria-selected={isActive}
      role="tab"
    >
      {/* Temporarily commented out image section */}
      {/* 
      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 flex items-center justify-center bg-gray-100">
        {category.image ? (
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=Category';
            }}
          />
        ) : (
          <ChefHat className="w-6 h-6 text-gray-400" />
        )}
      </div>
      */}
      
      {/* Icon representation */}
      <div className={`mb-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>
        <IconComponent className="w-6 h-6" />
      </div>
      
      {/* Category name */}
      <span className={`text-sm font-medium text-center leading-tight ${isActive ? 'text-white' : 'text-gray-700'}`}>
        {category.name}
      </span>
    </button>
  );
};

export default CategoryTab;