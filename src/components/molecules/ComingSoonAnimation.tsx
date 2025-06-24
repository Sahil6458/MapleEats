import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ComingSoonAnimationProps {
  onRetry: () => void;
}

const ComingSoonAnimation: React.FC<ComingSoonAnimationProps> = ({ onRetry }) => {
  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onRetry();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onRetry]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <svg 
          className="w-32 h-32 mx-auto text-amber-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      </motion.div>
      
      <motion.h2
        className="text-2xl font-bold mb-4 text-gray-800"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        We're not in your area yet!
      </motion.h2>
      
      <motion.p
        className="text-lg text-gray-600 mb-8 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        We're expanding quickly and hope to deliver to your location soon. Please try a different location.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <button
          onClick={onRetry}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          Try Another Location
        </button>
      </motion.div>
      
      <motion.p
        className="text-sm text-gray-500 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Redirecting to location selection in a few seconds...
      </motion.p>
    </div>
  );
};

export default ComingSoonAnimation;
