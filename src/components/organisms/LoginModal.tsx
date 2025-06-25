import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Check, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

type LoginStep = 'phone' | 'otp' | 'profile' | 'success';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { signInWithPhone, verifyOTP, updateUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signInWithPhone(phone);
    
    if (result.success) {
      setCurrentStep('otp');
    } else {
      setError(result.error || 'Failed to send OTP');
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyOTP(phone, otp);
    
    if (result.success && result.user) {
      // Check if user has profile information
      if (!result.user.name || !result.user.email) {
        setCurrentStep('profile');
      } else {
        setCurrentStep('success');
        setTimeout(() => {
          onLoginSuccess?.();
          handleClose();
        }, 2000);
      }
    } else {
      setError(result.error || 'Invalid OTP');
    }
    
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    const result = await updateUserProfile(profile);
    
    if (result.success) {
      setCurrentStep('success');
      setTimeout(() => {
        onLoginSuccess?.();
        handleClose();
      }, 2000);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    setCurrentStep('phone');
    setPhone('');
    setOtp('');
    setProfile({ name: '', email: '' });
    setError('');
    setLoading(false);
    onClose();
  };

  const renderPhoneStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="text-blue-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to MapleEats</h3>
        <p className="text-gray-600">Enter your phone number to get started</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError('');
          }}
          className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1234567890"
          disabled={loading}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={handleSendOTP}
        loading={loading}
        disabled={loading || !phone.trim()}
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Phone</h3>
        <p className="text-gray-600">
          Enter the 6-digit code sent to <strong>{phone}</strong>
        </p>
      </div>

      {/* Test Mode Notice */}
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
              const value = e.target.value.replace(/[^0-9]/g, '');
              const newOtp = otp.split('');
              newOtp[index] = value;
              setOtp(newOtp.join(''));
              
              if (error) setError('');
              
              // Auto-focus next input
              if (value && index < 5) {
                const nextInput = (e.target as HTMLInputElement).parentElement?.children[index + 1] as HTMLInputElement;
                nextInput?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[index] && index > 0) {
                const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                prevInput?.focus();
              }
            }}
            className={`w-12 h-12 text-center text-lg font-semibold border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-3">
        <Button
          variant="primary"
          fullWidth
          onClick={handleVerifyOTP}
          loading={loading}
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <button
          onClick={() => setCurrentStep('phone')}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
          disabled={loading}
        >
          Change phone number
        </button>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-purple-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
        <p className="text-gray-600">Help us personalize your experience</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, name: e.target.value }));
              if (error) setError('');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => {
              setProfile(prev => ({ ...prev, email: e.target.value }));
              if (error) setError('');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button
        variant="primary"
        fullWidth
        onClick={handleUpdateProfile}
        loading={loading}
        disabled={loading || !profile.name.trim() || !profile.email.trim()}
      >
        {loading ? 'Saving...' : 'Complete Profile'}
      </Button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="text-green-600" size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-green-800">Welcome to MapleEats!</h3>
      
      <p className="text-gray-600">
        You're successfully logged in. Enjoy ordering your favorite food!
      </p>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone':
        return renderPhoneStep();
      case 'otp':
        return renderOTPStep();
      case 'profile':
        return renderProfileStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderPhoneStep();
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
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentStep === 'success' ? 'Success!' : 'Login'}
              </h2>
              {currentStep !== 'success' && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close login"
                  disabled={loading}
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {renderCurrentStep()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal; 