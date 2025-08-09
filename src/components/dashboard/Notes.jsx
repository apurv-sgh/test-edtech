import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { downloadNote } from '../../api/notes';
import { toast } from 'react-toastify';
import { FiDownload, FiBookOpen, FiFileText, FiCalendar } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

const Notes = () => {
  const { notes, courses, loading, error } = useDashboard();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchParams] = useSearchParams();

  // Check for course parameter in URL and set it as default
  useEffect(() => {
    const courseParam = searchParams.get('course');
    if (courseParam) {
      setSelectedCourse(courseParam);
    }
  }, [searchParams]);

  const handleDownload = async (noteId, fileName) => {
    try {
      const response = await downloadNote(noteId);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Note downloaded successfully!');
    } catch (error) {
      console.error('Error downloading note:', error);
      if (error.response?.status === 404) {
        toast.error('File not found on server');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You are not enrolled in this course.');
      } else {
        toast.error('Failed to download note');
      }
    }
  };

  // Group notes by course
  const groupNotesByCourse = (notes) => {
    return notes.reduce((acc, note) => {
      const courseId = note.course;
      if (!acc[courseId]) {
        acc[courseId] = [];
      }
      acc[courseId].push(note);
      return acc;
    }, {});
  };

  // Filter notes by selected course
  const filteredNotes = selectedCourse === 'all' 
    ? notes 
    : notes.filter(note => note.course === selectedCourse);

  const groupedNotes = groupNotesByCourse(filteredNotes);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Course Notes</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl shadow-md">
          <FiBookOpen className="mx-auto h-20 w-20 text-slate-300 mb-6" />
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No notes available
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Your instructors haven't uploaded any notes yet. Check back later or contact your instructor for course materials.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedNotes).length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-dark-card rounded-xl shadow-md">
              <FiFileText className="mx-auto h-16 w-16 text-slate-300" />
              <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">
                No notes for selected course
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Try selecting a different course or check back later.
              </p>
            </div>
          ) : (
            Object.entries(groupedNotes).map(([courseId, courseNotes]) => {
              const course = courses.find(c => c._id === courseId);
              return (
                <div key={courseId}>
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-primary-light pb-2">
                    {course ? course.title : 'Unknown Course'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courseNotes.map((note) => (
                      <div key={note._id} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                              {note.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                              <FiCalendar className="h-4 w-4" />
                              <span>
                                {new Date(note.uploadDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <FiFileText className="h-6 w-6 text-primary ml-2" />
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            File: {note.fileName}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDownload(note._id, note.fileName)}
                          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors flex items-center justify-center space-x-2 font-medium"
                        >
                          <FiDownload className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Recent Notes Section */}
      {notes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Recently Added Notes</h2>
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
            <div className="space-y-4">
              {notes
                .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
                .slice(0, 5)
                .map((note) => {
                  const course = courses.find(c => c._id === note.course);
                  return (
                    <div key={note._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FiFileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">{note.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {course ? course.title : 'Unknown Course'} • {new Date(note.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(note._id, note.fileName)}
                        className="text-primary hover:text-primary-focus p-2"
                      >
                        <FiDownload className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes; 