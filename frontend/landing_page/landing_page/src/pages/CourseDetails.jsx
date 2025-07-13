import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseDiscussions, addComment, toggleLike } from '../api/discussions';
import { getCourse } from '../api/courses';
import { getQuizzesForCourse } from '../api/quizzes';
import { toast } from 'react-toastify';
import { FiPlay, FiClock, FiUser, FiStar, FiBookOpen, FiMessageCircle, FiFileText, FiList } from 'react-icons/fi';
import CourseDiscussions from '../components/CourseDiscussions';

const TABS = [
  { key: 'overview', label: 'Overview', icon: <FiBookOpen /> },
  { key: 'notes', label: 'Notes', icon: <FiFileText /> },
  { key: 'discussions', label: 'Discussions', icon: <FiMessageCircle /> },
  { key: 'quizzes', label: 'Quizzes', icon: <FiList /> },
];

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCourse(courseId).then(res => setCourse(res.data)),
      getCourseDiscussions(courseId).then(res => setDiscussions(res.data)),
      getQuizzesForCourse(courseId).then(res => setQuizzes(res.data)),
    ])
      .catch(() => setError('Failed to load course details'))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (course) setLessons(course.lessons || []);
  }, [course]);

  const handleSelectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
    setComment('');
    setActiveTab('discussions');
  };

  const handleAddComment = () => {
    if (!comment) return toast.error('Enter a comment');
    setSubmitting(true);
    addComment(selectedDiscussion._id, { content: comment })
      .then(() => {
        toast.success('Comment added!');
        setComment('');
        // Refresh discussions and selected discussion
        return getCourseDiscussions(courseId).then(res => {
          setDiscussions(res.data);
          const updated = res.data.find(d => d._id === selectedDiscussion._id);
          setSelectedDiscussion(updated);
        });
      })
      .catch(() => toast.error('Failed to add comment'))
      .finally(() => setSubmitting(false));
  };

  const handleLike = () => {
    toggleLike(selectedDiscussion._id)
      .then(() => {
        toast.success('Toggled like!');
        // Refresh discussions and selected discussion
        return getCourseDiscussions(courseId).then(res => {
          setDiscussions(res.data);
          const updated = res.data.find(d => d._id === selectedDiscussion._id);
          setSelectedDiscussion(updated);
        });
      })
      .catch(() => toast.error('Failed to like'));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Course Summary Card */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300 text-sm mb-2">
            <span className="flex items-center gap-1"><FiUser /> {course.instructor || 'Unknown'}</span>
            <span className="flex items-center gap-1"><FiClock /> {course.duration} weeks</span>
            <span className="flex items-center gap-1"><FiStar className="text-yellow-500" /> {course.rating?.toFixed(1) || '0.0'}</span>
            <span className="flex items-center gap-1"><FiBookOpen /> {course.category}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-2">{course.description}</p>
        </div>
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-40 h-40 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-700 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors text-sm md:text-base
              ${activeTab === tab.key ? 'bg-primary text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-primary/10'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow p-6 min-h-[300px]">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Lessons</h2>
            {lessons.length === 0 ? (
              <div className="text-slate-500">No lessons available for this course.</div>
            ) : (
              <ul className="space-y-3">
                {lessons.map(lesson => (
                  <li key={lesson._id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2">
                    <div>
                      <div className="font-semibold">{lesson.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{lesson.content}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => window.open('https://www.example.com/lesson', '_blank')}
                        className="bg-blue-600 text-white rounded px-3 py-1"
                      >
                        Watch
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === 'notes' && (
          <div className="text-slate-600 dark:text-slate-300">
            <h2 className="text-xl font-bold mb-4">Notes</h2>
            <p>Access your notes for this course from the <Link to={`/profile/notes?course=${courseId}`} className="text-primary underline">Notes page</Link>.</p>
          </div>
        )}
        {activeTab === 'discussions' && (
          <div>
            <CourseDiscussions courseId={courseId} />
          </div>
        )}
        {activeTab === 'quizzes' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Quizzes</h2>
            {quizzes.length === 0 ? (
              <div className="text-slate-500">No quizzes available for this course.</div>
            ) : (
              <ul className="space-y-3">
                {quizzes.map(quiz => (
                  <li key={quiz._id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2">
                    <div>
                      <div className="font-semibold">{quiz.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{quiz.description}</div>
                    </div>
                    <button
                      onClick={() => window.open('https://www.example.com/quiz', '_blank')}
                      className="bg-orange-600 text-white rounded px-3 py-1 mt-2 md:mt-0"
                    >
                      Attempt Quiz
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails; 