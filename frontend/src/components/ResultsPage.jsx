// src/components/ResultsPage.jsx

import React from 'react';
import { FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';

const ResultsPage = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="bg-[#111827] min-h-screen flex items-center justify-center p-4 font-sans text-white">
      <div className="bg-[#1f2937] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <FiAward className="text-purple-400 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Test Completed!</h1>
        <p className="text-gray-400 mb-6">Here is your performance summary.</p>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <p className="text-lg text-gray-300">Your Score</p>
          <p className="text-5xl font-bold my-2 text-purple-400">{percentage}%</p>
          <p className="text-gray-400">
            You answered <span className="font-semibold text-white">{score}</span> out of{' '}
            <span className="font-semibold text-white">{totalQuestions}</span> questions correctly.
          </p>
        </div>

        <div className="flex justify-around text-lg mb-8">
            <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-500"/>
                <span>{score} Correct</span>
            </div>
            <div className="flex items-center gap-2">
                <FiXCircle className="text-red-500"/>
                <span>{totalQuestions - score} Incorrect</span>
            </div>
        </div>
        
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all hover:from-purple-700 hover:to-indigo-700"
        >
          Take Test Again
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;