import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero-illustration.svg'; // Use your own asset if needed

const AssessmentFormPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 flex flex-col items-center py-12">
      <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8">
        <img src={heroImg} alt="Assessment Banner" className="w-full h-48 object-cover rounded-xl mb-6" />
        <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Assessment</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu erat id quam iaculis porttitor varius nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700" placeholder="Short answer text" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700" placeholder="Short answer text" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Question</label>
            <input type="text" className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700" placeholder="Description (optional)" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your first question</label>
            <div className="space-y-2 ml-2">
              <label className="flex items-center"><input type="radio" name="q1" className="mr-2" /> Option 1</label>
              <label className="flex items-center"><input type="radio" name="q1" className="mr-2" /> Correct answer</label>
              <label className="flex items-center"><input type="radio" name="q1" className="mr-2" /> Option 3</label>
              <label className="flex items-center"><input type="radio" name="q1" className="mr-2" /> Option 4</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your second question</label>
            <div className="space-y-2 ml-2">
              <label className="flex items-center"><input type="checkbox" name="q2a" className="mr-2" /> Option 1</label>
              <label className="flex items-center"><input type="checkbox" name="q2b" className="mr-2" /> Correct answer</label>
              <label className="flex items-center"><input type="checkbox" name="q2c" className="mr-2" /> Option 3</label>
              <label className="flex items-center"><input type="checkbox" name="q2d" className="mr-2" /> Correct answer</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your third question</label>
            <input type="text" className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700" placeholder="Short answer text" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <textarea className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700" rows={3} placeholder="Long answer text" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Closed text box above your fourth question</label>
            <textarea className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700" rows={2} placeholder="Long answer text" />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AssessmentFormPage;
