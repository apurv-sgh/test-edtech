// src/components/QuestionEditor.jsx

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import axios from 'axios';

// A single question card component
const QuestionCard = ({ question, index, updateQuestion, removeQuestion }) => {

  const handleInputChange = (e) => {
    updateQuestion(index, { ...question, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;
    updateQuestion(index, { ...question, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...question.options, ''];
    updateQuestion(index, { ...question, options: newOptions });
  };
  
  const removeOption = (optIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optIndex);
    updateQuestion(index, { ...question, options: newOptions });
  };

  const setCorrectAnswer = (option) => {
      updateQuestion(index, { ...question, answer: option });
  };

  return (
    <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <label htmlFor={`question-text-${index}`} className="text-sm font-medium text-gray-400">Question #{index + 1}</label>
          <input
            id={`question-text-${index}`}
            name="text"
            type="text"
            value={question.text}
            onChange={handleInputChange}
            placeholder="Enter your question here"
            className="w-full bg-gray-800 border-b-2 border-gray-600 focus:border-purple-500 text-lg text-white placeholder-gray-500 focus:outline-none transition-all py-2"
          />
        </div>
        <button onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-900/50 transition-colors">
          <FiTrash2 size={20} />
        </button>
      </div>

      <div className="mb-4">
          <label htmlFor={`difficulty-${index}`} className="text-sm font-medium text-gray-400">Difficulty</label>
           <select 
                id={`difficulty-${index}`}
                name="difficulty" 
                value={question.difficulty} 
                onChange={handleInputChange}
                className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
                <option>EASY</option>
                <option>MEDIUM</option>
                <option>HARD</option>
           </select>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-400">Options (Select the correct answer)</p>
        {question.options.map((opt, optIndex) => (
          <div key={optIndex} className="flex items-center gap-3">
             <input 
                type="radio" 
                name={`correct-answer-${index}`} 
                checked={question.answer === opt}
                onChange={() => setCorrectAnswer(opt)}
                className="w-5 h-5 accent-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-600"
             />
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
              placeholder={`Option ${optIndex + 1}`}
              className="flex-grow bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
                onClick={() => removeOption(optIndex)} 
                disabled={question.options.length <= 1}
                className="text-gray-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
       <button onClick={addOption} className="mt-4 text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm font-semibold">
          <FiPlus /> Add Option
      </button>
    </div>
  );
};


// Main editor page
const QuestionEditor = () => {
    const [title, setTitle] = useState('New Software Developer Test');
    const [questions, setQuestions] = useState([
        { text: '', options: ['', ''], answer: '', difficulty: 'EASY' }
    ]);
    const [status, setStatus] = useState({ message: '', type: '' });

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', ''], answer: '', difficulty: 'EASY' }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, updatedQuestion) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const handleSaveTest = async () => {
        try {
            setStatus({ message: 'Saving...', type: 'loading' });
            const response = await axios.post('http://localhost:3001/api/test', {
                title,
                questions
            });
            setStatus({ message: response.data.message, type: 'success' });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred.';
            setStatus({ message: errorMessage, type: 'error' });
        } finally {
            setTimeout(() => setStatus({ message: '', type: '' }), 4000);
        }
    };

    return (
        <div className="bg-[#111827] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-white">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-purple-400">Test Creation Panel</h1>
                    <p className="text-gray-400 mt-2">Create and configure the questions for your test.</p>
                </header>

                <div className="space-y-8">
                    {/* Test Title Card */}
                    <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-purple-500">
                        <label htmlFor="test-title" className="text-sm font-medium text-gray-400">Test Title</label>
                        <input
                            id="test-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-gray-600 focus:border-purple-400 text-2xl font-semibold text-white focus:outline-none transition-all py-2"
                        />
                    </div>
                    
                    {/* Question Cards */}
                    {questions.map((q, index) => (
                        <QuestionCard 
                            key={index}
                            question={q}
                            index={index}
                            updateQuestion={updateQuestion}
                            removeQuestion={removeQuestion}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center justify-between">
                     <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        <FiPlus /> Add Question
                    </button>
                    <button
                        onClick={handleSaveTest}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-all hover:from-purple-700 hover:to-indigo-700"
                    >
                        <FiSave /> Save Test
                    </button>
                </div>

                 {/* Status Message */}
                {status.message && (
                    <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                        status.type === 'success' ? 'bg-green-900/50 text-green-300' :
                        status.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'
                    }`}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionEditor;