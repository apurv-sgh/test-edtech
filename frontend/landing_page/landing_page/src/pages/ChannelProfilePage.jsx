import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { channels } from '../data/courseData';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable Video Card component
const VideoCard = ({ video, isCarouselItem = true }) => (
  // Adjust width for carousel vs. grid
  <div className={isCarouselItem ? 'w-80 flex-shrink-0' : 'w-full'}>
    <Link to="/lecture" className="block group">
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img 
          src={`https://i3.ytimg.com/vi/${video.id}/hqdefault.jpg`} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-semibold">{video.duration}</div>
      </div>
      <div className="pt-3">
        <h4 className="font-bold text-slate-800 dark:text-white truncate pr-4">{video.title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{video.views} views • {video.age}</p>
      </div>
    </Link>
  </div>
);

// Reusable Carousel Section component
const VideoCarousel = ({ title, videos }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
    <div className="flex gap-5 pb-4 -mx-6 px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
      <AnimatePresence>
        {videos.map(video => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            >
              <VideoCard video={video} />
            </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

const ChannelProfilePage = () => {
  const { channelSlug } = useParams();
  const [activeTab, setActiveTab] = useState('home');
  // --- 1. ADD STATE FOR SEARCH ---
  const [searchTerm, setSearchTerm] = useState('');

  const channelData = channels[channelSlug] || null;

  if (!channelData) { return <div className="text-center py-20">Channel Not Found</div>; }

  // --- 2. FILTER VIDEOS BASED ON SEARCH ---
  const filteredVideos = channelData.allVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      {/* Sub-Navbar */}
      <div className="bg-primary-light dark:bg-dark-card border-b-2 border-slate-200 dark:border-slate-700 sticky top-[68px] z-40">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 sm:gap-4">
              {['Home', 'Videos', 'Playlists', 'Posts'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-3 px-2 sm:px-4 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap
                    ${activeTab === tab.toLowerCase() ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* --- 3. CONNECT SEARCH INPUT TO STATE --- */}
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-48 pl-9 pr-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* --- Main Content Area (Left) --- */}
          <main className="lg:col-span-3">
            {/* --- "Our Members" Section has been REMOVED --- */}

            {/* --- 4. RENDER CONTENT BASED ON FILTERED VIDEOS --- */}
            {activeTab === 'home' && (
              <div>
                <VideoCarousel title="For you" videos={filteredVideos} />
                <VideoCarousel title="Videos" videos={[...filteredVideos].reverse()} />
              </div>
            )}
            
            {activeTab === 'videos' && (
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">All Videos</h3>
                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredVideos.map(video => <VideoCard key={video.id} video={video} isCarouselItem={false}/>)}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-10">No videos found matching "{searchTerm}"</p>
                )}
              </div>
            )}

            {/* Placeholder for other tabs */}
             {(activeTab === 'playlists' || activeTab === 'posts') && (
               <div className="text-center py-16 bg-primary-light/50 dark:bg-dark-card rounded-lg">
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                    Content for "{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}" is coming soon!
                  </h3>
               </div>
            )}
          </main>

          {/* Teacher Bio (Right Sidebar) */}
          <aside className="lg:col-span-1">
            <div className="bg-primary-light/50 dark:bg-dark-card p-6 rounded-lg sticky top-24">
              <img src={channelData.avatar} alt={channelData.teacher} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-dark-bg" />
              <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white">{channelData.teacher}</h3>
              <p className="text-sm text-center text-primary dark:text-sky-400 font-semibold mb-4">{channelData.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 border-t border-slate-300 dark:border-slate-600 pt-4 mt-4">{channelData.teacherBio}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
export default ChannelProfilePage;