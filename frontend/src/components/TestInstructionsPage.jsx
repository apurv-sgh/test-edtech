// src/components/TestInstructionsPage.jsx

import React, { useState } from 'react';
import { FiHelpCircle, FiAward, FiList, FiArrowRight } from 'react-icons/fi'; // Using Feather Icons
import { Link } from 'react-router-dom';

const TestInstructionsPage = () => {
  const [inputValue, setInputValue] = useState('');
  const isButtonDisabled = inputValue.toLowerCase() !== 'start';

  return (
    <div className="bg-[#111827] min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Test Details */}
        <div className="text-gray-200">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Software Developer - Mock Test
          </h1>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <FiHelpCircle className="text-purple-400 text-3xl" />
              <div>
                <p className="text-gray-400">Questions</p>
                <p className="text-xl font-semibold">30</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiAward className="text-purple-400 text-3xl" />
              <div>
                <p className="text-gray-400">Marks</p>
                <p className="text-xl font-semibold">30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Guidelines & Start */}
        <div className="bg-[#1f2937] p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FiList className="text-purple-400 text-2xl" />
            <h2 className="text-2xl font-semibold text-white">Guidelines</h2>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
              Timelines & Questions
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Assessment Duration: <span className="font-medium text-gray-300">00:15:00</span> (hh:mm:ss)</li>
              <li>Total Questions to be answered: <span className="font-medium text-gray-300">30 Questions</span></li>
              <li>Do not close the window or tab if you wish to continue the application.</li>
              <li>Please ensure that you attempt the assessment in one sitting as once you start the assessment, the timer won't stop.</li>
            </ul>
          </div>

          <div className="mt-8">
            <input
              type="text"
              placeholder='Type "start" to Start'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Link to='/test-page'
              disabled={isButtonDisabled}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-700"
            >
              Start <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInstructionsPage;