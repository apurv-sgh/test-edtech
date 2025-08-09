import React, { useState } from 'react';
import { FaVideo, FaCommentDots, FaStar } from 'react-icons/fa';

const categories = [
  { key: 'videos', label: 'Videos', icon: <FaVideo /> },
  { key: 'doubt', label: 'Doubts', icon: <FaCommentDots /> },
  { key: 'ratings', label: 'Ratings', icon: <FaStar /> },
];

const mockData = {
  videos: [
    { id: 1, title: 'React Basics', date: '2025-07-10', duration: '12m' },
    { id: 2, title: 'HTML Basics', date: '2025-07-10', duration: '12m' }
  ],
  doubt: [
    { id: 1, text: 'Great explanation!', date: '2025-07-11', video: 'React Basics' },
    { id: 2, text: 'Loved the CSS tricks.', date: '2025-07-13', video: 'Advanced CSS' },
  ],
  ratings: [
    { id: 1, value: 5, date: '2025-07-11', video: 'React Basics' },
    { id: 2, value: 4, date: '2025-07-13', video: 'Advanced CSS' },
  ],
};

const gradientBg = "bg-gradient-to-br from-primary/10 via-blue-100/10 to-green-100/10 dark:from-primary/20 dark:via-blue-900/10 dark:to-green-900/10";

const Activity = () => {
  const [activeCategory, setActiveCategory] = useState('videos');

  return (
    <div className="bg-primary-light/60 dark:bg-dark-bg min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className={`rounded-3xl shadow-2xl p-8 ${gradientBg} relative overflow-hidden`}>
          {/* Decorative floating shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/20 rounded-full blur-2xl opacity-30 pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-10 text-center drop-shadow-lg">
            Your Activity
          </h1>
          <div className="flex justify-center gap-6 mb-10">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg shadow transition-all duration-200
                  ${activeCategory === cat.key
                    ? 'bg-primary text-white scale-105 shadow-lg'
                    : 'bg-white dark:bg-dark-card text-primary hover:bg-primary/10 hover:scale-105'
                  }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Category Content */}
            <div className="bg-white/90 dark:bg-dark-card/90 rounded-2xl shadow-lg p-8 flex flex-col justify-center">
              {activeCategory === 'videos' && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-primary">Watched Videos</h2>
                  <ul className="space-y-6">
                    {mockData.videos.map(video => (
                      <li key={video.id} className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 flex flex-col gap-2 shadow hover:shadow-xl transition-all">
                        <div className="flex items-center gap-3">
                          <FaVideo className="text-primary text-xl" />
                          <p className="font-semibold text-lg">{video.title}</p>
                        </div>
                        <span className="text-xs text-slate-500">{video.date} • {video.duration}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {activeCategory === 'doubt' && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-primary">Your Doubts</h2>
                  <ul className="space-y-6">
                    {mockData.doubt.map(doubt => (
                      <li key={doubt.id} className="bg-blue-100/40 dark:bg-blue-900/20 rounded-xl p-5 shadow flex flex-col gap-2 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-3">
                          <FaCommentDots className="text-blue-500 text-xl" />
                          <span className="font-semibold text-lg">"{doubt.text}"</span>
                        </div>
                        <span className="text-xs text-slate-500">On <span className="font-semibold">{doubt.video}</span> • {doubt.date}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {activeCategory === 'ratings' && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-primary">Your Ratings</h2>
                  <ul className="space-y-6">
                    {mockData.ratings.map(rating => (
                      <li key={rating.id} className="bg-yellow-100/40 dark:bg-yellow-900/20 rounded-xl p-5 shadow flex flex-col gap-2 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-3">
                          <FaStar className="text-yellow-500 text-xl" />
                          <span className="font-semibold text-lg">{rating.video}</span>
                        </div>
                        <span className="flex items-center gap-1 text-yellow-500 font-bold">
                          {Array.from({ length: rating.value }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </span>
                        <span className="text-xs text-slate-500">{rating.date}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {/* Right: Summary Card */}
            <div className="flex flex-col justify-center items-center bg-gradient-to-br from-primary/20 via-blue-100/20 to-green-100/20 dark:from-primary/30 dark:via-blue-900/20 dark:to-green-900/20 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-primary mb-4">Quick Summary</h3>
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-primary font-semibold"><FaVideo /> Videos</span>
                  <span className="font-bold">{mockData.videos.length}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-blue-500 font-semibold"><FaCommentDots /> Doubts</span>
                  <span className="font-bold">{mockData.doubt.length}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-yellow-500 font-semibold"><FaStar /> Ratings</span>
                  <span className="font-bold">{mockData.ratings.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;