import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User, Phone, CreditCard, Check, AlertCircle, Banknote } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useCheckout } from '../../hooks/useCheckout';
import Button from '../atoms/Button';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryAddress?: {
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  orderTotal: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  deliveryAddress,
  orderTotal
}) => {
  const { items, clearCart, subtotal } = useCart();
  const { addOrder } = useOrders();
  const { user, isAuthenticated, createOrLoginUser, verifyOTP: authVerifyOTP } = useAuth();
  const [showAddressError, setShowAddressError] = useState(false);
  const [accountStep, setAccountStep] = useState<'none' | 'otp_required' | 'completed'>('none');
  const [pendingUserData, setPendingUserData] = useState<{ phone: string; name: string; email: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const {
    currentStep,
    customerDetails,
    otp,
    otpSent,
    loading,
    error,
    useFallback,
    setCurrentStep,
    setOtp,
    setLoading,
    setError,
    sendOTP,
    verifyOTP,
    updateCustomerDetails,
    resetCheckout,
    goToStep
  } = useCheckout();

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    if (phone.replace(/[\s\-\(\)]/g, '').length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    errors.name = validateName(customerDetails.name);
    errors.email = validateEmail(customerDetails.email);
    errors.phone = validatePhone(customerDetails.phone);
    
    // Remove empty error messages
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if user exists and handle account creation/login
    const accountResult = await createOrLoginUser({
      phone: customerDetails.phone,
      name: customerDetails.name,
      email: customerDetails.email
    });

    if (accountResult.success && accountResult.requiresOTP) {
      setPendingUserData({
        phone: customerDetails.phone,
        name: customerDetails.name,
        email: customerDetails.email
      });
      setAccountStep('otp_required');
      setCurrentStep('otp');
    } else if (accountResult.error) {
      setError(accountResult.error);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return;
    }

    const result = await authVerifyOTP(
      customerDetails.phone, 
      otp, 
      pendingUserData ? { 
        name: pendingUserData.name, 
        email: pendingUserData.email 
      } : undefined
    );
    
    if (result.success) {
      setAccountStep('completed');
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Create the order (works for both authenticated and non-authenticated users)
      const newOrder = await addOrder({
        status: 'pending',
        estimatedDeliveryTime: '25-35 min',
        items: items,
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          deliveryInstructions: customerDetails.deliveryInstructions
        },
        deliveryAddress: {
          address: deliveryAddress?.address || '',
          city: deliveryAddress?.city || '',
          pincode: deliveryAddress?.pincode || '',
          phone: customerDetails.phone
        },
        pricing: {
          subtotal: subtotal,
          tax: orderTotal * 0.13, // Assuming 13% tax
          deliveryFee: 2.99,
          fees: 1.99, // Platform fee
          total: orderTotal
        },
        restaurant: {
          id: 'restaurant_1',
          name: 'MapleEats Restaurant'
        }
      }, user?.id); // Pass user ID if authenticated, undefined if not

      console.log('Order created:', newOrder);
      
      // Show success step
      setCurrentStep('success');
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
        resetCheckout();
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to create order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetCheckout();
    setShowAddressError(false);
    setValidationErrors({});
    onClose();
  };

  const handleChangeAddress = () => {
    setShowAddressError(true);
    // Hide the error after 5 seconds
    setTimeout(() => {
      setShowAddressError(false);
    }, 5000);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'address', label: 'Address', icon: MapPin },
      { key: 'details', label: 'Details', icon: User },
      { key: 'phone', label: 'Phone', icon: Phone },
      { key: 'otp', label: 'Verify', icon: Check },
      { key: 'payment', label: 'Payment', icon: CreditCard }
    ];

    const stepIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isCompleted = index < stepIndex;
          
          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isActive 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : isCompleted 
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'}
                `}
              >
                <Icon size={16} />
              </div>
              <span className={`ml-2 text-sm ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAddressStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Confirm Delivery Address</h3>
      
      {deliveryAddress ? (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-start space-x-3">
            <MapPin className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="font-medium">{deliveryAddress.address}</p>
              <p className="text-gray-600">{deliveryAddress.city}, {deliveryAddress.pincode}</p>
              {deliveryAddress.phone && (
                <p className="text-gray-600 text-sm">Contact: {deliveryAddress.phone}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-amber-800">No delivery address found. Please go back and select a delivery location.</p>
        </div>
      )}

      {/* Address Change Error */}
      {showAddressError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-red-800">Change Address Unavailable</p>
              <p className="text-red-700 text-sm">
                Sorry, changing the delivery address during checkout is currently unavailable. 
                Please cancel this order and start a new one with the correct address.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={handleChangeAddress}>
          Change Address
        </Button>
        <Button 
          variant="primary" 
          onClick={() => goToStep('details')}
          disabled={!deliveryAddress}
        >
          Confirm Address
        </Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={customerDetails.name}
            onChange={(e) => {
              updateCustomerDetails({ name: e.target.value });
              // Clear validation error when user starts typing
              if (validationErrors.name) {
                setValidationErrors(prev => ({ ...prev, name: '' }));
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            required
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={customerDetails.email}
            onChange={(e) => {
              updateCustomerDetails({ email: e.target.value });
              // Clear validation error when user starts typing
              if (validationErrors.email) {
                setValidationErrors(prev => ({ ...prev, email: '' }));
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            required
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={customerDetails.phone}
            onChange={(e) => {
              updateCustomerDetails({ phone: e.target.value });
              // Clear validation error when user starts typing
              if (validationErrors.phone) {
                setValidationErrors(prev => ({ ...prev, phone: '' }));
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+1234567890"
            required
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Instructions (Optional)
          </label>
          <textarea
            value={customerDetails.deliveryInstructions}
            onChange={(e) => updateCustomerDetails({ deliveryInstructions: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="e.g., Ring the doorbell, Leave at door, Building entrance code, etc."
            maxLength={200}
          />
          <p className="mt-1 text-xs text-gray-500">
            Help our delivery person find you easily (max 200 characters)
          </p>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={() => goToStep('address')}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            if (validateForm()) {
              goToStep('phone');
            }
          }}
          disabled={!customerDetails.name || !customerDetails.email || !customerDetails.phone}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderPhoneStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Verify Phone Number</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          We'll send a verification code to <strong>{customerDetails.phone}</strong> to confirm your order.
        </p>
      </div>

      {error && (
        <div className={`p-3 rounded-lg border ${useFallback ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${useFallback ? 'text-amber-800' : 'text-red-800'}`}>{error}</p>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={() => goToStep('details')}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSendOTP}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </Button>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Enter Verification Code</h3>
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Enter the 6-digit code sent to <strong>{customerDetails.phone}</strong>
        </p>
        
        {accountStep === 'otp_required' && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
            <p className="text-blue-800 text-sm font-medium">
              {pendingUserData ? 
                "🎉 Creating your account! Your order will be saved to your profile." :
                "👋 Welcome back! Logging you into your account."
              }
            </p>
          </div>
        )}
        
        {/* Test Mode Notice - Always show for now */}
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-amber-600">🧪</span>
            <div>
              <p className="text-amber-800 text-sm font-medium">Test Mode Active</p>
              <p className="text-amber-700 text-xs">Use "123456" as the verification code</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                const newOtp = otp.split('');
                newOtp[index] = value;
                setOtp(newOtp.join(''));
                
                // Auto-focus next input
                if (value && index < 5) {
                  const nextInput = (e.target as HTMLInputElement).parentElement?.children[index + 1] as HTMLInputElement;
                  nextInput?.focus();
                }
                
                // Auto-focus previous input on backspace
                if (!value && index > 0) {
                  const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                  prevInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                // Handle backspace to move to previous input
                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                  const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                  prevInput?.focus();
                }
              }}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleSendOTP}
          className="text-blue-600 hover:text-blue-700 text-sm underline"
          disabled={loading}
        >
          Resend Code
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">❌</span>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={() => goToStep('phone')}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleVerifyOTP}
          loading={loading}
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Payment & Order Summary</h3>
      
      {/* Payment Method */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Payment Method</h4>
        <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Banknote className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">Cash on Delivery</p>
              <p className="text-sm text-green-700">Pay when your order arrives</p>
            </div>
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="text-white" size={14} />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          💡 Currently, we only accept cash payments upon delivery. Please have the exact amount ready.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (13%)</span>
            <span>${(orderTotal * 0.13).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>$1.99</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      {isAuthenticated && user ? (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Check className="text-green-600" size={16} />
            <p className="text-green-800 text-sm font-medium">
              Account verified: {user.name || user.phone}
            </p>
          </div>
        </div>
      ) : accountStep === 'completed' ? (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <Check className="text-blue-600" size={16} />
            <p className="text-blue-800 text-sm font-medium">
              Account created! Your order will be saved to your profile.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="text-gray-600" size={16} />
            <p className="text-gray-700 text-sm font-medium">
              Order as guest (no account required)
            </p>
          </div>
        </div>
      )}
      


      {/* Delivery Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <MapPin className="text-blue-600 mt-0.5" size={16} />
          <div>
            <p className="text-blue-800 text-sm font-medium">Delivery Address</p>
            <p className="text-blue-700 text-sm">
              {deliveryAddress?.address}
            </p>
            <p className="text-blue-700 text-sm">
              {deliveryAddress?.city}, {deliveryAddress?.pincode}
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={() => goToStep('otp')}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Banknote size={16} />
          <span>
            {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
          </span>
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="text-green-600" size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-green-800">Order Placed Successfully!</h3>
      
      <p className="text-gray-600">
        Your order has been confirmed and will be delivered to your address shortly.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="text-sm text-gray-700">
          <strong>Delivery Address:</strong><br />
          {deliveryAddress?.address}<br />
          {deliveryAddress?.city}, {deliveryAddress?.pincode}
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'address':
        return renderAddressStep();
      case 'details':
        return renderDetailsStep();
      case 'phone':
        return renderPhoneStep();
      case 'otp':
        return renderOTPStep();
      case 'payment':
        return renderPaymentStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderAddressStep();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={currentStep === 'success' ? undefined : handleClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentStep === 'success' ? 'Order Confirmation' : 'Checkout'}
              </h2>
              {currentStep !== 'success' && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close checkout"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {currentStep !== 'success' && renderStepIndicator()}
              {renderCurrentStep()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal; 