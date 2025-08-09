import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Alert = ({ message, type = 'info', onDismiss }) => {
  // Automatically dismiss the alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // onDismiss();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const alertStyles = {
    info: 'bg-sky-100 border-sky-400 text-sky-800',
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
  };
  
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-24 right-6 w-full max-w-sm p-4 rounded-lg border-l-4 shadow-xl z-50 ${alertStyles[type]}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{message}</p>
              {type === 'login_required' && (
                <div className="mt-2 text-sm">
                  <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-600">
                    Login Now →
                  </Link>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button onClick={onDismiss} className="inline-flex rounded-md p-1.5 text-current hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-50">
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;