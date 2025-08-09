import React, { useEffect, useState } from 'react';
import { getStudyPlans, createStudyPlan, deleteStudyPlan } from '../api/studyPlan';
import { toast } from 'react-toastify';

const StudyPlan = () => {
    const [studyPlans, setStudyPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ student: '', plan: '', startDate: '', endDate: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchStudyPlans = () => {
        setLoading(true);
        getStudyPlans()
            .then(res => setStudyPlans(res.data))
            .catch(() => {
                setError('Failed to load study plans');
                toast.error('Failed to load study plans');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchStudyPlans();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        createStudyPlan(form)
            .then(() => {
                toast.success('Study plan created!');
                setForm({ student: '', plan: '', startDate: '', endDate: '' });
                fetchStudyPlans();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to create study plan');
            })
            .finally(() => setSubmitting(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this study plan?')) return;
        deleteStudyPlan(id)
            .then(() => {
                toast.success('Study plan deleted!');
                setStudyPlans(studyPlans.filter(sp => sp._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Study Plans</h2>
                </div>
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-end">
                    <input name="student" value={form.student} onChange={handleChange} placeholder="Student" required className="border p-2 rounded flex-1" />
                    <input name="plan" value={form.plan} onChange={handleChange} placeholder="Plan" required className="border p-2 rounded flex-1" />
                    <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Start Date" type="date" required className="border p-2 rounded flex-1" />
                    <input name="endDate" value={form.endDate} onChange={handleChange} placeholder="End Date" type="date" required className="border p-2 rounded flex-1" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">{submitting ? 'Adding...' : 'Add Study Plan'}</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {studyPlans.map((sp) => (
                        <div key={sp._id} className="relative group bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-2">{sp.student}</h3>
                            <p className="text-gray-600 mb-2">Plan: {sp.plan}</p>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">{sp.startDate} - {sp.endDate}</span>
                                <button
                                    onClick={() => handleDelete(sp._id)}
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

export default StudyPlan; 