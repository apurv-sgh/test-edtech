import React, { useState } from "react";
import RecentVideos from "./RecentVideos";
import GroupDiscussion from "./GroupDiscussion";
import { FaUsers, FaFileAlt, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';

const currentLecture = {
    title: 'Balajis - Chapter 14, Acid Capitalist, Bitcoin and More',
    notes: [
        { id: 1, title: 'Lecture 1: Introduction', file: '#', uploaded: '2 days ago' },
        { id: 2, title: 'Lecture 2: Bitcoin Basics', file: '#', uploaded: '1 day ago' },
        { id: 3, title: 'Lecture 3: Acid Capitalist', file: '#', uploaded: '5 hours ago' }
    ],
    participants: [
        { id: 1, name: 'Siqi Chen', role: 'Professor', online: true },
        { id: 2, name: 'Sarah Huo', role: 'TA', online: true },
        { id: 3, name: 'Alex Sims', role: 'Student', online: false },
        { id: 4, name: 'Luna Zhu', role: 'Student', online: true },
        { id: 5, name: 'Yao Xiao', role: 'Student', online: false },
        { id: 6, name: 'Helen Wan', role: 'Student', online: true }
    ]
}


const LectureTitle = () => {
    const [sidebarTab, setSidebarTab] = useState('participants');
      const [fullscreen, setFullscreen] = useState(false);
        const [toasts, setToasts] = useState([]);
    return (
        <div className="w-full px-4 mx-auto py-4 font-sans text-gray-800 min-h-screen flex flex-col">
            {/* Lecture Title */}
            <div className="mb-4">
                <h4 className="text-indigo-600 font-bold border-b-2 border-gray-200 pb-2">{currentLecture.title}</h4>
            </div>

            {/* Main Content Row - Full Height */}
            <div className="flex flex-wrap -mx-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
                {/* Left Sidebar - Participants/Notes */}
                <div className="px-4 w-full lg:w-1/4">
                    <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="bg-indigo-600 text-white font-semibold text-lg px-6 py-4 border-b border-indigo-500">
                            <div className="flex items-center">
                                <div className="inline-flex rounded-lg shadow-sm">
                                    <button
                                        className={`px-3 py-1.5 text-sm rounded-l-lg border-r border-gray-300 last:border-r-0 first:rounded-l-lg last:rounded-r-lg transition-colors ${sidebarTab === 'participants'
                                            ? 'bg-white text-indigo-600'
                                            : 'bg-transparent text-white hover:bg-indigo-700'
                                            }`}
                                        onClick={() => setSidebarTab('participants')}
                                    >
                                        <FaUsers className="mr-1 inline" /> Participants
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 text-sm rounded-none border-r border-gray-300 last:border-r-0 first:rounded-l-lg last:rounded-r-lg transition-colors ${sidebarTab === 'notes'
                                            ? 'bg-white text-indigo-600'
                                            : 'bg-transparent text-white hover:bg-indigo-700'
                                            }`}
                                        onClick={() => setSidebarTab('notes')}
                                    >
                                        <FaFileAlt className="mr-1 inline" /> Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-0">
                            {sidebarTab === 'participants' ? (
                                <div className="max-h-96 overflow-y-auto">
                                    {currentLecture.participants.map(participant => (
                                        <div key={participant.id} className="p-3 border-b border-gray-100 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-2 ${participant.online ? 'bg-indigo-600' : 'bg-gray-400'}`}></span>
                                                <div>
                                                    <div className="font-medium">{participant.name}</div>
                                                    <div className="text-sm text-gray-500">{participant.role}</div>
                                                </div>
                                            </div>
                                            {participant.online && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Live</span>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    {currentLecture.notes.map(note => (
                                        <div key={note.id} className="p-3 border-b border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <FaFileAlt className="text-indigo-600 mr-2 text-lg" />
                                                    <div>
                                                        <div className="font-medium">{note.title}</div>
                                                        <div className="text-sm text-gray-500">Uploaded {note.uploaded}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="bg-indigo-600 text-white border-0 rounded-full px-3 py-1 text-sm hover:bg-indigo-700 transition-colors"
                                                    onClick={() => notify(`Downloading ${note.title}`, 'success')}
                                                >
                                                    <FaDownload className="mr-1" /> Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 text-sm">
                                        <small className="text-gray-500">Notes are uploaded by teachers. Download to view.</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Middle Column - Live Lecture */}
                <div className="px-4 w-full lg:w-1/2">
                    <div className={`bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 h-full ${fullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col justify-center items-center' : ''}`}>
                        <div className="bg-indigo-600 text-white font-semibold text-lg px-6 py-4 border-b border-indigo-500 flex justify-between items-center">
                            <h5 className="mb-0">Live Lecture</h5>
                            <button
                                className="border border-gray-300 text-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                onClick={() => setFullscreen(f => !f)}
                            >
                                {fullscreen ? <FaCompress /> : <FaExpand />}
                            </button>
                        </div>
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 w-8 h-8 mx-auto" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-4 text-lg">Lecture stream will begin shortly</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column - Group Discussion */}
                <div className="px-4 w-full lg:w-1/4">
                    <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="bg-indigo-600 text-white font-semibold text-lg px-6 py-4 border-b border-indigo-500">
                            <h5 className="mb-0">Live Chats</h5>
                        </div>
                        <div className="p-6">
                            <GroupDiscussion />
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Row - Channels and Videos - Only visible after scrolling */}
            <div className="flex justify-between -mx-4 mt-4 gap-4">
                <div className="px-4 w-full md:w-1/2">
                    <RecentVideos />
                </div>
                <div className="px-4 w-full md:w-1/2">
                </div>
            </div>

            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80 animate-in slide-in-from-right-2 ${toast.type === 'success' ? 'border-green-200 bg-green-50' :
                                toast.type === 'error' ? 'border-red-200 bg-red-50' : ''
                            }`}
                        key={toast.id}
                    >
                        <div className="text-sm">
                            {toast.msg}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LectureTitle;