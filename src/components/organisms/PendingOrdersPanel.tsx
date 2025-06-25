import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Truck, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types';
import Button from '../atoms/Button';

interface PendingOrdersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PendingOrdersPanel: React.FC<PendingOrdersPanelProps> = ({ isOpen, onClose }) => {
  const { getPendingOrders } = useOrders();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  const pendingOrders = getPendingOrders();

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'preparing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'out_for_delivery':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'preparing':
        return <Package size={16} />;
      case 'ready':
        return <AlertCircle size={16} />;
      case 'out_for_delivery':
        return <Truck size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      default:
        return 'Processing';
    }
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const orderDate = new Date(date);
    
    if (orderDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(orderDate);
  };

  const renderOrderItem = (order: Order) => {
    const isExpanded = expandedOrders.has(order.id);
    const statusColor = getStatusColor(order.status);
    const statusIcon = getStatusIcon(order.status);
    const statusText = getStatusText(order.status);

    return (
      <motion.div
        key={order.id}
        className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Order Header */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleOrderExpansion(order.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${statusColor}`}>
                {statusIcon}
                <span>{statusText}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-gray-900">${order.pricing.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{order.estimatedDeliveryTime}</p>
              </div>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Expanded Order Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200"
            >
              <div className="p-4 space-y-4">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.quantity}x {item.name}</p>
                          {item.customization?.specialInstructions && (
                            <p className="text-gray-500 text-xs mt-1">
                              Note: {item.customization.specialInstructions}
                            </p>
                          )}
                        </div>
                        <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin size={16} className="mr-1" />
                    Delivery Address
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.city}, {order.deliveryAddress.pincode}
                  </p>
                </div>

                {/* Customer Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.customerDetails.name}</p>
                    <p className="flex items-center">
                      <Phone size={14} className="mr-1" />
                      {order.customerDetails.phone}
                    </p>
                    {order.customerDetails.deliveryInstructions && (
                      <p className="text-xs">
                        <strong>Instructions:</strong> {order.customerDetails.deliveryInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Tracking */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Progress</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'orderPlaced', label: 'Order Placed', status: 'pending' },
                      { key: 'confirmed', label: 'Order Confirmed', status: 'confirmed' },
                      { key: 'preparing', label: 'Being Prepared', status: 'preparing' },
                      { key: 'ready', label: 'Ready', status: 'ready' },
                      { key: 'outForDelivery', label: 'Out for Delivery', status: 'out_for_delivery' }
                    ].map((step) => {
                      const isCompleted = order.tracking?.[step.key as keyof typeof order.tracking];
                      const isCurrent = order.status === step.status;
                      
                      return (
                        <div key={step.key} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            isCompleted 
                              ? 'bg-green-500' 
                              : isCurrent 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                          }`} />
                          <div className="flex-1 flex justify-between items-center">
                            <span className={`text-sm ${
                              isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </span>
                            {isCompleted && (
                              <span className="text-xs text-gray-500">
                                {formatTime(order.tracking[step.key as keyof typeof order.tracking] as Date)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-3">
                  <h4 className="font-medium text-gray-900 mb-2">Price Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.pricing.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${order.pricing.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees</span>
                      <span>${order.pricing.fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-1">
                      <span>Total</span>
                      <span>${order.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Pending Orders</h2>
                <p className="text-gray-600">
                  {pendingOrders.length} active {pendingOrders.length === 1 ? 'order' : 'orders'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close orders panel"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Orders</h3>
                  <p className="text-gray-500">
                    Your recent orders will appear here once you place them.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map(renderOrderItem)}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
              <Button variant="outline" onClick={onClose} fullWidth>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PendingOrdersPanel; 