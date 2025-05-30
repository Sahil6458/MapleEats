import React, { useRef, useEffect } from 'react';
import { Category } from '../../types';
import CategoryTab from '../molecules/CategoryTab';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  loading?: boolean;
  className?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  loading = false,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = React.useState(false);
  const [showRightScroll, setShowRightScroll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Check if scroll buttons should be visible
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < (container.scrollWidth - container.clientWidth - 10)
      );
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);
  
  // Scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className={`relative bg-white border-b border-gray-200 ${className}`}>
      {/* Search Input */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search categories"
          />
        </div>
      </div>
      
      {/* Category Navigation */}
      <div className="relative">
        {/* Left Scroll Button */}
        {showLeftScroll && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 inset-y-0 z-10 flex items-center justify-center w-8 bg-gradient-to-r from-white to-transparent"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-gray-500" />
          </button>
        )}
        
        {/* Categories */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth py-2 px-4"
          role="tablist"
        >
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center mr-6 animate-pulse" aria-hidden="true">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))
          ) : filteredCategories.length > 0 ? (
            // Actual categories
            filteredCategories.map(category => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => onSelectCategory(category.id)}
                className="mr-6 shrink-0"
              />
            ))
          ) : (
            // No results
            <div className="py-4 text-center text-gray-500 w-full">
              No categories found
            </div>
          )}
        </div>
        
        {/* Right Scroll Button */}
        {showRightScroll && (
          <button
            onClick={scrollRight}
            className="absolute right-0 inset-y-0 z-10 flex items-center justify-center w-8 bg-gradient-to-l from-white to-transparent"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-gray-500" />
          </button>
        )}
      </div>
      
      {/* Subcategories */}
      {activeCategory && (
        <div className="px-4 py-2 flex overflow-x-auto scrollbar-hide">
          {categories
            .find(cat => cat.id === activeCategory)
            ?.subcategories
            ?.map(subcat => (
              <button
                key={subcat.id}
                onClick={() => onSelectCategory(subcat.id)}
                className={`
                  px-3 py-1 mr-2 text-sm rounded-full whitespace-nowrap
                  ${activeCategory === subcat.id
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                {subcat.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNavigation;