import React from 'react';
import { FaUser } from 'react-icons/fa';

// Profile Picture Component
export const ProfilePicture = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '', 
  showStatus = false, 
  status = 'Available',
  showRating = false,
  rating = 4.5 
}) => {
  // Backend URL configuration
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const backendUrl = isLocalhost ? 'http://localhost:5000' : 'https://zegnite-backend2.onrender.com';
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-white border-4 border-primary/20 shadow-lg`}>
        {src ? (
          <img 
            src={src.startsWith('http') ? src : `${backendUrl}${src}`} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center text-slate-400 ${src ? 'hidden' : 'flex'}`}>
          <FaUser className={iconSizes[size]} />
        </div>
      </div>
      
      {/* Status Badge */}
      {showStatus && (
        <div className="absolute -top-2 -right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            status === 'Available' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'
          } shadow-md`}>
            {status}
          </span>
        </div>
      )}
      
      {/* Rating Badge */}
      {showRating && (
        <div className="absolute -top-2 -left-2 bg-white dark:bg-slate-700 rounded-full px-2 py-1 shadow-md">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-slate-800 dark:text-white">{rating}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Banner Image Component
export const BannerImage = ({ 
  src, 
  alt = 'Banner', 
  height = 'h-64 md:h-80',
  className = '',
  showOverlay = true,
  children 
}) => {
  return (
    <div className={`relative w-full ${height} overflow-hidden ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
      ) : null}
      
      {/* Default Banner with EdTech Theme */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 ${src ? 'hidden' : 'block'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Shadow Overlay for Contrast */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      )}
      
      {/* Children Content */}
      {children}
    </div>
  );
};

// Dashboard Profile Picture Component
export const DashboardProfilePicture = ({ 
  src, 
  alt, 
  size = 'md',
  className = '' 
}) => {
  // Backend URL configuration
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const backendUrl = isLocalhost ? 'http://localhost:5000' : 'https://zegnite-backend2.onrender.com';
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center ${className}`}>
      {src ? (
        <img 
          src={src.startsWith('http') ? src : `${backendUrl}${src}`} 
          alt={alt} 
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={`w-full h-full flex items-center justify-center text-white ${src ? 'hidden' : 'flex'}`}>
        <FaUser className={iconSizes[size]} />
      </div>
    </div>
  );
};

export default {
  ProfilePicture,
  BannerImage,
  DashboardProfilePicture
}; 