import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { ProfilePicture } from '../common/ImageComponent';

const CounsellorCard = ({ counsellor }) => {

  const profile = {
    id: counsellor._id || counsellor.id,
    name: counsellor.counsellor?.name || counsellor.name || 'N/A',
    topics: counsellor.topics || [],
    rating: counsellor.counsellor?.rating || counsellor.rating || 4.5,
    image: counsellor.profilePicture || counsellor.image || '',
    experience: counsellor.experience || 0,
    status: counsellor.status || 'Available',
  };
  

  return (
    <Link to={`/counsellors/${profile.id}`} className="block">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 max-w-xs mx-auto flex flex-col">
        {/* Profile Image */}
        <div className="mb-4 flex justify-center">
          <ProfilePicture
            src={profile.image}
            alt={profile.name}
            size="md"
            showStatus={true}
            status={profile.status}
            showRating={true}
            rating={profile.rating}
          />
        </div>

        {/* Content */}
        <div className="text-center flex-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{profile.name}</h3>
          
          {/* Experience */}
          <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-300 mb-3">
            <FaClock className="text-primary" />
            <span>{profile.experience} years experience</span>
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {profile.topics.length > 0 ? (
              profile.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {topic}
                </span>
              ))
            ) : (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                Personal Counselling
              </span>
            )}
          </div>
        </div>
        {/* View Profile Button */}
        <div className="mt-2">
          <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CounsellorCard; 