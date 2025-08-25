// src/components/TestPage.jsx

import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiGrid } from 'react-icons/fi';
import { FaUnsplash } from 'react-icons/fa'; // A generic logo icon
import ResultsPage from './ResultsPage'; // Import the ResultsPage component

const TIME_PER_QUESTION = 20; // Time in seconds for each question

const TestPage = ({ questions }) => {
  // --- State Management ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: 'selectedOption' }
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // --- Timer Logic ---
  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(TIME_PER_QUESTION);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (quizFinished) return;
    if (timeLeft === 0) {
      handleNext(); // Auto-submit and move to next when time is up
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, quizFinished]);
  
  // --- Core Functions ---
  const handleNext = () => {
    // Save the current answer
    const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOption };
    setUserAnswers(newAnswers);

    // Move to the next question or finish
    if (isLastQuestion) {
      finishQuiz(newAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selection for the new question
    }
  };

  const handleSkip = () => {
    handleNext(); // Skip behaves the same as submitting a null answer
  };
  
  const finishQuiz = (finalAnswers) => {
    // Calculate score
    let finalScore = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setQuizFinished(true);
  };
  
  const handleRestart = () => {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setUserAnswers({});
      setQuizFinished(false);
      setScore(0);
  }

  // --- Conditional Rendering ---
  if (quizFinished) {
    return <ResultsPage score={score} totalQuestions={questions.length} onRestart={handleRestart}/>;
  }

  return (
    <div className="bg-[#111827] text-gray-200 min-h-screen flex flex-col font-sans">
      {/* 1. Header */}
      <header className="bg-[#1f2937] border-b border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <FaUnsplash className="text-purple-400 text-3xl" />
          <h1 className="text-xl font-semibold">Software Developer - Mock Test</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded hover:bg-gray-700" disabled><FiChevronLeft /></button>
          <span className="font-bold text-purple-400">{currentQuestionIndex + 1}</span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{questions.length}</span>
          <button className="p-2 rounded hover:bg-gray-700" disabled><FiChevronRight /></button>
          <span className="border-l border-gray-600 h-6 mx-2"></span>
          <button className="p-2 ml-2 rounded hover:bg-gray-700"><FiGrid /></button>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-grow container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Question */}
        <div className="pt-4">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">Question {currentQuestion.id}</h2>
            <span className="bg-green-900 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              {currentQuestion.difficulty}
            </span>
          </div>
          <p className="text-lg leading-relaxed text-gray-300">
            {currentQuestion.text}
          </p>
        </div>

        {/* Right Side: Answer */}
        <div className="pt-4">
          <div className="bg-red-900/50 border border-red-700/60 p-3 rounded-lg text-center mb-6">
            <div className="flex justify-between items-center text-red-400 font-semibold">
                <span>Question Time Left</span>
                <span>{timeLeft} sec</span>
            </div>
             <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}></div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Answer</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 
                  ${selectedOption === option ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-purple-600'}`
                }
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="w-5 h-5 accent-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-600"
                />
                <span className="text-base">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="bg-[#1f2937] border-t border-gray-700 px-6 py-4 flex items-center justify-between sticky bottom-0 z-10">
        <button 
            onClick={() => finishQuiz(userAnswers)}
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Finish
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSkip}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Skip
          </button>
          <button 
            onClick={handleNext}
            disabled={!selectedOption} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-700"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Submit & Next'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TestPage;