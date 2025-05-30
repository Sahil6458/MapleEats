import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
  className = ''
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onIncrease();
    }
  };

  const buttonSize = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`${buttonSize[size]} flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus size={iconSize[size]} className="stroke-current" />
      </button>
      
      <span className={`mx-3 ${textSize[size]} font-medium text-gray-900 tabular-nums`}>
        {quantity}
      </span>
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`${buttonSize[size]} flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus size={iconSize[size]} className="stroke-current" />
      </button>
    </div>
  );
};

export default QuantitySelector;