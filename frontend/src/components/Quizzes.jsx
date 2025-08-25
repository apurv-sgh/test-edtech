import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getQuizzes, createQuiz, deleteQuiz, getQuizzesForCourse, createQuizForCourse, updateQuizDetails } from '../api/quizzes';
import { getCourses } from '../api/courses';
import { toast } from 'react-toastify';

const Quizzes = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', author: '' });
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [editQuizId, setEditQuizId] = useState(null);

    const fetchQuizzes = () => {
        setLoading(true);
        const fetch = selectedCourse ? getQuizzesForCourse(selectedCourse) : getQuizzes();
        fetch
            .then(res => setQuizzes(res.data))
            .catch(() => {
                setError('Failed to load quizzes');
                toast.error('Failed to load quizzes');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
    }, []);

    useEffect(() => {
        fetchQuizzes();
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
        if (editQuizId) {
            updateQuizDetails(editQuizId, form)
                .then(() => {
                    toast.success('Quiz updated!');
                    setForm({ title: '', description: '', author: '' });
                    setEditQuizId(null);
                    fetchQuizzes();
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || 'Failed to update quiz');
                })
                .finally(() => setSubmitting(false));
        } else {
            const create = selectedCourse ? createQuizForCourse(selectedCourse, form) : createQuiz(form);
            create
                .then(() => {
                    toast.success('Quiz created!');
                    setForm({ title: '', description: '', author: '' });
                    fetchQuizzes();
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || 'Failed to create quiz');
                })
                .finally(() => setSubmitting(false));
        }
    };

    const handleEdit = (quiz) => {
        setEditQuizId(quiz._id);
        setForm({
            title: quiz.title ?? '',
            description: quiz.description ?? '',
            author: quiz.author ?? '',
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this quiz?')) return;
        deleteQuiz(id)
            .then(() => {
                toast.success('Quiz deleted!');
                setQuizzes(quizzes.filter(q => q._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Quizzes</h2>
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
                    <input name="title" value={form.title ?? ''} onChange={handleChange} placeholder="Title" required className="border p-2 rounded flex-1" />
                    <input name="author" value={form.author ?? ''} onChange={handleChange} placeholder="Author" required className="border p-2 rounded flex-1" />
                    <input name="description" value={form.description ?? ''} onChange={handleChange} placeholder="Description" required className="border p-2 rounded flex-1" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">
                        {submitting ? (editQuizId ? 'Updating...' : 'Adding...') : (editQuizId ? 'Update Quiz' : 'Add Quiz')}
                    </button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className={`relative group bg-white p-6 rounded-xl shadow-md ${user?.role === 'teacher' ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                            onClick={() => {
                                if (user?.role === 'teacher') {
                                    navigate('/assessment-form');
                                }
                            }}
                        >
                            <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                            <p className="text-gray-600 mb-4">{quiz.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{quiz.author}</span>
                                <div>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleEdit(quiz); }}
                                        className="bg-blue-500 text-white rounded px-2 py-1 mr-2 opacity-0 group-hover:opacity-100 transition"
                                        title="Edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDelete(quiz._id); }}
                                        className="bg-red-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                                        title="Delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Quizzes;