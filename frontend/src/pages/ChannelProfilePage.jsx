import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSearch, FaPlay, FaRegBell, FaBell, FaCheck, FaVideo, FaClipboardList, FaInfoCircle, FaCalendarDay } from 'react-icons/fa';
import { channels } from '../data/courseData';
import NotesImg from '../assets/notes.gif';

const VideoCard = ({ video }) => (
  <div className="w-full">
    <Link to="/recorded-lecture" className="block group">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary/10 via-white/60 to-slate-100 dark:from-dark-card dark:via-dark-bg dark:to-dark-card">
        <img src={`https://i3.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-90 group-hover:opacity-100"/>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-semibold backdrop-blur-sm">{video.duration}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-all" />
        <FaPlay className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl opacity-0 group-hover:opacity-80 transition-all" />
      </div>
      <div className="pt-3">
        <h4 className="font-bold text-lg text-slate-800 dark:text-white truncate pr-4 group-hover:text-primary transition-colors">{video.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{video.views} views • {video.age}</p>
      </div>
    </Link>
  </div>
);

const PlaylistCard = ({ playlist }) => (
  <Link to="#" className="block group">
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary/10 via-white/60 to-slate-100 dark:from-dark-card dark:via-dark-bg dark:to-dark-card">
      <img src={playlist.thumb} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"/>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
        <FaPlay className="text-white text-4xl drop-shadow-lg"/>
      </div>
      <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow">{playlist.videoCount} videos</span>
    </div>
    <div className="pt-3">
      <h4 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">{playlist.title}</h4>
    </div>
  </Link>
);

const ChannelProfilePage = () => {
  const { channelSlug } = useParams();
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBellRinging, setIsBellRinging] = useState(false);

  const channelData = channels[channelSlug] || null;

  if (!channelData) { return <div className="text-center py-20">Channel Not Found</div>; }

  // Filter content based on the search term
  const filteredVideos = channelData.allVideos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPlaylists = channelData.playlists.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubscribe = () => setIsSubscribed(!isSubscribed);
  const handleBellClick = () => setIsBellRinging(!isBellRinging);

  return (
    <div className="bg-gradient-to-br from-primary-light/40 via-white to-slate-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg min-h-screen">
      {/* Banner Section */}
      <div>
        <div className="relative h-56 sm:h-64 bg-cover bg-center rounded-b-3xl shadow-lg overflow-hidden" style={{ backgroundImage: `url(${channelData.bannerImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>
        {/* ...existing code... */}
        <div className="bg-primary-light/80 dark:bg-dark-card/80 shadow-lg rounded-b-3xl -mt-10 pb-2">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center py-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src={channelData.avatar} alt={channelData.teacher} className="w-28 h-28 rounded-full border-4 border-white dark:border-dark-bg shadow-xl -mt-16 bg-white object-cover"/>
                  <span className="absolute bottom-2 right-2 bg-primary text-white rounded-full px-2 py-1 text-xs font-bold shadow">{channelData.subscriberCount}+</span>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white drop-shadow-lg">{channelData.name}</h1>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">by <span className="font-semibold text-primary">{channelData.teacher}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 sm:mt-0">
                <button onClick={handleSubscribe} className={`font-semibold py-2 px-6 rounded-full flex items-center gap-2 shadow transition-all duration-150 text-lg ${isSubscribed ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' : 'bg-gradient-to-r from-primary to-primary-focus text-white hover:from-primary-focus hover:to-primary'}`}>
                  {isSubscribed && <FaCheck/>}
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
                {isSubscribed && (
                  <button onClick={handleBellClick} className={`p-3 rounded-full shadow transition-colors ${isBellRinging ? 'bg-primary/20 text-primary' : 'bg-slate-200 dark:bg-slate-700'}`} title="Notifications">
                    {isBellRinging ? <FaBell/> : <FaRegBell/>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sub-Navbar */}
      <div className="bg-white/80 dark:bg-dark-bg/80 border-b-2 border-slate-200 dark:border-slate-700 sticky top-[68px] z-30 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 sm:gap-4">
              {['Home', 'Videos', 'Playlists'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`py-3 px-2 sm:px-4 font-semibold ${activeTab === tab.toLowerCase() ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative hidden md:block">
              <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 pl-9 pr-4 py-2 bg-primary-light/50 dark:bg-dark-card border rounded-full text-sm"/>
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features, Videos, and Channel Insights Side by Side */}
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* Left: Features and Videos */}
        <div className="flex-1 min-w-0 flex flex-col gap-10">
          {/* Feature Cards and Latest Notes only on Home tab */}
          {activeTab === 'home' && (
            <>
              {/* Feature Videos Section */}
              <div>
                <h3 className="text-3xl font-extrabold mb-6 dark:text-slate-200 text-slate-800 tracking-tight flex items-center gap-2">
                  <FaPlay className="text-primary"/> Featured Videos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
                  {channelData.allVideos.slice(0,3).map(video => <VideoCard key={video.id} video={video}/>)}
                </div>
              </div>
              {/* Feature Cards Section */}
              <div className="mt-14">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Notes Card */}
                  <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-blue-900 dark:via-dark-bg dark:to-dark-card border border-blue-200 dark:border-blue-700 rounded-2xl shadow-xl p-7 flex flex-col items-center text-center hover:shadow-2xl transition-all">
                    <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full p-4 mb-4">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 20h9' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z' /></svg>
                    </span>
                    <h4 className="font-bold text-xl mb-2 text-slate-800 dark:text-white">Class Notes</h4>
                    <p className="text-slate-500 dark:text-slate-300 text-sm mb-3">Access and review notes shared by teachers for each session. <Link to="/notes" className="text-blue-700 dark:text-blue-200 underline font-semibold">View Notes</Link></p>
                  </div>
                  {/* Reference Books Card */}
                  <div className="bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-yellow-900 dark:via-dark-bg dark:to-dark-card border border-yellow-200 dark:border-yellow-700 rounded-2xl shadow-xl p-7 flex flex-col items-center text-center hover:shadow-2xl transition-all">
                    <span className="inline-block bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 rounded-full p-4 mb-4">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6l4 2' /><rect width='20' height='14' x='2' y='5' rx='2' fill='none' stroke='currentColor' strokeWidth='2' /></svg>
                    </span>
                    <h4 className="font-bold text-xl mb-2 text-slate-800 dark:text-white">Reference Books</h4>
                    <p className="text-slate-500 dark:text-slate-300 text-sm mb-3">Explore recommended books and resources. <Link to="/books" className="text-yellow-700 dark:text-yellow-200 underline font-semibold">View Books</Link></p>
                  </div>
                  {/* Live Sessions Card */}
                  <div className="bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-green-900 dark:via-dark-bg dark:to-dark-card border border-green-200 dark:border-green-700 rounded-2xl shadow-xl p-7 flex flex-col items-center text-center hover:shadow-2xl transition-all">
                    <span className="inline-block bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-full p-4 mb-4">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12l-3-2v4l3-2z' /></svg>
                    </span>
                    <h4 className="font-bold text-xl mb-2 text-slate-800 dark:text-white">Live Sessions</h4>
                    <p className="text-slate-500 dark:text-slate-300 text-sm mb-3">Join interactive live classes and Q&A sessions. <Link to="/live-classes" className="text-green-700 dark:text-green-200 underline font-semibold">Go to Live</Link></p>
                  </div>
                </div>
              </div>
              {/* Beautiful Notes Section */}
              <div className="mt-14">
                <div className="bg-gradient-to-br from-primary/10 via-white to-blue-100 dark:from-dark-card dark:via-dark-bg dark:to-blue-900 border border-primary/20 dark:border-blue-800 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-3xl font-extrabold mb-2 text-primary dark:text-white tracking-tight">Latest Notes</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-xl">Stay updated with the latest notes and resources shared by your educators. Click below to explore all notes or add your own!</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <Link to="/notes" className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-primary-focus transition-all">View All Notes</Link>
                      <Link to="/notes/add" className="bg-blue-100 text-primary font-bold py-2 px-6 rounded-xl shadow hover:bg-blue-200 transition-all dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">Add Note</Link>
                    </div>
                  </div>
                  <div className="flex-shrink-0 hidden md:block">
                    <img src={NotesImg} alt="Notes Illustration" className="w-64 h-64 object-contain drop-shadow-xl" />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Videos/Playlists Section */}
          <div>
          {activeTab === 'videos' && (
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-dark-bg dark:to-blue-900 border border-blue-200 dark:border-blue-800 shadow-2xl p-8 mb-6">
              <h3 className="text-4xl font-black mb-8 dark:text-blue-200 text-blue-900 tracking-tight flex items-center gap-3 drop-shadow-lg">
                <span className="bg-blue-200 dark:bg-blue-800 p-3 rounded-full"><FaVideo className="text-blue-600 dark:text-blue-200"/></span> All Videos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {filteredVideos.length > 0 ? filteredVideos.map(video => <VideoCard key={video.id} video={video}/>) : <p className="col-span-full text-center text-blue-400 text-lg font-semibold">No videos found for "{searchTerm}".</p>}
              </div>
            </div>
          )}
          {activeTab === 'playlists' && (
            <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-yellow-950 dark:via-dark-bg dark:to-yellow-900 border border-yellow-200 dark:border-yellow-800 shadow-2xl p-8 mb-6">
              <h3 className="text-4xl font-black mb-8 dark:text-yellow-200 text-yellow-900 tracking-tight flex items-center gap-3 drop-shadow-lg">
                <span className="bg-yellow-200 dark:bg-yellow-800 p-3 rounded-full"><FaClipboardList className="text-yellow-600 dark:text-yellow-200"/></span> Playlists
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {filteredPlaylists.length > 0 ? filteredPlaylists.map(playlist => <PlaylistCard key={playlist.slug} playlist={playlist}/>) : <p className="col-span-full text-center text-yellow-400 text-lg font-semibold">No playlists found for "{searchTerm}".</p>}
              </div>
            </div>
          )}
          </div>
        </div>
        {/* Channel Insights Sidebar (right) */}
        <div className="hidden md:block md:w-96 flex-shrink-0">
          <div className="sticky top-28">
            <div className="bg-gradient-to-br from-primary-light/80 via-white to-slate-100 dark:from-dark-card dark:via-dark-bg dark:to-dark-card p-7 rounded-3xl shadow-2xl border border-primary/10 dark:border-slate-700">
              <h3 className="text-2xl font-extrabold mb-4 text-primary dark:text-white flex items-center gap-2"><FaInfoCircle className="text-primary"/> Channel Insights</h3>
              <div className="mb-5">
                <h4 className="font-bold text-lg mb-2 dark:text-slate-300">Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{channelData.teacherBio}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300"><FaInfoCircle className="text-primary"/><span className="font-semibold">{channelData.subscriberCount} Subscribers</span></div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300"><FaVideo className="text-primary"/><span className="font-semibold">{channelData.videoCount} Videos</span></div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300"><FaCalendarDay className="text-primary"/><span className="font-semibold">{channelData.joinDate}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content and sidebar flex row removed; now unified above */}
    </div>
  );
};
export default ChannelProfilePage;