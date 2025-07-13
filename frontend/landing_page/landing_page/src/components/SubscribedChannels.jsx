import React from 'react';
import { FaBell, FaRegBell } from 'react-icons/fa';

const SubscribedChannels = () => {
  const channels = [
    {
      id: 1,
      name: 'Blockchain Fundamentals',
      latestVideo: 'Understanding Smart Contracts',
      isNew: true,
      subscribed: true
    },
    {
      id: 2,
      name: 'Crypto Economics',
      latestVideo: 'Tokenomics 101',
      isNew: false,
      subscribed: true
    },
    {
      id: 3,
      name: 'Web3 Development',
      latestVideo: 'Intro to Solidity',
      isNew: true,
      subscribed: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 h-full">
      <div className="bg-indigo-600 text-white font-semibold text-lg px-6 py-4 border-b border-indigo-500">
        <h5 className="mb-0">Subscribed Channels</h5>
      </div>
      <div className="p-6">
        <div className="max-h-96 overflow-y-auto">
          {channels.map(channel => (
            <div key={channel.id} className="p-3 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h6 className="font-medium flex items-center">
                  {channel.name}
                  {channel.isNew && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">New</span>}
                </h6>
                <p className="text-sm text-gray-500">Latest: {channel.latestVideo}</p>
              </div>
              <button className={`px-3 py-1 rounded text-sm transition-colors ${
                channel.subscribed 
                  ? 'bg-gray-500 text-white hover:bg-gray-600' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}>
                {channel.subscribed ? <FaBell /> : <FaRegBell />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;