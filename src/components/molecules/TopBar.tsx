import React, { useState } from 'react';
import { ArrowLeft, Package, User, LogOut } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import PendingOrdersPanel from '../organisms/PendingOrdersPanel';
import LoginModal from '../organisms/LoginModal';
import UserProfileModal from '../organisms/UserProfileModal';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title = "MapleEats",
  subtitle = "Fresh Food Delivered",
  showBackButton = false,
  onBackClick,
  className = ""
}) => {
  const { getPendingOrders } = useOrders();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const pendingOrdersCount = getPendingOrders().length;
  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center space-x-3">
            {showBackButton && onBackClick ? (
              <button
                onClick={onBackClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
            ) : (
              <div className="w-16 h-10 flex-shrink-0">
                <img 
                  src="https://i.postimg.cc/DfBx7GQF/Adobe-Express-file.png" 
                  alt="MapleEats Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Fallback to a simple colored div with initials if image fails
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm rounded-lg';
                    fallback.textContent = 'ME';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            )}
            
            {/* Brand Text */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>

          {/* Mobile Brand Text */}
          <div className="sm:hidden">
            <h1 className="text-base font-bold text-gray-900">{title}</h1>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-2">
            {pendingOrdersCount > 0 && (
              <button
                onClick={() => setShowOrdersPanel(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="View pending orders"
              >
                <Package size={24} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingOrdersCount}
                </span>
              </button>
            )}
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.phone}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User size={14} />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <User size={16} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Pending Orders Panel */}
      <PendingOrdersPanel
        isOpen={showOrdersPanel}
        onClose={() => setShowOrdersPanel(false)}
      />
      
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          setShowUserMenu(false);
        }}
      />
      
      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};

export default TopBar; 