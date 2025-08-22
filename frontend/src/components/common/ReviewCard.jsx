import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ review, type = 'counsellor' }) => {
  // Get user info from the review
  const userName = review.studentId?.name || 'Student';
  const userInitial = userName.charAt(0).toUpperCase();
  const isAnonymous = review.isAnonymous;
  const displayName = isAnonymous ? 'Anonymous' : userName;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get subtle border color based on rating
  const getBorderColor = (rating) => {
    if (rating >= 4) return 'border-l-green-200 dark:border-l-green-800';
    if (rating === 3) return 'border-l-yellow-200 dark:border-l-yellow-800';
    return 'border-l-red-200 dark:border-l-red-800';
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 border-l-4 ${getBorderColor(
        review.rating
      )} shadow-sm rounded-lg p-4 hover:shadow-md transition-all duration-200`}
    >
      {/* Header with Avatar, Name, Date, and Rating */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 flex-shrink-0">
          {isAnonymous ? 'A' : userInitial}
        </div>
        
        {/* User Info and Rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
              {displayName}
            </div>
            <div className="flex items-center gap-1 ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-3 h-3 ${
                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(review.createdAt)}
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        "{review.comment}"
      </div>
    </div>
  );
};

export default ReviewCard; 