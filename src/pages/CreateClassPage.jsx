import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const categories = ['JEE', 'NEET', 'UPSC', 'Class 12th', 'Class 11th'];

const CreateClassPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        subject: '',
        // Pre-fill teacher name if logged in as a teacher
        teacher: user?.role === 'teacher' ? user.name: '',
        description: '',
        category: categories[0],
        date: '',
        time: ''
    });

    const handleInputChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.subject || formData.teacher || !formData.date || !formData.time) {
            alert('Please fill all required fields');
            return;
        }
        console.log("New Class Scheduled: ", formData);
        alert("Live Class scheduled successfully!");
        navigate('/live-classes');
    };

    // This is a protected page. If not a teacher, show an access denied message.
    if (user?.role !== 'teacher'){
        return (
            <div className="text-center py-20 min-h-screen">
                <h1 className="text-3xl font-bold">Access Denied</h1>
                <p className="mt-2 tet-slate-500">Only teachers can create live classes.</p>
            </div>
        );
    }

    return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Create a New Live Session</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto px-4">
          Fill out the form below to schedule your next live class.
        </p>
      </div>
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg space-y-4">
          <div><label className="block text-sm font-medium">Subject Name</label><input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
          <div><label className="block text-sm font-medium">Teacher Name</label><input type="text" name="teacher" value={formData.teacher} onChange={handleInputChange} className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
          <div><label className="block text-sm font-medium">Description (Moto)</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"></textarea></div>
          <div><label className="block text-sm font-medium">Category</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
          <div className="flex gap-4"><div className="w-1/2"><label className="block text-sm font-medium">Date</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div><div className="w-1/2"><label className="block text-sm font-medium">Start Time</label><input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div></div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">Schedule Class</button>
        </form>
      </div>
    </div>
  );
};
export default CreateClassPage;