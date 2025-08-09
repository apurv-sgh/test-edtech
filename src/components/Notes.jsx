import React, { useEffect, useState } from 'react';
import { getNotes, createNote, deleteNote, uploadNote, downloadNote, getNotesForCourse } from '../api/notes';
import { getCourses } from '../api/courses';
import { toast } from 'react-toastify';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', author: '' });
    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');

    const fetchNotes = () => {
        setLoading(true);
        const fetch = selectedCourse ? getNotesForCourse(selectedCourse) : getNotes();
        fetch
            .then(res => setNotes(res.data))
            .catch(() => {
                setError('Failed to load notes');
                toast.error('Failed to load notes');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
    }, []);

    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line
    }, [selectedCourse]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        createNote(form)
            .then(() => {
                toast.success('Note created!');
                setForm({ title: '', content: '', author: '' });
                fetchNotes();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to create note');
            })
            .finally(() => setSubmitting(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this note?')) return;
        deleteNote(id)
            .then(() => {
                toast.success('Note deleted!');
                setNotes(notes.filter(n => n._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!selectedCourse || !file) return toast.error('Select course and file');
        uploadNote(selectedCourse, file)
            .then(() => {
                toast.success('Note uploaded!');
                setFile(null);
                fetchNotes();
            })
            .catch(() => toast.error('Upload failed'));
    };

    const handleDownload = (id, title) => {
        downloadNote(id)
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', title || 'note.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(() => toast.error('Download failed'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Notes</h2>
                    <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="border p-2 rounded">
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                </div>
                <form onSubmit={handleUpload} className="mb-4 flex gap-2 items-end">
                    <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="border p-2 rounded">
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                    <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Upload Note</button>
                </form>
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-end">
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border p-2 rounded flex-1" />
                    <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required className="border p-2 rounded flex-1" />
                    <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required className="border p-2 rounded flex-1" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">{submitting ? 'Adding...' : 'Add Note'}</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notes.map((note) => (
                        <div key={note._id} className="relative group bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                            <p className="text-gray-600 mb-4">{note.content}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{note.author}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(note._id, note.title)}
                                        className="bg-blue-500 text-white rounded px-2 py-1"
                                        title="Download"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
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

export default Notes; 