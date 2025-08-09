import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaClipboardList, FaQuestionCircle, FaClock, FaPlay, FaEdit, FaTrash, FaPlus, FaExclamationTriangle, FaBookOpen, FaFilter } from 'react-icons/fa';

// --- DUMMY DATA and CATEGORIES ---
const initialTests = [
  { id: 1, title: 'JEE Main - Full Syllabus Mock Test 1', category: 'JEE', questions: 90, duration: '180 mins' },
  { id: 2, title: 'NEET Biology - Mock Test 3', category: 'NEET', questions: 100, duration: '90 mins' },
  { id: 3, title: 'UPSC Prelims - CSAT Practice 1', category: 'UPSC', questions: 80, duration: '120 mins' },
  { id: 4, title: 'Class 12th Physics - Term 2', category: 'Class 12th', questions: 60, duration: '90 mins' },
];
const categories = ['All', 'JEE', 'NEET', 'UPSC', 'Class 12th'];

// A reusable Form component for the Teacher's view
const TestSeriesForm = ({ onSave, testToEdit, onCancelEdit }) => {
  const [formData, setFormData] = useState({ title: '', category: categories[0], questions: '', duration: '' });

  useEffect(() => {
    if (testToEdit) {
      setFormData(testToEdit);
    }
  }, [testToEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.questions || !formData.duration) {
      alert('Please fill all fields.');
      return;
    }
    onSave(formData);
    setFormData({ title: '', category: categories[0], questions: '', duration: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg space-y-4 sticky top-24">
      <h2 className="text-2xl font-bold">{testToEdit ? 'Edit Test Series' : 'Create New Test Series'}</h2>
      <div><label className="block text-sm font-medium">Test Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
      <div><label className="block text-sm font-medium">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
      <div className="flex gap-4">
        <div className="w-1/2"><label>Questions</label><input type="number" name="questions" value={formData.questions} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
        <div className="w-1/2"><label>Duration (mins)</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
      </div>
      <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus flex items-center justify-center gap-2">
        {testToEdit ? <><FaEdit/> Update Test</> : <><FaPlus/> Create Test</>}
      </button>
      {testToEdit && <button type="button" onClick={onCancelEdit} className="w-full bg-slate-200 dark:bg-slate-600 font-bold py-2 rounded-lg">Cancel Edit</button>}
    </form>
  );
};


const TestSeriesPage = () => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState(initialTests);
  const [testToEdit, setTestToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSaveTest = (testData) => {
    if (testData.id) {
      setTests(tests.map(t => t.id === testData.id ? testData : t));
    } else {
      setTests([...tests, { ...testData, id: Date.now() }]);
    }
    setTestToEdit(null);
  };

  const handleDeleteTest = (id) => {
    if (window.confirm('Are you sure you want to delete this test series?')) {
      setTests(tests.filter(t => t.id !== id));
    }
  };

  const handleEdit = (test) => setTestToEdit(test);

  // Filter tests by selected category
  const filteredTests = selectedCategory === 'All' ? tests : tests.filter(t => t.category === selectedCategory);

  // --- VIEW FOR GUESTS (NOT LOGGED IN) ---
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-6">
        <FaExclamationTriangle className="text-5xl text-amber-500 mb-4" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">You must be logged in to view the Test Series.</p>
        <Link to="/login" className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus">Go to Login</Link>
      </div>
    );
  }

  // --- MAIN VIEW FOR LOGGED-IN USERS (STUDENTS & TEACHERS) ---
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 min-h-screen relative overflow-x-hidden">
      {/* Decorative floating books */}
      <FaBookOpen className="hidden md:block absolute left-10 top-24 text-primary/10 dark:text-primary/20 text-[8rem] animate-float-slow z-0" />
      <FaBookOpen className="hidden md:block absolute right-10 bottom-24 text-blue-400/10 dark:text-blue-700/20 text-[7rem] animate-float-slow2 z-0" />

      {/* Header */}
      <div className="relative py-12 text-center rounded-b-3xl">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white drop-shadow flex items-center justify-center gap-3">
          <FaClipboardList className="text-4xl" /> Test Series
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto px-4">
          {user.role === 'teacher' ? 'Create and manage test series for your students.' : 'Evaluate your preparation with our curated mock tests.'}
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className={user.role === 'teacher' ? "grid grid-cols-1 lg:grid-cols-3 gap-12" : ""}>
          {/* Left Column: FORM (ONLY for Teachers) */}
          {user.role === 'teacher' && (
            <div className="lg:col-span-1">
              <TestSeriesForm onSave={handleSaveTest} testToEdit={testToEdit} onCancelEdit={() => setTestToEdit(null)} />
            </div>
          )}
          {/* Main Content: List of Tests (Spans full width for students) */}
          <div className={user.role === 'teacher' ? 'lg:col-span-2' : 'w-full'}>
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 items-center">
              <span className="text-primary dark:text-primary-light font-semibold flex items-center gap-1"><FaFilter/> Filter:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 rounded-full font-semibold border transition-all duration-150 text-sm shadow-sm ${selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white/70 dark:bg-dark-card/70 border-primary/20 dark:border-primary/30 text-primary dark:text-primary-light hover:bg-primary/10'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-light tracking-tight flex items-center gap-2">
              <FaClipboardList className="text-2xl" /> Available Tests
            </h2>
            {filteredTests.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-500 py-12">
                <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
                No test series found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTests.map((test, idx) => (
                  <div
                    key={test.id}
                    className="relative group bg-white/80 dark:bg-dark-card/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col border border-primary/10 dark:border-primary/20 hover:scale-[1.04] hover:shadow-[0_8px_32px_0_rgba(0,123,255,0.15)] transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 2px 16px 0 rgba(80,120,255,0.08)' }}
                  >
                    {/* Animated left bar */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary via-blue-400 to-green-400 dark:from-primary dark:via-blue-700 dark:to-green-700 animate-pulse rounded-l-3xl" />
                    {/* New badge for first 2 tests */}
                    {idx < 2 && (
                      <span className="absolute right-4 top-4 z-10 bg-gradient-to-r from-green-400 via-blue-400 to-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">NEW</span>
                    )}
                    <div className="p-6 flex-grow flex flex-col gap-2">
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-3 py-1 rounded-full w-fit mb-1 tracking-wide shadow-sm">{test.category}</span>
                      <h3 className="text-xl font-bold mt-1 dark:text-slate-200 flex items-center gap-2"><FaBookOpen className="text-lg text-primary/60 dark:text-primary-light/70" /> {test.title}</h3>
                    </div>
                    <div className="px-6 py-4 bg-primary-light/40 dark:bg-slate-800/30 border-t flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5"><FaQuestionCircle/> {test.questions} Qs</span>
                      <span className="flex items-center gap-1.5"><FaClock/> {test.duration}</span>
                    </div>
                    <div className="p-4">
                      {user.role === 'teacher' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(test)} className="w-full bg-primary/10 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/30 hover:text-primary-focus transition-all duration-150"><FaEdit/> Edit</button>
                          <button onClick={() => handleDeleteTest(test.id)} className="w-full bg-red-500/10 text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/30 hover:text-red-600 transition-all duration-150"><FaTrash/> Delete</button>
                        </div>
                      ) : (
                        <button className="w-full bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white font-bold py-2 rounded-lg hover:from-primary-focus hover:to-green-500 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-150 scale-100 group-hover:scale-105"><FaPlay/> Start Test</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-18px) rotate(6deg); }
          100% { transform: translateY(0px) rotate(-6deg); }
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        @keyframes float-slow2 {
          0% { transform: translateY(0px) rotate(8deg); }
          50% { transform: translateY(16px) rotate(-8deg); }
          100% { transform: translateY(0px) rotate(8deg); }
        }
        .animate-float-slow2 { animation: float-slow2 8s ease-in-out infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
      `}</style>
    </div>
  );
};

export default TestSeriesPage;