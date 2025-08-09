import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBookOpen, FiPlus, FiEdit, FiTrash, FiX, FiVideo, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Modal Component for the Form ---
const CourseModal = ({ isOpen, onClose, onSave, courseToEdit }) => {
  const [formData, setFormData] = useState({ title: '', category: 'JEE', level: 'Beginner', description: '' });

  useEffect(() => {
    if (courseToEdit) {
      setFormData(courseToEdit);
    } else {
      setFormData({ title: '', category: 'JEE', level: 'Beginner', description: '' });
    }
  }, [courseToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><FiX/></button>
        <h2 className="text-2xl font-bold mb-4">{courseToEdit ? 'Edit Course' : 'Create New Course'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Course Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
          <div className="flex gap-4"><div className="w-1/2"><label>Category</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div><div className="w-1/2"><label>Level</label><select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div></div>
          <div><label>Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"></textarea></div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">{courseToEdit ? 'Save Changes' : 'Create Course'}</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const CourseManagementPage = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]); // Start with an empty array for the "first time" experience
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleSaveCourse = (courseData) => {
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } : c));
      alert('Course updated successfully!');
    } else {
      setCourses([...courses, { ...courseData, id: Date.now(), videoCount: 0, notesCount: 0 }]);
      alert('Course created successfully!');
    }
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  // Protected View for teachers only
  if (user?.role !== 'teacher') {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">Only teachers can manage courses.</p>
        <Link to="/" className="text-primary mt-4 inline-block font-semibold">← Go Back Home</Link>
      </div>
    );
  }

  return (
    <>
      <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCourse} courseToEdit={editingCourse} />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Course Management</h1>
          <button onClick={openCreateModal} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-primary-focus transition-colors">
            <FiPlus /> Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          // --- "First Time Visit" Empty State ---
          <div className="text-center py-20 bg-primary-light/50 dark:bg-dark-card rounded-xl shadow-md border-2 border-dashed border-slate-300 dark:border-slate-700">
            <FiBookOpen className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">No Courses Created Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Get started by creating your first course for your students.</p>
            <button onClick={openCreateModal} className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">
              Create Your First Course
            </button>
          </div>
        ) : (
          // --- Grid of Existing Courses ---
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {courses.map(course => (
                <motion.div
                  key={course.id} layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white dark:bg-dark-card rounded-xl shadow-md flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-2 py-1 rounded-full">{course.category}</span>
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-2 py-1 rounded-full">{course.level}</span>
                    </div>
                    <h3 className="text-xl font-bold mt-3">{course.title}</h3>
                    <p className="text-sm text-slate-500 mt-2 flex-grow">{course.description}</p>
                  </div>
                  <div className="px-6 py-4 bg-primary-light/50 dark:bg-slate-800/30 border-t flex justify-between text-sm">
                    <span className="flex items-center gap-1.5"><FiVideo/> {course.videoCount} Videos</span>
                    <span className="flex items-center gap-1.5"><FiFileText/> {course.notesCount} Notes</span>
                  </div>
                  <div className="p-4 flex gap-2">
                    <button onClick={() => openEditModal(course)} className="w-1/2 bg-primary/10 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20"><FiEdit/> Edit</button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="w-1/2 bg-red-500/10 text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20"><FiTrash/> Delete</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};
export default CourseManagementPage;