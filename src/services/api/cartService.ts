import axios from './axios';

const MOCK_API_BASE_URL = 'https://mpebb4a821df73b62188.free.beeceptor.com';

export interface CartCalculationRequest {
  subtotal: number;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  restaurantId?: string;
  addressId?: number;
}

export interface CartCalculationResponse {
  success: boolean;
  data: {
    subtotal: number;
    tax: {
      amount: number;
      rate: number; // percentage
      breakdown: {
        stateTax: number;
        localTax: number;
        serviceTax?: number;
      };
    };
    deliveryFee: {
      amount: number;
      baseFee: number;
      distanceFee: number;
      serviceFee: number;
      peakTimeSurcharge?: number;
    };
    fees: {
      platformFee: number;
      smallOrderFee?: number;
    };
    total: number;
    estimatedDeliveryTime: string; // e.g., "25-35 min"
  };
  message?: string;
}

// Static fallback calculation (for when API fails)
const calculateStaticFees = (request: CartCalculationRequest): CartCalculationResponse => {
  const { subtotal } = request;
  
  // Static tax calculation (13% HST for Ontario, Canada)
  const taxRate = 0.13;
  const stateTaxRate = 0.08;
  const localTaxRate = 0.05;
  
  const stateTax = subtotal * stateTaxRate;
  const localTax = subtotal * localTaxRate;
  const totalTax = stateTax + localTax;
  
  // Static delivery fee calculation
  const baseFee = 2.99;
  const distanceFee = 1.50; // Assuming medium distance
  const serviceFee = 1.99;
  const totalDeliveryFee = baseFee + distanceFee + serviceFee;
  
  // Platform fees
  const platformFee = 1.49;
  const smallOrderFee = subtotal < 15 ? 2.99 : 0;
  
  const total = subtotal + totalTax + totalDeliveryFee + platformFee + smallOrderFee;
  
  return {
    success: true,
    data: {
      subtotal,
      tax: {
        amount: totalTax,
        rate: taxRate * 100,
        breakdown: {
          stateTax,
          localTax
        }
      },
      deliveryFee: {
        amount: totalDeliveryFee,
        baseFee,
        distanceFee,
        serviceFee
      },
      fees: {
        platformFee,
        ...(smallOrderFee > 0 && { smallOrderFee })
      },
      total,
      estimatedDeliveryTime: "25-35 min"
    }
  };
};

// API call to calculate cart totals
export const calculateCartTotals = async (request: CartCalculationRequest): Promise<CartCalculationResponse> => {
  try {
    console.log('🧮 Calculating cart totals via API...', request);
    
    const response = await axios.post(`${MOCK_API_BASE_URL}/api/cart/calculate`, request);
    
    // Handle different response structures
    if (response.data.success) {
      console.log('✅ Cart calculation successful from API');
      return response.data;
    } else {
      throw new Error('API returned unsuccessful response');
    }
    
  } catch (error) {
    console.warn('⚠️ Cart calculation API failed, using static calculation:', error);
    
    // Fallback to static calculation
    return calculateStaticFees(request);
  }
};

// Get delivery fee estimate (lighter API call)
export const getDeliveryEstimate = async (addressId: number, restaurantId?: string): Promise<{
  deliveryFee: number;
  estimatedTime: string;
  available: boolean;
}> => {
  try {
    const response = await axios.get(`${MOCK_API_BASE_URL}/api/delivery/estimate`, {
      params: { addressId, restaurantId }
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('API returned unsuccessful response');
    }
    
  } catch (error) {
    console.warn('⚠️ Delivery estimate API failed, using static values:', error);
    
    // Static fallback
    return {
      deliveryFee: 6.48, // baseFee + distanceFee + serviceFee
      estimatedTime: "25-35 min",
      available: true
    };
  }
};

// Validate delivery address
export const validateDeliveryAddress = async (address: CartCalculationRequest['deliveryAddress']): Promise<{
  valid: boolean;
  normalized?: CartCalculationRequest['deliveryAddress'];
  suggestions?: CartCalculationRequest['deliveryAddress'][];
  message?: string;
}> => {
  try {
    const response = await axios.post(`${MOCK_API_BASE_URL}/api/address/validate`, { address });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('API returned unsuccessful response');
    }
    
  } catch (error) {
    console.warn('⚠️ Address validation API failed, assuming valid:', error);
    
    // Static fallback - assume address is valid
    return {
      valid: true,
      normalized: address,
      message: "Address validation unavailable - using provided address"
    };
  }
};

// OTP Services for Checkout
export const sendCheckoutOTP = async (phone: string) => {
  try {
    const response = await axios.post('/customer/send-checkout-otp/', {
      phone: phone
    });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyCheckoutOTP = async (phone: string, otp: string) => {
  try {
    const response = await axios.post('/customer/verify-checkout-otp/', {
      phone: phone,
      otp: otp
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}; 