import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Clock, Package, MapPin, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OrderService } from '../../services/orderService';
import { Order as SupabaseOrder } from '../../lib/supabase';
import { Order } from '../../types';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchUserOrders();
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [isOpen, user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await OrderService.getUserOrders(user.id);
      if (result.success && result.orders) {
        const convertedOrders = result.orders.map(OrderService.convertToLocalOrder);
        setOrders(convertedOrders);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    const result = await updateUserProfile(profileData);
    
    if (result.success) {
      setEditMode(false);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: Order['status']) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!user) return null;

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
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close profile"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Profile Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.name || 'User'}
                    </h3>
                    <p className="text-gray-600">{user.phone}</p>
                  </div>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => {
                          setProfileData(prev => ({ ...prev, name: e.target.value }));
                          if (error) setError('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => {
                          setProfileData(prev => ({ ...prev, email: e.target.value }));
                          if (error) setError('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        variant="primary"
                        onClick={handleUpdateProfile}
                        loading={loading}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditMode(false);
                          setError('');
                          setProfileData({
                            name: user.name || '',
                            email: user.email || ''
                          });
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-700">{user.email || 'Not provided'}</span>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setEditMode(true)}
                        className="flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>Edit Profile</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                  <Badge variant="secondary" className="text-xs">
                    {orders.length} orders
                  </Badge>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 mt-2">No orders yet</p>
                    <p className="text-sm text-gray-500">Your order history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Receipt size={16} className="text-gray-400" />
                            <span className="font-medium text-gray-900">
                              #{order.orderNumber}
                            </span>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock size={14} />
                            <span>{order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin size={14} />
                            <span>{order.deliveryAddress.address}, {order.deliveryAddress.city}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            <span className="font-semibold text-gray-900">
                              ${order.pricing.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal; 