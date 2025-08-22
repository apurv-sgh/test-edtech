import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaRegCommentDots, FaDownload, FaShare, FaBookmark } from 'react-icons/fa';
// import { subjects } from '../data/courseData';

const PlaylistPage = () => {
  const { subjectSlug, channelSlug } = useParams();

  const subjectData = subjects[subjectSlug] || null;
  const channelData = subjectData?.channels.find(c => c.slug === channelSlug) || null;
  
  // Use the first video as the default, or a fallback
  const [currentVideo, setCurrentVideo] = useState(channelData?.videos[0] || null);

  if (!channelData || !currentVideo) {
    return (
      <div className="text-center py-20 bg-white dark:bg-dark-bg min-h-screen">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Playlist Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">This channel does not have a video playlist yet.</p>
        <Link to="/" className="text-primary mt-6 inline-block font-semibold">← Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Playlist Details */}
          <div className="lg:col-span-1 lg:order-2 bg-primary-light/50 dark:bg-dark-card p-2 rounded-xl flex flex-col max-h-[90vh]">
            <div className="p-4 flex-shrink-0">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-black">
                <img src={`https://i3.ytimg.com/vi/${currentVideo.id}/hqdefault.jpg`} alt="Current Video Thumbnail" className="w-full h-full object-cover"/>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{channelData.courseTitle}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{channelData.name} • {channelData.videos.length} videos</p>
              <div className="flex items-center gap-2 my-4">
                <button className="bg-primary text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-primary-focus"><FaPlay/> Play</button>
                <button className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"><FaBookmark/></button>
                <button className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"><FaDownload/></button>
              </div>
              <div className="p-4 bg-white dark:bg-dark-bg rounded-lg">
                <h3 className="font-bold mb-2 text-slate-800 dark:text-white">About this Playlist:</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{channelData.courseDescription}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Video List */}
          <div className="lg:col-span-2 lg:order-1 flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary-light/50 scrollbar-thumb-rounded-full max-h-[90vh]">
            {channelData.videos.map((video, index) => (
              <button key={video.id} onClick={() => setCurrentVideo(video)} className={`w-full text-left flex items-start gap-4 p-3 mb-2 rounded-lg transition-colors ${currentVideo.id === video.id ? 'bg-primary-light dark:bg-primary/20' : 'hover:bg-slate-100 dark:hover:bg-dark-card'}`}>
                <span className="font-semibold text-slate-400 dark:text-slate-500 pt-1 text-lg">{index + 1}</span>
                <img src={`https://i3.ytimg.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} className="w-40 rounded-md flex-shrink-0"/>
                <div>
                  <p className="font-bold leading-tight text-slate-800 dark:text-white">{video.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{channelData.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{video.views} views • {video.age}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaylistPage;