import { supabase, Order as SupabaseOrder } from '../lib/supabase';
import { Order, CartItem } from '../types';

export class OrderService {
  // Create a new order in Supabase
  static async createOrder(orderData: {
    userId: string;
    orderNumber: string;
    status: Order['status'];
    items: CartItem[];
    customerDetails: Order['customerDetails'];
    deliveryAddress: Order['deliveryAddress'];
    pricing: Order['pricing'];
    restaurantInfo?: Order['restaurant'];
    estimatedDeliveryTime: string;
  }): Promise<{ success: boolean; order?: SupabaseOrder; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          order_number: orderData.orderNumber,
          status: orderData.status,
          items: orderData.items,
          customer_details: orderData.customerDetails,
          delivery_address: orderData.deliveryAddress,
          pricing: orderData.pricing,
          restaurant_info: orderData.restaurantInfo,
          estimated_delivery_time: orderData.estimatedDeliveryTime,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tracking: {
            orderPlaced: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, order: data };
    } catch (error: any) {
      console.error('Error in createOrder:', error);
      return { success: false, error: error.message || 'Failed to create order' };
    }
  }

  // Get orders for a specific user
  static async getUserOrders(userId: string): Promise<{ success: boolean; orders?: SupabaseOrder[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        return { success: false, error: error.message };
      }

      return { success: true, orders: data || [] };
    } catch (error: any) {
      console.error('Error in getUserOrders:', error);
      return { success: false, error: error.message || 'Failed to fetch orders' };
    }
  }

  // Get pending orders for a user
  static async getUserPendingOrders(userId: string): Promise<{ success: boolean; orders?: SupabaseOrder[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .not('status', 'in', '(delivered,cancelled)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending orders:', error);
        return { success: false, error: error.message };
      }

      return { success: true, orders: data || [] };
    } catch (error: any) {
      console.error('Error in getUserPendingOrders:', error);
      return { success: false, error: error.message || 'Failed to fetch pending orders' };
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['status'], trackingUpdate?: any): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (trackingUpdate) {
        // Get current tracking data
        const { data: currentOrder } = await supabase
          .from('orders')
          .select('tracking')
          .eq('id', orderId)
          .single();

        updateData.tracking = {
          ...currentOrder?.tracking,
          ...trackingUpdate
        };
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in updateOrderStatus:', error);
      return { success: false, error: error.message || 'Failed to update order status' };
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<{ success: boolean; order?: SupabaseOrder; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, order: data };
    } catch (error: any) {
      console.error('Error in getOrderById:', error);
      return { success: false, error: error.message || 'Failed to fetch order' };
    }
  }

  // Convert Supabase order to local Order type
  static convertToLocalOrder(supabaseOrder: SupabaseOrder): Order {
    return {
      id: supabaseOrder.id,
      orderNumber: supabaseOrder.order_number,
      status: supabaseOrder.status,
      createdAt: new Date(supabaseOrder.created_at),
      estimatedDeliveryTime: supabaseOrder.estimated_delivery_time,
      items: supabaseOrder.items,
      customerDetails: supabaseOrder.customer_details,
      deliveryAddress: supabaseOrder.delivery_address,
      pricing: supabaseOrder.pricing,
      restaurant: supabaseOrder.restaurant_info,
      tracking: supabaseOrder.tracking ? {
        orderPlaced: supabaseOrder.tracking.orderPlaced ? new Date(supabaseOrder.tracking.orderPlaced) : undefined,
        confirmed: supabaseOrder.tracking.confirmed ? new Date(supabaseOrder.tracking.confirmed) : undefined,
        preparing: supabaseOrder.tracking.preparing ? new Date(supabaseOrder.tracking.preparing) : undefined,
        ready: supabaseOrder.tracking.ready ? new Date(supabaseOrder.tracking.ready) : undefined,
        outForDelivery: supabaseOrder.tracking.outForDelivery ? new Date(supabaseOrder.tracking.outForDelivery) : undefined,
        delivered: supabaseOrder.tracking.delivered ? new Date(supabaseOrder.tracking.delivered) : undefined,
      } : undefined
    };
  }
} 