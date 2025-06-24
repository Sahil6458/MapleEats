import { useState, useEffect } from 'react';
import { calculateCartTotals, CartCalculationRequest, CartCalculationResponse } from '../services/api/cartService';

interface UseCartCalculationProps {
  subtotal: number;
  deliveryAddress?: CartCalculationRequest['deliveryAddress'];
  restaurantId?: string;
  addressId?: number;
  autoCalculate?: boolean; // Whether to auto-calculate when subtotal changes
}

export const useCartCalculation = ({
  subtotal,
  deliveryAddress,
  restaurantId,
  addressId,
  autoCalculate = true
}: UseCartCalculationProps) => {
  const [calculation, setCalculation] = useState<CartCalculationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotals = async (customSubtotal?: number) => {
    const requestSubtotal = customSubtotal ?? subtotal;
    
    if (requestSubtotal <= 0) {
      setCalculation(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const request: CartCalculationRequest = {
        subtotal: requestSubtotal,
        deliveryAddress,
        restaurantId,
        addressId
      };

      const result = await calculateCartTotals(request);
      setCalculation(result);
      
    } catch (err) {
      setError('Failed to calculate cart totals');
      console.error('Cart calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (autoCalculate && subtotal > 0) {
      calculateTotals();
    }
  }, [subtotal, deliveryAddress, restaurantId, addressId, autoCalculate]);

  // Manual calculation trigger
  const recalculate = () => {
    calculateTotals();
  };

  // Get formatted breakdown for display
  const getFormattedBreakdown = () => {
    if (!calculation?.data) return null;

    const { data } = calculation;
    
    return {
      subtotal: {
        label: 'Subtotal',
        amount: data.subtotal,
        formatted: `$${data.subtotal.toFixed(2)}`
      },
      tax: {
        label: `Tax (${data.tax.rate.toFixed(1)}%)`,
        amount: data.tax.amount,
        formatted: `$${data.tax.amount.toFixed(2)}`,
        breakdown: [
          {
            label: 'State Tax',
            amount: data.tax.breakdown.stateTax,
            formatted: `$${data.tax.breakdown.stateTax.toFixed(2)}`
          },
          {
            label: 'Local Tax',
            amount: data.tax.breakdown.localTax,
            formatted: `$${data.tax.breakdown.localTax.toFixed(2)}`
          }
        ]
      },
      deliveryFee: {
        label: 'Delivery Fee',
        amount: data.deliveryFee.amount,
        formatted: `$${data.deliveryFee.amount.toFixed(2)}`,
        breakdown: [
          {
            label: 'Base Fee',
            amount: data.deliveryFee.baseFee,
            formatted: `$${data.deliveryFee.baseFee.toFixed(2)}`
          },
          {
            label: 'Distance Fee',
            amount: data.deliveryFee.distanceFee,
            formatted: `$${data.deliveryFee.distanceFee.toFixed(2)}`
          },
          {
            label: 'Service Fee',
            amount: data.deliveryFee.serviceFee,
            formatted: `$${data.deliveryFee.serviceFee.toFixed(2)}`
          }
        ]
      },
      fees: {
        label: 'Fees & Charges',
        amount: data.fees.platformFee + (data.fees.smallOrderFee || 0),
        formatted: `$${(data.fees.platformFee + (data.fees.smallOrderFee || 0)).toFixed(2)}`,
        breakdown: [
          {
            label: 'Platform Fee',
            amount: data.fees.platformFee,
            formatted: `$${data.fees.platformFee.toFixed(2)}`
          },
          ...(data.fees.smallOrderFee ? [{
            label: 'Small Order Fee',
            amount: data.fees.smallOrderFee,
            formatted: `$${data.fees.smallOrderFee.toFixed(2)}`
          }] : [])
        ]
      },
      total: {
        label: 'Total',
        amount: data.total,
        formatted: `$${data.total.toFixed(2)}`
      },
      estimatedDeliveryTime: data.estimatedDeliveryTime
    };
  };

  // Check if small order fee applies
  const hasSmallOrderFee = calculation?.data?.fees?.smallOrderFee && calculation.data.fees.smallOrderFee > 0;
  const smallOrderThreshold = 15; // Static for now

  return {
    calculation,
    loading,
    error,
    recalculate,
    calculateTotals,
    formattedBreakdown: getFormattedBreakdown(),
    hasSmallOrderFee,
    smallOrderThreshold,
    // Quick access to common values
    subtotal: calculation?.data?.subtotal || 0,
    tax: calculation?.data?.tax?.amount || 0,
    deliveryFee: calculation?.data?.deliveryFee?.amount || 0,
    total: calculation?.data?.total || 0,
    estimatedDeliveryTime: calculation?.data?.estimatedDeliveryTime || "25-35 min"
  };
}; 