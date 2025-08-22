import React, { useEffect, useState } from 'react';
import { getTests, createTest, deleteTest, getTestsForCourse, createTestForCourse } from '../api/tests';
import { getCourses } from '../api/courses';
import { toast } from 'react-toastify';

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ title: '', subject: '', date: '' });
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');

    const fetchTests = () => {
        setLoading(true);
        const fetch = selectedCourse ? getTestsForCourse(selectedCourse) : getTests();
        fetch
            .then(res => setTests(res.data))
            .catch(() => {
                setError('Failed to load tests');
                toast.error('Failed to load tests');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
    }, []);

    useEffect(() => {
        fetchTests();
        // eslint-disable-next-line
    }, [selectedCourse]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const create = selectedCourse ? createTestForCourse(selectedCourse, form) : createTest(form);
        create
            .then(() => {
                toast.success('Test created!');
                setForm({ title: '', subject: '', date: '' });
                fetchTests();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to create test');
            })
            .finally(() => setSubmitting(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this test?')) return;
        deleteTest(id)
            .then(() => {
                toast.success('Test deleted!');
                setTests(tests.filter(t => t._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Tests</h2>
                    <select value={selectedCourse} onChange={handleCourseChange} className="border p-2 rounded">
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                </div>
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-end">
                    <select value={selectedCourse} onChange={handleCourseChange} className="border p-2 rounded">
                        <option value="">Select Course (optional)</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border p-2 rounded flex-1" />
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required className="border p-2 rounded flex-1" />
                    <input name="date" value={form.date} onChange={handleChange} placeholder="Date" type="date" required className="border p-2 rounded flex-1" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">{submitting ? 'Adding...' : 'Add Test'}</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tests.map((test) => (
                        <div key={test._id} className="relative group bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                            <p className="text-gray-600 mb-2">Subject: {test.subject}</p>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">{test.date}</span>
                                <button
                                    onClick={() => handleDelete(test._id)}
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

export default Tests; 