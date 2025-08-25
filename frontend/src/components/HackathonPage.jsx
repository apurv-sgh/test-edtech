// src/components/HackathonPage.jsx

import React from 'react';
import {
  FiMapPin,
  FiCalendar,
  FiAward,
  FiUsers,
  FiInfo,
  FiCheckCircle,
  FiPhone,
  FiDollarSign,
  FiClock,
  FiExternalLink
} from 'react-icons/fi';

import HackathonBanner from '../assets/hackathon-banner.jpg';

// A small reusable component for sidebar info items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-purple-400 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold text-gray-200">{value}</p>
    </div>
  </div>
);

// A reusable card for sections like Rewards, Deadlines, etc.
const InfoCard = ({ icon, title, children }) => (
    <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {children}
    </div>
);


const HackathonPage = () => {
  return (
    <div className="bg-[#111827] text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* 1. Banner Image */}
        <div className="mb-8">
          <img
            src={HackathonBanner}
            alt="Hackathon Banner"
            className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* 2. Main Layout (Content + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title Section */}
            <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-700 p-3 rounded-lg">
                        <FiAward className="text-purple-400 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Hack LLM</h1>
                        <p className="text-gray-400">Indraprastha Institute of Information Technology (IIIT), Delhi</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2"><FiMapPin className="text-gray-500"/> Engineering</div>
                    <div className="flex items-center gap-2"><FiCalendar className="text-gray-500"/> Ends on Aug 30, 2025</div>
                </div>
            </div>

            {/* Main Details Section */}
             <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg prose prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-p:text-gray-300 prose-a:text-purple-400">
                <h2 id="details">Everything you need to know about Hack LLM</h2>
                
                <h3>1. Executive Summary</h3>
                <p>A 24-hour hackathon designed to bring together bright students and developers. This event will challenge participants to leverage the power of Large Language Models (LLMs) and Natural Language Processing (NLP) to build innovative and impactful applications.</p>

                <h3>2. Vision & Objectives</h3>
                <p>To be the premier launchpad for aspiring AI developers and innovators in India, bridging the gap between theoretical knowledge and the real-world application of generative AI technologies.</p>
                
                <h3>3. Themes & Potential Problem Statements</h3>
                <p>While the hackathon is open to any innovative idea, projects can revolve around specific themes announced at the event. Participants will be challenged to build a functional prototype with any of the themes.</p>
                
                <h3>4. Judging Criteria</h3>
                <p>A panel of judges that includes AI experts, academics, and venture capitalists will evaluate projects based on the following criteria: Technical Implementation, Real-World Impact & Viability, and UI/UX & Presentation.</p>
             </div>

            {/* Other Sections */}
            <InfoCard icon={<FiClock className="text-purple-400 text-2xl"/>} title="Important dates & deadlines">
                <div className="flex flex-col sm:flex-row justify-between gap-4 text-center">
                    <div>
                        <p className="text-gray-400">Registration Starts</p>
                        <p className="font-semibold text-white">28 Aug 25, 12:00 AM IST</p>
                    </div>
                    <div className="border-l border-gray-700 hidden sm:block"></div>
                     <div>
                        <p className="text-gray-400">Registration Ends</p>
                        <p className="font-semibold text-white">29 Aug 25, 09:30 AM IST</p>
                    </div>
                </div>
            </InfoCard>

            <InfoCard icon={<FiDollarSign className="text-purple-400 text-2xl"/>} title="Rewards and Prizes">
                <p>Total Prize Pool <span className="font-bold text-white text-lg">₹1,00,000</span></p>
            </InfoCard>

          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              
              {/* Register Card */}
              <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700">
                <p className="text-xl font-bold text-white">Free</p>
                <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all hover:from-purple-700 hover:to-indigo-700">
                  Register
                </button>
                <div className="mt-6 space-y-4 border-t border-gray-700 pt-6">
                  <InfoItem icon={<FiCalendar size={20}/>} label="Registration Deadline" value="29 Aug 25, 09:30 AM IST" />
                  <InfoItem icon={<FiUsers size={20}/>} label="Team Size" value="1 - 4 Members" />
                  <InfoItem icon={<FiCheckCircle size={20}/>} label="Eligibility" value="Open to all college students, recent graduates, and beginners." />
                </div>
              </div>

              {/* Other Info Card */}
              <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FiInfo className="text-purple-400 text-2xl"/>
                  <h3 className="text-xl font-bold text-white">More Opportunities</h3>
                </div>
                <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <FiExternalLink className="text-gray-400"/>
                        <span className="text-sm">Refer & Win Exciting Prizes</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <FiExternalLink className="text-gray-400"/>
                        <span className="text-sm">Build your professional resume</span>
                    </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonPage;