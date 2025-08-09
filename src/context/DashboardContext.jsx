import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getMyCourses } from '../api/courses';
import { getStudyPlans } from '../api/studyPlan';
import { getNotes } from '../api/notes';
import { getDiscussions } from '../api/discussions';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    // Wait until token exists in localStorage (max 500ms)
  const waitForToken = async () => {
    const maxRetries = 10;
    let retries = 0;
    while (!localStorage.getItem('token') && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 100)); // wait 50ms
      retries++;
    }
  };

  await waitForToken();

    setLoading(true);
    setError(null);
    
    try {
      const [coursesRes, studyPlansRes, notesRes, discussionsRes] = await Promise.all([
        getMyCourses(),
        getStudyPlans(),
        getNotes(),
        getDiscussions()
      ]);
      
      //  console.log('Fetched courses:', coursesRes.data);
  // console.log('Fetched notes:', notesRes.data);
  console.log('Fetched Discussions:', discussionsRes.data);

      setCourses(coursesRes.data || []);
      setStudyPlans(studyPlansRes.data || []);
      setNotes(notesRes.data || []);
      setDiscussions(discussionsRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && localStorage.getItem('token')) {
    fetchDashboardData();
    }
  }, [user]);

  const refreshData = () => {
    fetchDashboardData();
  };

  const value = {
    courses,
    studyPlans,
    notes,
    discussions,
    loading,
    error,
    refreshData,
    setCourses,
    setStudyPlans,
    setNotes,
    setDiscussions
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}; 