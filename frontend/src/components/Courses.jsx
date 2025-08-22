// src/components/Courses.jsx
import React, { useEffect, useState } from 'react';
import { FaCode, FaBrain, FaChartBar } from 'react-icons/fa';
import api from '../api/api';
import { toast } from 'react-toastify';
import { getCourses, createCourse, enrollInCourse, unenrollFromCourse, getMyCourses } from '../api/courses';
import { useAuth } from '../context/AuthContext';
import { getCourseLiveClasses, joinLiveClass, leaveLiveClass } from '../api/liveClasses';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ icon, title, description, instructor, avatar }) => (
  <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-primary/10 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{instructor}</p>
      </div>
    </div>
    <p className="text-slate-600 dark:text-slate-300 mb-4">{description}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src={avatar} alt={instructor} className="w-8 h-8 rounded-full" />
        <span className="text-sm text-slate-600 dark:text-slate-400">{instructor}</span>
      </div>
    </div>
  </div>
);

const iconMap = [
    <FaCode className="text-primary" size={32} />, 
    <FaBrain className="text-secondary-orange" size={32} />, 
    <FaChartBar className="text-secondary-green" size={32} />
];

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        level: '',
        duration: '',
        price: '',
        thumbnail: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [showMyCourses, setShowMyCourses] = useState(false);
    const { user } = useAuth();
    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [liveClasses, setLiveClasses] = useState([]);
    const [liveClassesLoading, setLiveClassesLoading] = useState(false);
    const [liveClassesError, setLiveClassesError] = useState(null);
    const navigate = useNavigate();

    const fetchCourses = () => {
        setLoading(true);
        (showMyCourses ? getMyCourses() : getCourses())
            .then(res => setCourses(res.data))
            .catch(err => {
                setError('Failed to load courses');
                toast.error('Failed to load courses');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line
    }, [showMyCourses]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        createCourse(form)
            .then(() => {
                toast.success('Course added!');
                setForm({ title: '', description: '', category: '', level: '', duration: '', price: '', thumbnail: '' });
                fetchCourses();
            })
            .catch(err => {
                let msg = 'Add failed';
                if (err.response) {
                  if (err.response.data?.message) msg = err.response.data.message;
                  else if (typeof err.response.data === 'string') msg = err.response.data;
                  else if (err.response.status) msg += ` (Status: ${err.response.status})`;
                } else if (err.message) {
                  msg = err.message;
                }
                toast.error(msg);
                console.error('Add error:', err);
            })
            .finally(() => setSubmitting(false));
    };

    const handleEnroll = (id) => {
        enrollInCourse(id)
            .then(() => {
                toast.success('Enrolled in course!');
                fetchCourses();
            })
            .catch(err => {
                let msg = 'Enroll failed';
                if (err.response) {
                  if (err.response.data?.message) msg = err.response.data.message;
                  else if (typeof err.response.data === 'string') msg = err.response.data;
                  else if (err.response.status) msg += ` (Status: ${err.response.status})`;
                } else if (err.message) {
                  msg = err.message;
                }
                toast.error(msg);
                console.error('Enroll error:', err);
            });
    };

    const handleUnenroll = (id) => {
        unenrollFromCourse(id)
            .then(() => {
                toast.success('Unenrolled from course!');
                fetchCourses();
            })
            .catch(err => {
                let msg = 'Unenroll failed';
                if (err.response) {
                  if (err.response.data?.message) msg = err.response.data.message;
                  else if (typeof err.response.data === 'string') msg = err.response.data;
                  else if (err.response.status) msg += ` (Status: ${err.response.status})`;
                } else if (err.message) {
                  msg = err.message;
                }
                toast.error(msg);
                console.error('Unenroll error:', err);
            });
    };

    const handleViewLiveClasses = (courseId) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
            setLiveClasses([]);
            setLiveClassesError(null);
            return;
        }
        setExpandedCourseId(courseId);
        setLiveClassesLoading(true);
        setLiveClassesError(null);
        getCourseLiveClasses(courseId)
            .then(res => setLiveClasses(res.data))
            .catch(() => setLiveClassesError('Failed to load live classes'))
            .finally(() => setLiveClassesLoading(false));
    };

    const handleJoinLiveClass = (liveClassId) => {
        joinLiveClass(liveClassId)
            .then(() => {
                toast.success('Joined live class!');
                if (expandedCourseId) handleViewLiveClasses(expandedCourseId);
            })
            .catch((err) => {
                const msg = err?.response?.data?.message;
                if (msg === 'Already joined the live class') {
                    toast.info('You have already joined this live class.');
                    if (expandedCourseId) handleViewLiveClasses(expandedCourseId);
                } else {
                    toast.error('Failed to join live class');
                }
            });
    };

    const handleLeaveLiveClass = (liveClassId) => {
        leaveLiveClass(liveClassId)
            .then(() => {
                toast.success('Left the live class!');
                if (expandedCourseId) handleViewLiveClasses(expandedCourseId);
            })
            .catch(() => toast.error('Failed to leave live class'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">{showMyCourses ? 'My Courses' : 'Featured Courses'}</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setShowMyCourses(false)} className={`text-primary font-semibold hover:underline ${!showMyCourses ? 'underline' : ''}`}>All Courses</button>
                        <button onClick={() => setShowMyCourses(true)} className={`text-primary font-semibold hover:underline ${showMyCourses ? 'underline' : ''}`}>My Courses</button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:flex-wrap gap-4 items-stretch w-full max-w-full">
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border p-2 rounded flex-1 min-w-[180px]" />
                    <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border p-2 rounded flex-1 min-w-[180px]" />
                    <select name="category" value={form.category} onChange={handleChange} required className="border p-2 rounded flex-1 min-w-[160px]">
                        <option value="">Select Category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="level" value={form.level} onChange={handleChange} required className="border p-2 rounded flex-1 min-w-[140px]">
                        <option value="">Select Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (weeks)" type="number" min="1" required className="border p-2 rounded w-32 min-w-[120px]" />
                    <input name="price" value={form.price} onChange={handleChange} placeholder="Price ($)" type="number" min="0" required className="border p-2 rounded w-32 min-w-[100px]" />
                    <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="Thumbnail URL (optional)" className="border p-2 rounded flex-1 min-w-[200px]" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded w-full md:w-auto">{submitting ? 'Adding...' : 'Add Course'}</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-full overflow-x-hidden">
                    {courses.map((course, index) => (
                        <div key={course._id || index} className="relative group mb-4">
                            <CourseCard
                                icon={iconMap[index % iconMap.length]}
                                title={course.title}
                                description={course.description}
                                instructor={course.instructor || 'Unknown'}
                                avatar={course.avatar || `https://placehold.co/40x40/FFC0CB/000000?text=${course.title?.charAt(0) || 'C'}`}
                            />
                            <div className="absolute bottom-2 right-2 flex gap-2">
                                {user && (
                                    showMyCourses ?
                                        <button
                                            onClick={() => handleUnenroll(course._id)}
                                            className="bg-yellow-500 text-white rounded px-2 py-1"
                                            title="Unenroll"
                                        >
                                            Unenroll
                                        </button>
                                    :
                                        <button
                                            onClick={() => handleEnroll(course._id)}
                                            className="bg-green-600 text-white rounded px-2 py-1"
                                            title="Enroll"
                                        >
                                            Enroll
                                        </button>
                                )}
                            </div>
                            {/* Live Classes Button and Section (only in My Courses) */}
                            {showMyCourses && (
                                <div className="mt-4 flex flex-col gap-2">
                                    <button
                                        onClick={() => handleViewLiveClasses(course._id)}
                                        className="bg-blue-600 text-white rounded px-3 py-1"
                                    >
                                        {expandedCourseId === course._id ? 'Hide Live Classes' : 'View Live Classes'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/course/${course._id}`)}
                                        className="bg-purple-600 text-white rounded px-3 py-1"
                                    >
                                        Discussions
                                    </button>
                                    {expandedCourseId === course._id && (
                                        <div className="bg-gray-50 border rounded p-4 mt-2">
                                            {liveClassesLoading ? (
                                                <div>Loading live classes...</div>
                                            ) : liveClassesError ? (
                                                <div className="text-red-500">{liveClassesError}</div>
                                            ) : liveClasses.length === 0 ? (
                                                <div>No live classes for this course.</div>
                                            ) : (
                                                <ul className="space-y-3">
                                                    {liveClasses.map(lc => {
                                                        const alreadyJoined = lc.participants && user && lc.participants.some(p => p.student === user._id || p.student?._id === user._id);
                                                        return (
                                                            <li key={lc._id} className="border-b pb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                                                                <div>
                                                                    <div className="font-semibold">{lc.title}</div>
                                                                    <div className="text-sm text-gray-600">{lc.description}</div>
                                                                    <div className="text-xs text-gray-500">Teacher: {lc.teacher} | Date: {lc.date}</div>
                                                                </div>
                                                                {alreadyJoined ? (
                                                                    <div className="flex gap-2 mt-2 md:mt-0">
                                                                        <button
                                                                            className="bg-gray-400 text-white rounded px-2 py-1 cursor-not-allowed"
                                                                            disabled
                                                                        >
                                                                            Already Joined
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleLeaveLiveClass(lc._id)}
                                                                            className="bg-red-600 text-white rounded px-2 py-1"
                                                                        >
                                                                            Leave
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleJoinLiveClass(lc._id)}
                                                                        className="bg-green-600 text-white rounded px-2 py-1 mt-2 md:mt-0"
                                                                    >
                                                                        Join
                                                                    </button>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Courses;