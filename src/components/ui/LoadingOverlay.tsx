import React, { useEffect, useState } from 'react';
import Loader from './Loader';

interface LoadingOverlayProps {
  isVisible: boolean;
  timeout?: number; // max time in ms
  onTimeout?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  timeout = 5000, 
  onTimeout 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
        if (onTimeout) onTimeout();
      }, timeout);
    } else {
      setShow(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, timeout, onTimeout]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 lg:left-64 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-[6px] transition-all duration-500">
      <div className="flex flex-col items-center justify-center">
        <Loader />
      </div>
    </div>
  );
};

export default LoadingOverlay;
