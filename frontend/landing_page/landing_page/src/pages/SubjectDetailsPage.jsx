// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { FaAngleRight } from 'react-icons/fa';
// // --- THIS IS THE CORRECTED IMPORT ---
// import { subjects, channels } from '../data/courseData';

// const SubjectDetailsPage = () => {
//   const { subjectSlug } = useParams();
//   const subjectData = subjects[subjectSlug] || null;

//   if (!subjectData) { return <div className="text-center py-20">Subject Not Found</div>; }

//   return (
//     <div className="bg-white dark:bg-dark-bg min-h-screen">
//       <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
//         <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">{subjectData.name}</h1>
//       </div>
//       <div className="container mx-auto px-6 py-16">
//         <div className="max-w-5xl mx-auto">
//           <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-6 text-center">Top Channels</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {subjectData.channels && subjectData.channels.length > 0 ? (
//               subjectData.channels.map(channelSlug => {
//                 // Now we look up the channel details from the 'channels' object
//                 const channel = channels[channelSlug];
//                 if (!channel) return null; // Safety check

//                 return (
//                   <div key={channelSlug} className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-5 flex flex-col text-center items-center">
//                     <img src={channel.avatar} alt={channel.teacher} className="w-20 h-20 rounded-full mb-4" />
//                     <div className="flex-grow">
//                       <h4 className="font-bold text-lg text-slate-800 dark:text-white">{channel.name}</h4>
//                       <p className="text-sm text-slate-500 mb-2">by {channel.teacher}</p>
//                       <p className="text-xs bg-primary-light dark:bg-slate-700 text-primary rounded-full inline-block px-2 py-1">{channel.specialty}</p>
//                     </div>
//                     <Link
//                       to={`/playlist/${channelSlug}`}
//                       className="w-full mt-5 bg-primary/10 dark:bg-primary/20 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
//                     >
//                       View Playlist <FaAngleRight size={12}/>
//                     </Link>
//                   </div>
//                 );
//               })
//             ) : ( <p className="col-span-full text-center text-slate-500">No channels found for this subject.</p> )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default SubjectDetailsPage;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import {  channels } from '../data/courseData';

const SubjectDetailsPage = () => {
  const { subjectSlug } = useParams();
  const subjectData = subjects[subjectSlug] || null;

  if (!subjectData) { return <div className="text-center py-20">Subject Not Found</div>; }

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">{subjectData.name}</h1>
      </div>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-6 text-center">Top Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectData.channels && subjectData.channels.length > 0 ? (
              subjectData.channels.map(channelSlug => {
                const channel = channels[channelSlug];
                if (!channel) return null;
                return (
                  <div key={channelSlug} className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-5 flex flex-col text-center items-center">
                    <img src={channel.avatar} alt={channel.teacher} className="w-20 h-20 rounded-full mb-4" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-white">{channel.name}</h4>
                      <p className="text-sm text-slate-500 mb-2">by {channel.teacher}</p>
                      <p className="text-xs bg-primary-light dark:bg-slate-700 text-primary rounded-full inline-block px-2 py-1">{channel.specialty}</p>
                    </div>
                    {/* --- THIS IS THE CORRECTED LINK --- */}
                    <Link
                      to={`/channel/${channelSlug}`}
                      className="w-full mt-5 bg-primary/10 dark:bg-primary/20 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                    >
                      View Channel <FaAngleRight size={12}/>
                    </Link>
                  </div>
                );
              })
            ) : ( <p className="col-span-full text-center text-slate-500">No channels found for this subject.</p> )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubjectDetailsPage;