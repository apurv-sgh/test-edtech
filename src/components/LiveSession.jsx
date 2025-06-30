import React, { useState } from 'react';
import { FaChalkboardTeacher, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { liveSessionAPI } from '../services/api';

// Dummy categories for the dropdown
const categories = ['Select', 'JEE', 'NEET', 'UPSC', 'Class 12th', 'Class 11th', 'Web Development'];

const LiveClassesPage = () => {
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    description: '',
    category: categories[0],
    date: '',
    time: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.teacher || !formData.date || !formData.time) {
      alert('Please fill all required fields: Subject, Teacher, Date, and Time.');
      return;
    }
    const newClass = { ...formData, id: Date.now() };
    setScheduledClasses(prev => [...prev, newClass]);
    // Reset form after submission
    setFormData({ subject: '', teacher: '', description: '', category: categories[0], date: '', time: '' });
  };

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Schedule a Live Class</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto px-4">
          Fill out the form below to create and schedule a new live session for your students.
        </p>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Subject Name</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Teacher Name</label>
                <input type="text" name="teacher" value={formData.teacher} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"></textarea>
              </div>
              <div> 
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Start Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus transition-colors">
                Schedule Class
              </button>
            </form>
          </div>

          {/* Right Column: Scheduled Classes */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Upcoming Live Sessions</h2>
            <div className="space-y-4">
              {scheduledClasses.length > 0 ? (
                scheduledClasses.map(cls => (
                  <div key={cls.id} className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-grow">
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 dark:bg-sky-400/10 font-semibold px-2 py-1 rounded-full">{cls.category}</span>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2">{cls.subject}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1"><FaChalkboardTeacher /> {cls.teacher}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{cls.description}</p>
                    </div>
                    <div className="bg-primary-light dark:bg-slate-700 p-4 rounded-lg text-center flex-shrink-0">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold"><FaCalendarAlt /> {cls.date}</div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold mt-2"><FaClock /> {cls.time}</div>
                      <button className="w-full mt-4 bg-primary text-white font-semibold py-2 rounded-lg text-sm hover:bg-primary-focus">Join Now</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No classes scheduled yet. Use the form to create one!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassesPage;