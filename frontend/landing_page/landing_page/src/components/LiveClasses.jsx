import React, { useEffect, useState } from 'react';
import { getLiveClasses, createLiveClass, deleteLiveClass, getCourseLiveClasses, joinLiveClass, leaveLiveClass } from '../api/liveClasses';
import { getCourses } from '../api/courses';
import { toast } from 'react-toastify';

const LiveClasses = () => {
    const [liveClasses, setLiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', teacher: '', date: '' });
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');

    const fetchLiveClasses = () => {
        setLoading(true);
        const fetch = selectedCourse ? getCourseLiveClasses(selectedCourse) : getLiveClasses();
        fetch
            .then(res => setLiveClasses(res.data))
            .catch(() => {
                setError('Failed to load live classes');
                toast.error('Failed to load live classes');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
    }, []);

    useEffect(() => {
        fetchLiveClasses();
        // eslint-disable-next-line
    }, [selectedCourse]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        createLiveClass(form)
            .then(() => {
                toast.success('Live class created!');
                setForm({ title: '', description: '', teacher: '', date: '' });
                fetchLiveClasses();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to create live class');
            })
            .finally(() => setSubmitting(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this live class?')) return;
        deleteLiveClass(id)
            .then(() => {
                toast.success('Live class deleted!');
                setLiveClasses(liveClasses.filter(lc => lc._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleJoin = (id) => {
        joinLiveClass(id)
            .then(() => {
                toast.success('Joined live class!');
                fetchLiveClasses();
            })
            .catch(() => toast.error('Failed to join'));
    };

    const handleLeave = (id) => {
        leaveLiveClass(id)
            .then(() => {
                toast.success('Left live class!');
                fetchLiveClasses();
            })
            .catch(() => toast.error('Failed to leave'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Live Classes</h2>
                    <select value={selectedCourse} onChange={handleCourseChange} className="border p-2 rounded">
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                </div>
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-end">
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border p-2 rounded flex-1" />
                    <input name="teacher" value={form.teacher} onChange={handleChange} placeholder="Teacher" required className="border p-2 rounded flex-1" />
                    <input name="date" value={form.date} onChange={handleChange} placeholder="Date" type="date" required className="border p-2 rounded flex-1" />
                    <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border p-2 rounded flex-1" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">{submitting ? 'Adding...' : 'Add Live Class'}</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {liveClasses.map((lc) => (
                        <div key={lc._id} className="relative group bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-2">{lc.title}</h3>
                            <p className="text-gray-600 mb-2">{lc.description}</p>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">{lc.teacher}</span>
                                <span className="text-xs text-gray-500">{lc.date}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleJoin(lc._id)}
                                    className="bg-green-600 text-white rounded px-2 py-1"
                                    title="Join"
                                >
                                    Join
                                </button>
                                <button
                                    onClick={() => handleLeave(lc._id)}
                                    className="bg-yellow-500 text-white rounded px-2 py-1"
                                    title="Leave"
                                >
                                    Leave
                                </button>
                                <button
                                    onClick={() => handleDelete(lc._id)}
                                    className="bg-red-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                                    title="Delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LiveClasses; 