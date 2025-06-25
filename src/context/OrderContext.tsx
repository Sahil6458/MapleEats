import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStatus, CartItem } from '../types';
import { OrderService } from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'tracking'>, userId?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getPendingOrders: () => Order[];
  clearOrders: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Sync orders with Supabase for authenticated users
  const syncWithSupabase = async (userId: string): Promise<void> => {
    try {
      console.log('📡 Fetching orders from Supabase for user:', userId);
      const result = await OrderService.getUserOrders(userId);
      if (result.success && result.orders) {
        const convertedOrders = result.orders.map(OrderService.convertToLocalOrder);
        console.log('✅ Synced orders from Supabase:', convertedOrders.length, 'orders');
        setOrders(convertedOrders);
      } else {
        console.log('📭 No orders found in Supabase for user');
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Failed to sync orders with Supabase:', error);
    }
  };

  // Effect to handle auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // User just signed in - fetch their orders from Supabase
      console.log('🔄 User signed in, syncing orders from Supabase...');
      syncWithSupabase(user.id);
    } else if (!isAuthenticated) {
      // User signed out - clear all orders
      console.log('🚪 User signed out, clearing orders...');
      setOrders([]);
    }
  }, [isAuthenticated, user]);

  // Generate order number
  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ME${timestamp}${random}`;
  };

  // Add new order
  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'tracking'>, userId?: string): Promise<Order> => {
    const orderNumber = generateOrderNumber();
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      createdAt: new Date(),
      tracking: {
        orderPlaced: new Date(),
        ...(orderData.status === 'confirmed' && { confirmed: new Date() }),
        ...(orderData.status === 'preparing' && { preparing: new Date() }),
        ...(orderData.status === 'ready' && { ready: new Date() }),
        ...(orderData.status === 'out_for_delivery' && { outForDelivery: new Date() }),
        ...(orderData.status === 'delivered' && { delivered: new Date() }),
      }
    };

    // If user is authenticated, save to Supabase
    if (userId) {
      try {
        const result = await OrderService.createOrder({
          userId,
          orderNumber,
          status: orderData.status,
          items: orderData.items,
          customerDetails: orderData.customerDetails,
          deliveryAddress: orderData.deliveryAddress,
          pricing: orderData.pricing,
          restaurantInfo: orderData.restaurant,
          estimatedDeliveryTime: orderData.estimatedDeliveryTime
        });

        if (result.success && result.order) {
          // Convert Supabase order to local order format
          const supabaseOrder = OrderService.convertToLocalOrder(result.order);
          setOrders(prevOrders => [supabaseOrder, ...prevOrders]);
          
          // Simulate order status progression for demo purposes
          simulateOrderProgress(supabaseOrder.id);
          
          return supabaseOrder;
        } else {
          console.error('Supabase order creation failed:', result.error);
        }
      } catch (error) {
        console.error('Failed to save order to Supabase:', error);
      }
    }

    // Add to local state (fallback or when not authenticated)
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Simulate order status progression for demo purposes
    simulateOrderProgress(newOrder.id);
    
    console.log('Order created locally:', newOrder);
    
    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedTracking = { ...order.tracking };
          const now = new Date();
          
          switch (status) {
            case 'confirmed':
              updatedTracking.confirmed = now;
              break;
            case 'preparing':
              updatedTracking.preparing = now;
              break;
            case 'ready':
              updatedTracking.ready = now;
              break;
            case 'out_for_delivery':
              updatedTracking.outForDelivery = now;
              break;
            case 'delivered':
              updatedTracking.delivered = now;
              break;
          }
          
          return {
            ...order,
            status,
            tracking: updatedTracking
          };
        }
        return order;
      })
    );
  };

  // Simulate order progress (for demo purposes)
  const simulateOrderProgress = (orderId: string) => {
    // Confirm order after 30 seconds
    setTimeout(() => {
      updateOrderStatus(orderId, 'confirmed');
    }, 30000);

    // Start preparing after 2 minutes
    setTimeout(() => {
      updateOrderStatus(orderId, 'preparing');
    }, 120000);

    // Ready after 15 minutes
    setTimeout(() => {
      updateOrderStatus(orderId, 'ready');
    }, 900000);

    // Out for delivery after 20 minutes
    setTimeout(() => {
      updateOrderStatus(orderId, 'out_for_delivery');
    }, 1200000);

    // Delivered after 35 minutes
    setTimeout(() => {
      updateOrderStatus(orderId, 'delivered');
    }, 2100000);
  };

  // Get order by ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  // Get pending orders (not delivered or cancelled)
  const getPendingOrders = (): Order[] => {
    return orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  };

  // Clear all orders
  const clearOrders = () => {
    setOrders([]);
  };



  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        getPendingOrders,
        clearOrders,
        syncWithSupabase
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    console.error('useOrders must be used within an OrderProvider. Make sure OrderProvider wraps your component tree.');
    // Return a fallback context to prevent app crashes
    return {
      orders: [],
      addOrder: async () => ({ id: '', orderNumber: '', status: 'pending' as const, createdAt: new Date(), estimatedDeliveryTime: '', items: [], customerDetails: { name: '', email: '', phone: '' }, deliveryAddress: { address: '', city: '', pincode: '', phone: '' }, pricing: { subtotal: 0, tax: 0, deliveryFee: 0, fees: 0, total: 0 } }),
      updateOrderStatus: () => {},
      getOrderById: () => undefined,
      getPendingOrders: () => [],
      clearOrders: () => {},
      syncWithSupabase: async () => {}
    };
  }
  return context;
}; 