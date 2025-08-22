import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBook, FaQuestionCircle, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaStar } from 'react-icons/fa';

// --- DUMMY DATA for Daily Quizzes ---
const initialQuizzes = [
  { id: 1, title: 'Mechanics - Force & Motion', subject: 'Physics', questions: 10, points: 20 },
  { id: 2, title: 'Organic Chemistry - Alkanes', subject: 'Chemistry', questions: 15, points: 30 },
  { id: 3, title: 'Modern History - The Revolt of 1857', subject: 'History', questions: 10, points: 10 },
  { id: 4, title: 'Calculus - Limits & Derivatives', subject: 'Maths', questions: 12, points: 24 },
];

const subjects = ['Physics', 'Chemistry', 'Maths', 'History', 'Biology'];

// --- Reusable Form Component for Teachers ---
const QuizForm = ({ onSave, quizToEdit, onCancelEdit }) => {
  const [formData, setFormData] = useState({ title: '', subject: subjects[0], questions: '', points: '' });

  useEffect(() => {
    if (quizToEdit) {
      setFormData(quizToEdit);
    }
  }, [quizToEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.questions || !formData.points) {
      alert('Please fill all fields.');
      return;
    }
    onSave(formData);
    setFormData({ title: '', subject: subjects[0], questions: '', points: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg space-y-4 sticky top-24">
      <h2 className="text-2xl font-bold">{quizToEdit ? 'Edit Quiz' : 'Create New Quiz'}</h2>
      <div><label className="block text-sm font-medium">Quiz Title (e.g., Mechanics - Force & Motion)</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
      <div><label className="block text-sm font-medium">Subject</label><select name="subject" value={formData.subject} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{subjects.map(s => <option key={s}>{s}</option>)}</select></div>
      <div className="flex gap-4">
        <div className="w-1/2"><label>Questions</label><input type="number" name="questions" value={formData.questions} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
        <div className="w-1/2"><label>Points</label><input type="number" name="points" value={formData.points} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
      </div>
      <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus flex items-center justify-center gap-2">
        {quizToEdit ? <><FaEdit/> Update Quiz</> : <><FaPlus/> Create Quiz</>}
      </button>
      {quizToEdit && <button type="button" onClick={onCancelEdit} className="w-full bg-slate-200 dark:bg-slate-600 font-bold py-2 rounded-lg">Cancel Edit</button>}
    </form>
  );
};

const QuizzesPage = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [quizToEdit, setQuizToEdit] = useState(null);

  const handleSaveQuiz = (quizData) => {
    if (quizData.id) {
      setQuizzes(quizzes.map(q => q.id === quizData.id ? quizData : q));
    } else {
      setQuizzes([...quizzes, { ...quizData, id: Date.now() }]);
    }
    setQuizToEdit(null);
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  // --- VIEW FOR GUESTS (NOT LOGGED IN) ---
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-6">
        <FaExclamationTriangle className="text-5xl text-amber-500 mb-4" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">You must be logged in to participate in quizzes.</p>
        <Link to="/login" className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 min-h-screen relative overflow-x-hidden">
      {/* Decorative floating book icon */}
      <FaBook className="hidden md:block absolute left-10 top-24 text-primary/10 dark:text-primary/20 text-[8rem] animate-float-slow z-0" />
      <FaStar className="hidden md:block absolute right-10 bottom-24 text-yellow-400/10 dark:text-yellow-400/20 text-[7rem] animate-float-slow2 z-0" />

      {/* Header */}
      <div className="py-12 text-center rounded-b-3xl">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white drop-shadow flex items-center justify-center gap-3">
          <FaBook className="text-4xl" /> Daily Topic Quizzes
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto px-4">
          {user.role === 'teacher' ? 'Create and manage daily quizzes for your students.' : 'Test your knowledge with these short, topic-wise quizzes.'}
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className={user.role === 'teacher' ? "grid grid-cols-1 lg:grid-cols-3 gap-12" : ""}>
          {user.role === 'teacher' && (
            <div className="lg:col-span-1">
              <QuizForm onSave={handleSaveQuiz} quizToEdit={quizToEdit} onCancelEdit={() => setQuizToEdit(null)} />
            </div>
          )}
          <div className={user.role === 'teacher' ? 'lg:col-span-2' : 'w-full'}>
            <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-light tracking-tight flex items-center gap-2">
              <FaBook className="text-2xl" /> Today's Quizzes
            </h2>
            {quizzes.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-500 py-12">
                <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
                No quizzes available right now. Check back soon!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {quizzes.map((quiz, idx) => (
                  <div
                    key={quiz.id}
                    className="relative group bg-white/80 dark:bg-dark-card/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col border border-primary/10 dark:border-primary/20 hover:scale-[1.045] hover:shadow-[0_8px_32px_0_rgba(0,123,255,0.18)] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 2px 16px 0 rgba(80,120,255,0.10)' }}
                  >
                    {/* Animated left bar */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary via-blue-400 to-green-400 dark:from-primary dark:via-blue-700 dark:to-green-700 animate-pulse rounded-l-3xl" />
                    {/* Floating badge for newest quiz */}
                    {idx === 0 && (
                      <span className="absolute right-4 top-4 z-10 bg-gradient-to-r from-green-400 via-blue-400 to-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">NEW</span>
                    )}
                    <div className="p-6 flex-grow flex flex-col gap-2">
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-3 py-1 rounded-full w-fit mb-1 tracking-wide shadow-sm">{quiz.subject}</span>
                      <h3 className="text-xl font-bold mt-1 dark:text-slate-200 flex items-center gap-2"><FaBook className="text-lg text-primary/60 dark:text-primary-light/70" /> {quiz.title}</h3>
                    </div>
                    <div className="px-6 py-4 bg-primary-light/40 dark:bg-slate-800/30 border-t flex items-center gap-4 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5"><FaQuestionCircle/> {quiz.questions} Questions</span>
                      <span className="flex items-center gap-1.5"><FaStar/> {quiz.points} Points</span>
                    </div>
                    <div className="p-4">
                      {user.role === 'teacher' ? (
                        <div className="flex gap-2">
                          <button onClick={() => setQuizToEdit(quiz)} className="w-full bg-primary/10 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/30 hover:text-primary-focus transition-all duration-150 shadow-sm"><FaEdit/> Edit</button>
                          <button onClick={() => handleDeleteQuiz(quiz.id)} className="w-full bg-red-500/10 text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/30 hover:text-red-600 transition-all duration-150 shadow-sm"><FaTrash/> Delete</button>
                        </div>
                      ) : (
                        <button className="w-full bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white font-bold py-2 rounded-lg hover:from-primary-focus hover:to-green-500 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-150 scale-100 group-hover:scale-105"><FaBook/> Start Quiz</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating animation keyframes for badges and icons */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
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
      `}</style>
    </div>
  );
};
export default QuizzesPage;