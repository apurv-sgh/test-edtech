import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { createStudyPlan, updateStudyPlan, deleteStudyPlan } from '../../api/studyPlan';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiSave, FiClock, FiBook } from 'react-icons/fi';

const StudyPlan = () => {
  const { studyPlans, setStudyPlans, courses, loading, error } = useDashboard();
  const [date, setDate] = useState(new Date());
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [editing, setEditing] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editSelectedCourse, setEditSelectedCourse] = useState('');

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (subject.trim() && time) {
      try {
        const planData = {
          title: subject,
          description,
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          sessions: [{
            title: subject,
            course: selectedCourse || undefined,
            startTime: new Date(`${date.toDateString()} ${time}`),
            endTime: new Date(`${date.toDateString()} ${time}`),
            description,
            priority
          }]
        };

        const res = await createStudyPlan(planData);
        setStudyPlans([...studyPlans, res.data]);
        setSubject('');
        setTime('');
        setDescription('');
        setPriority('medium');
        setSelectedCourse('');
        toast.success('Study plan created successfully!');
      } catch (error) {
        toast.error('Failed to create study plan');
        console.error('Error creating study plan:', error);
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
        title: editSubject,
        description: editDescription,
        sessions: [{
          title: editSubject,
          course: editSelectedCourse || undefined,
          startTime: new Date(`${date.toDateString()} ${editTime}`),
          endTime: new Date(`${date.toDateString()} ${editTime}`),
          description: editDescription,
          priority: editPriority
        }]
      };

      const res = await updateStudyPlan(id, planData);
      setStudyPlans(studyPlans.map(p => p._id === id ? res.data : p));
      setEditing(null);
      setEditSubject('');
      setEditTime('');
      setEditDescription('');
      setEditPriority('medium');
      setEditSelectedCourse('');
      toast.success('Study plan updated successfully!');
    } catch (error) {
      toast.error('Failed to update study plan');
      console.error('Error updating study plan:', error);
    }
  };
  
  const plansForSelectedDate = studyPlans.filter(p => {
    const planDate = new Date(p.startDate);
    const selectedDate = new Date(date);
    return planDate.toDateString() === selectedDate.toDateString();
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Study Planner</h1>
      
      {/* Add Plan Form */}
      <form onSubmit={handleAddPlan} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Add New Study Plan</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject / Task
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Chapter 5 Reading"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Course (Optional)
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a course (optional)</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about your study session..."
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="3"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-focus transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <FiPlus />
          <span>Add Plan for {date.toLocaleDateString()}</span>
        </button>
      </form>
      
      {/* Plans List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Plans for {date.toLocaleDateString()}
        </h2>
        
        {/* Debug Info */}
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Total plans: {studyPlans.length} | Plans for selected date: {plansForSelectedDate.length} | Upcoming plans: {upcomingPlans.length}
          </p>
        </div>
        
        {plansForSelectedDate.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-dark-card rounded-xl shadow-md">
            <FiCalendar className="mx-auto h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">No plans for this day!</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Select a day and add a plan to get started.</p>
            
            {/* Show all plans for debugging */}
            {allPlans.length > 0 && (
              <div className="mt-4 text-left">
                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">All your plans:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allPlans.map((plan) => (
                    <div key={plan._id} className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                      <p><strong>{plan.title}</strong> - {new Date(plan.startDate).toLocaleDateString()}</p>
                      {plan.description && <p className="text-slate-600">{plan.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {plansForSelectedDate.map((plan) => (
              <div key={plan._id} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
                {editing === plan._id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input 
                        type="time" 
                        value={editTime} 
                        onChange={(e) => setEditTime(e.target.value)} 
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white" 
                      />
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <input 
                      type="text" 
                      value={editSubject} 
                      onChange={(e) => setEditSubject(e.target.value)} 
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white" 
                      autoFocus 
                    />
                    <select
                      value={editSelectedCourse}
                      onChange={(e) => setEditSelectedCourse(e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    >
                      <option value="">No course selected</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description..."
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      rows="2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FiClock className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                          {plan.sessions?.[0]?.startTime ? 
                            new Date(plan.sessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                            'No time set'
                          }
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">{plan.title}</p>
                        {plan.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.sessions?.[0]?.priority === 'high' ? 'bg-red-100 text-red-800' :
                        plan.sessions?.[0]?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {plan.sessions?.[0]?.priority || 'medium'}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end space-x-2 mt-4">
                  {editing === plan._id ? (
                    <>
                      <button 
                        onClick={() => handleUpdatePlan(plan._id)} 
                        className="text-green-500 hover:text-green-600 p-2"
                      >
                        <FiSave className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => setEditing(null)} 
                        className="text-slate-500 hover:text-slate-600 p-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { 
                          setEditing(plan._id); 
                          setEditSubject(plan.title); 
                          setEditTime(plan.sessions?.[0]?.startTime ? 
                            new Date(plan.sessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                            ''
                          );
                          setEditDescription(plan.description || '');
                          setEditPriority(plan.sessions?.[0]?.priority || 'medium');
                          setEditSelectedCourse(plan.sessions?.[0]?.course?._id || plan.sessions?.[0]?.course || '');
                        }} 
                        className="text-blue-500 hover:text-blue-600 p-2"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeletePlan(plan._id)} 
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* All Plans Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">All Your Study Plans</h2>
        {allPlans.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-dark-card rounded-xl shadow-md">
            <FiBook className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-300">No study plans yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Create your first study plan to get organized!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allPlans.map((plan) => (
              <div key={plan._id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">{plan.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {new Date(plan.startDate).toLocaleDateString()} at {
                          plan.sessions?.[0]?.startTime ? 
                            new Date(plan.sessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                            'No time set'
                        }
                      </p>
                      {plan.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.sessions?.[0]?.priority === 'high' ? 'bg-red-100 text-red-800' :
                      plan.sessions?.[0]?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {plan.sessions?.[0]?.priority || 'medium'}
                    </span>
                    <button 
                      onClick={() => handleDeletePlan(plan._id)} 
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Calendar and Upcoming Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Calendar</h2>
          <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Upcoming Plans</h3>
          <div className="space-y-2">
            {upcomingPlans.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No upcoming plans</p>
            ) : (
              upcomingPlans.map((plan) => (
                <div key={plan._id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <p className="font-medium text-sm text-slate-800 dark:text-white">{plan.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(plan.startDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan; 