import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

// You'll need to download a loading animation JSON file
// For now, we'll use a URL to a loading animation from LottieFiles
const defaultLoadingAnimationUrl = 'https://assets5.lottiefiles.com/packages/lf20_usmfx6bp.json';

interface LoadingAnimationProps {
  text?: string;
  animationData?: any;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = 'Loading restaurants near you...', 
  animationData 
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-48 h-48 mb-4">
        <Lottie 
          animationData={animationData} 
          loop={true}
          autoplay={true}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
          src={!animationData ? defaultLoadingAnimationUrl : undefined}
        />
      </div>
      <motion.p 
        className="text-lg text-gray-600 font-medium text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export default LoadingAnimation;
