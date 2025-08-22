import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaBuilding } from 'react-icons/fa';
import { ProfilePicture } from '../common/ImageComponent';

const IndustryExpertCard = ({ expert }) => {
  // Use fallback/defaults for missing fields
  const profile = {
    id: expert._id || expert.id,
    name: expert.industryExpert?.name || expert.name || 'N/A',
    company: expert.company || expert.currentCompany || 'N/A',
    experience: expert.experience || 0,
    domain: expert.domain || 'N/A',
    skills: expert.skills || [],
    rating: expert.industryExpert?.rating || expert.rating || 4.5,
    image: expert.profilePicture || expert.image || '',
    status: expert.status || 'Available',
  };

  return (
    <Link to={`/industry-experts/${profile.id}`} className="block">
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
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{profile.name}</h3>
          
          {/* Company */}
          <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-300 mb-2">
            <FaBuilding className="text-primary" />
            <span>{profile.company}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-300 mb-3">
            <FaClock className="text-primary" />
            <span>{profile.experience} years experience</span>
          </div>

          {/* Domain */}
          <div className="flex justify-center mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {profile.domain}
            </span>
          </div>
          {/* Skills */}
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        {/* View Webinars Button */}
        <div className="mt-2">
          <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold transition-colors">
            View Webinars
          </button>
        </div>
      </div>
    </Link>
  );
};

export default IndustryExpertCard; 