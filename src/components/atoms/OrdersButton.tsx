import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import PendingOrdersPanel from '../organisms/PendingOrdersPanel';

interface OrdersButtonProps {
  className?: string;
  showLabel?: boolean;
}

const OrdersButton: React.FC<OrdersButtonProps> = ({ 
  className = "", 
  showLabel = true 
}) => {
  const { getPendingOrders } = useOrders();
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);
  const pendingOrdersCount = getPendingOrders().length;

  if (pendingOrdersCount === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowOrdersPanel(true)}
        className={`
          relative flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
          hover:bg-blue-700 transition-colors shadow-sm
          ${className}
        `}
        aria-label="View pending orders"
      >
        <Package size={20} />
        {showLabel && <span className="font-medium">My Orders</span>}
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {pendingOrdersCount}
        </span>
      </button>

      <PendingOrdersPanel
        isOpen={showOrdersPanel}
        onClose={() => setShowOrdersPanel(false)}
      />
    </>
  );
};

export default OrdersButton; 