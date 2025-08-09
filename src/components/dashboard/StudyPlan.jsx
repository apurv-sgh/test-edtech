import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { createStudyPlan, updateStudyPlan, deleteStudyPlan } from '../../api/studyPlan';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaFlag, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence, isValidMotionProp } from 'framer-motion';
import e from 'cors';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StudyPlan = () => {
  const { studyPlans, setStudyPlans, courses, loading, error } = useDashboard();
  const [selectedDate, setSelectedDate] = useState(new Date()); // Renamed to selectedDate
  const [title, setTitle] = useState('');
  const [plans, setPlans] = useState([]);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editSelectedCourse, setEditSelectedCourse] = useState('');

  useEffect(() => {
    setPlans(studyPlans);
  }, [studyPlans])

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (title.trim() && time) {
      try {
        console.log(selectedDate)
        const planData = {
          title: title,
          description,
          startDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
          endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
          sessions: [{
            title: title,
            course: selectedCourse || undefined,
            startTime: new Date(`${selectedDate.toDateString()} ${time}`),
            endTime: new Date(`${selectedDate.toDateString()} ${time}`),
            description,
            priority
          }]
        };
        console.log(planData);
        const res = await createStudyPlan(planData);
        console.log(res.data);
        setStudyPlans([...studyPlans, res.data]);
        setTitle('');
        setTime('');
        setDescription('');
        setPriority('medium');
        setSelectedCourse('');
        toast.success('Study plan created successfully!');

      } catch (error) {
        // Display the error message from the backend, or a generic message if none
        toast.error(error.response?.data?.error || 'Failed to create study plan');
        console.error('Error creating study plan:', error.response?.data?.error || error);
      }
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await deleteStudyPlan(id);
      setStudyPlans(studyPlans.filter(p => p._id !== id));
      toast.success('Study plan deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete study plan');
      console.error('Error deleting study plan:', error);
    }
  };

  const handleUpdatePlan = async (id) => {
    try {
      const planData = {
        title: editTitle,
        description: editDescription,
        sessions: [{
          title: editTitle,
          course: editSelectedCourse || undefined,
          startTime: new Date(`${date.toDateString()} ${editTime}`),
          endTime: new Date(`${date.toDateString()} ${editTime}`),
          description: editDescription,
          priority: editPriority
        }]
      };
      console.log('Updating plan with data:', planData);  // Log data for updates as well
      const res = await updateStudyPlan(id, planData);
      setStudyPlans(studyPlans.map(p => p._id === id ? res.data : p));
      setEditing(false);
      setEditTitle('');
      setEditTime('');
      setEditDescription('');
      setEditPriority('medium');
      setEditSelectedCourse('');
      toast.success('Study plan updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update study plan');
      console.error('Error updating study plan:', error.response?.data?.error || error);
    }
  };

  const filteredPlans = plans.filter(plan => {
    if (!selectedDate) return true;
    const planStartDate = new Date(plan.startDate);
    const selected = new Date(selectedDate);
    return planStartDate.getFullYear() === selected.getFullYear() &&
      planStartDate.getMonth() === selected.getMonth() &&
      planStartDate.getDate() === selected.getDate();
  });

  // Get all upcoming plans for the sidebar
  const upcomingPlans = studyPlans
    .filter(plan => new Date(plan.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  // Get all plans for debugging
  const allPlans = studyPlans.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Study Planner</h1>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            className="p-2 border rounded-md"
            placeholderText="Select a date"
          />
        </div>


        {/* --- ADD/EDIT NEW STUDY PLAN FORM --- */}
        {editing !== null ? (
          <div className="bg-primary-light/50 dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Edit Study Plan</h2>
            <form onSubmit={handleAddPlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Title</label>
                  <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Maths" required className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Time</label>
                  <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Priority </label>
                  <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary">
                    <option>Select Priority...</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Description</label>
                <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details about your study session..." rows="3" className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary-focus transition-all duration-300 flex items-center justify-center gap-2 text-base">
                <FaPlus /> <span>Add Plan for {selectedDate.toLocaleDateString()}</span>
              </button>
            </form>
          </div>

        ) : (
          <div className="bg-primary-light/50 dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Add New Study Plan</h2>
            <form onSubmit={handleAddPlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Subject Name</label>
                  <input type="text" name="subject" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Maths" required className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary"/>
          </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Time</label>
                  <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Priority</label>
                  <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary">
                    <option>Select Priority...</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Description</label>
                <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details about your study session..." rows="3" className="w-full p-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary-focus transition-all duration-300 flex items-center justify-center gap-2 text-base">
                <FaPlus /> <span>Add Plan for {selectedDate.toLocaleDateString()}</span>
              </button>
            </form>
          </div>
        )}


        {/* --- Plans List --- */}
        <div className="bg-primary-light/50 dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Study Plans</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredPlans.length > 0 ? (
                filteredPlans.map(plan => {
                  const formattedDate = new Date(plan.startDate).toLocaleDateString();
                  return (
                    <motion.div
                      key={plan._id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-white">{plan.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{formattedDate}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setEditing(plan._id);
                            setEditTitle(plan.title);
                            setEditTime(new Date(plan.sessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                            setEditDescription(plan.description);
                            setEditPriority(plan.sessions[0].priority);
                            setEditSelectedCourse(plan.sessions[0].course || '');
                            setSelectedDate(new Date(plan.startDate));
                          }}
                          className="ml-2 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                          <FaEdit className="h-4 w-4 text-blue-500" />
                        </button>
                      </div>
                      <button onClick={() => handleDeletePlan(plan._id)} className="ml-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                        <FaTrash className="h-4 w-4 text-red-500" />
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-slate-500 py-4">No plans scheduled for this date.</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;