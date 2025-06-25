import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title = "MapleEats",
  subtitle = "Fresh Food Delivered",
  showBackButton = false,
  onBackClick,
  className = ""
}) => {
  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center space-x-3">
            {showBackButton && onBackClick ? (
              <button
                onClick={onBackClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
            ) : (
              <div className="w-16 h-10 flex-shrink-0">
                <img 
                  src="https://i.postimg.cc/DfBx7GQF/Adobe-Express-file.png" 
                  alt="MapleEats Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Fallback to a simple colored div with initials if image fails
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm rounded-lg';
                    fallback.textContent = 'ME';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            )}
            
            {/* Brand Text */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>

          {/* Mobile Brand Text */}
          <div className="sm:hidden">
            <h1 className="text-base font-bold text-gray-900">{title}</h1>
          </div>

          {/* Right side - Can be extended for actions */}
          <div className="flex items-center space-x-2">
            {/* Space for future actions like user menu, notifications, etc. */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 