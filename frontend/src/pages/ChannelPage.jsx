import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlay, FaRegCommentDots, FaDownload, FaShare } from "react-icons/fa";
import { courseDetails } from '../data/courseData';

const ChannelPage = () => {
    const { cateorySlug, subjectSlug, channelSlug } = useParams();

    // Find the specific channel data using all URL params
    const categoryData = courseDetails[cateorySlug] || null;
    const subjectData = categoryData?.subjects.find(s => s.slug === subjectSlug) || null;
    const channelData = subjectData?.channels.find(c => c.slug === channelSlug) || null;

    // Set the initial video, or a fallback if videos don't exist
    const [currentVideo, setCurrentVideo] = useState(channelData?.videos[0] || { id: 'error', title: 'no video found' });

    if (!channelData) {
        return (
            <div className="text-center py-20">Channel Not Found</div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-bg min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-8">
                    {channelData.name} : {subjectData.name}
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Video and description */}
                    <div className="lg:col-span-2">
                        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl bg-black">
                            <iframe src={`https://www.youtube.com/embed/${currentVideo.id}`} title={currentVideo.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{channelData.courseTitle}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">by {channelData.teacher}</p>
                            <div className="flex flex-wrap gap-4 my-4">
                                <button className="bg-slate-200 dark:bg-dark-card font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">
                                    <FaDownload />
                                </button>
                            </div>
                            <div className="p-4 bg-primary-light/50 dark:bg-dark-card rounded-lg">
                                <h3 className="font-bold mb-2">About this course:</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">
                                    {channelData.courseDesctiption}
                                </p>
                            </div>
                            <button className="w-full mt-6 bg-green-500 text-white font-bold py-3 text-lg rounded-lg hover:bg-green-600 transition-colors">Enroll in this Course</button>
                        </div>
                    </div>

                    {/* Right Column: Playlist */}
                    <div className="bg-primary-light/50 dark:bg-dark-card p-2 rounded-lg flex flex-col max-h-[90vh]">
                        <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary-light/50 scrollbar-thumb-rounded-full">
                            {channelData.videos && channelData.videos.map((video, index) => (
                                <button key={video.id} onClick={() => setCurrentVideo(video)} className={`w-full text-left flex items-start gap-4 p-2 mb-2 rounded-lg transition-colors ${currentVideo.id === video.id ? 'bg-primary text-white' : 'hover:bg-white dark:hover:bg-slate-700/50'}`}>
                                    <span className="font-bold text-slate-400 dark:text-slate-500 pt-1">
                                        {index + 1}
                                    </span>
                                    <img src={`https://i3.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="w-28 rounded-md flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold leading-tight text-sm">
                                            {video.title}
                                        </p>
                                        <spam className="text-xs opacity-70">
                                            {channelData.name}
                                        </spam>
                                        <p className="text-xs opacity-70">
                                            {video.views} {video.age}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;