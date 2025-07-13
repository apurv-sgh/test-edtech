import React from 'react';
import { FaPlay, FaClock, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const RecentVideos = () => {
  const videos = [
    {
      id: 1,
      title: 'Bitcoin Whitepaper Analysis',
      description: 'Deep dive into Satoshi Nakamoto\'s original paper',
      duration: '24:35',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaGw7q3aW9aBpG_MTKPQ7Hieh4FPVt94TKRw&s',
      watched: true,
      saved: false
    },
    {
      id: 2,
      title: 'Ethereum Smart Contracts',
      description: 'Building your first smart contract on Ethereum',
      duration: '42:18',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaGw7q3aW9aBpG_MTKPQ7Hieh4FPVt94TKRw&s',
      watched: false,
      saved: true
    },
    {
      id: 3,
      title: 'DeFi Protocols Explained',
      description: 'Understanding decentralized finance applications',
      duration: '35:12',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaGw7q3aW9aBpG_MTKPQ7Hieh4FPVt94TKRw&s',
      watched: false,
      saved: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 h-full">
      <div className="bg-indigo-600 text-white font-semibold text-lg px-6 py-4 border-b border-indigo-500">
        <h5 className="mb-0">Recent Videos</h5>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-gray-200">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <FaPlay className="text-white text-2xl" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
                  <FaClock className="mr-1" /> {video.duration}
                </div>
                <button className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-800 p-1 rounded hover:bg-opacity-100 transition-opacity">
                  {video.saved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>
              <div className="p-3">
                <h6 className="font-medium text-sm">{video.title}</h6>
                <p className="text-xs text-gray-500 mt-1">{video.description}</p>
                {video.watched && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-2 inline-block">Watched</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentVideos;