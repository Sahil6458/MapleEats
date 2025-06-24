import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User, Phone, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
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
  const { clearCart } = useCart();
  const [showAddressError, setShowAddressError] = useState(false);
  
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
    sendOTP,
    verifyOTP,
    updateCustomerDetails,
    resetCheckout,
    goToStep
  } = useCheckout();

  const handleSendOTP = async () => {
    if (!customerDetails.phone) {
      return;
    }

    const result = await sendOTP(customerDetails.phone);
    if (result.success) {
      setCurrentStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return;
    }

    const result = await verifyOTP(customerDetails.phone, otp);
    if (result.success) {
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setCurrentStep('success');
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
      resetCheckout();
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    resetCheckout();
    setShowAddressError(false);
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
            onChange={(e) => updateCustomerDetails({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={customerDetails.email}
            onChange={(e) => updateCustomerDetails({ email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={customerDetails.phone}
            onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1234567890"
            required
          />
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
            placeholder="Any special instructions for delivery..."
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={() => goToStep('address')}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={() => goToStep('phone')}
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
        
        {useFallback && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
            <p className="text-amber-800 text-sm font-medium">
              🔧 Testing Mode: Use "123456" as the verification code
            </p>
          </div>
        )}
        
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => {
                const newOtp = otp.split('');
                newOtp[index] = e.target.value;
                setOtp(newOtp.join(''));
                
                // Auto-focus next input
                if (e.target.value && index < 5) {
                  const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                  nextInput?.focus();
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
        <div className={`p-3 rounded-lg border ${useFallback ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${useFallback ? 'text-amber-800' : 'text-red-800'}`}>{error}</p>
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
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium mb-2">Order Summary</h4>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Amount:</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-green-800 text-sm">
          ✓ Phone number verified successfully
        </p>
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
        >
          {loading ? 'Placing Order...' : 'Place Order'}
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