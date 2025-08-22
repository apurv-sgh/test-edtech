import React from 'react';
import { FaCalendar, FaClock, FaUsers, FaPlay, FaEye } from 'react-icons/fa';

const WebinarCard = ({ seminar, onRegister, isRegistered = false }) => {
  // Generate random student count between 50-100
  const studentCount = Math.floor(Math.random() * 51) + 50;
  
  // Generate random view count between 200-500
  const viewCount = Math.floor(Math.random() * 301) + 200;

  // Format date/time badge (e.g., 'THU 3:30 AM')
  const dateObj = new Date(seminar.date + 'T' + seminar.time);
  const day = dateObj.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const time = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateBadge = `${day} ${time}`;

  return (
    <div className="w-80 min-w-[320px] max-w-xs bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
      {/* Banner Image - YouTube Style */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute bottom-6 left-8 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaPlay className="text-purple-600 text-xl ml-1" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Date Badge */}
          <div className="bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-purple-300" />
              <span>{dateBadge}</span>
            </div>
          </div>
          
          {/* Price Badge */}
          <div className="bg-white bg-opacity-95 text-purple-600 px-3 py-2 rounded-lg text-sm font-bold shadow-lg">
            {seminar.fee > 0 ? `₹${seminar.fee}` : 'Free'}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-black bg-opacity-60 px-2 py-1 rounded">
                <FaClock className="text-purple-300" />
                <span>{seminar.time}</span>
              </div>
              <div className="flex items-center gap-1 bg-black bg-opacity-60 px-2 py-1 rounded">
                <FaEye className="text-purple-300" />
                <span>{viewCount} views</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black bg-opacity-60 px-2 py-1 rounded">
              <FaUsers className="text-purple-300" />
              <span>{studentCount}+ registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {seminar.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
          {seminar.description}
        </p>

        {/* Expert Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <span className="text-purple-600 dark:text-purple-300 font-semibold text-sm">
              {seminar.expertName ? seminar.expertName.charAt(0) : 'E'}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-white">
              {seminar.expertName || 'Industry Expert'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {seminar.expertCompany || 'Leading Company'}
            </div>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={onRegister}
          disabled={isRegistered}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            isRegistered 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 transform'
          }`}
        >
          {isRegistered ? (
            <>
              <FaCalendar className="w-4 h-4" />
              Already Registered
            </>
          ) : (
            <>
              <FaCalendar className="w-4 h-4" />
              Register Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WebinarCard;