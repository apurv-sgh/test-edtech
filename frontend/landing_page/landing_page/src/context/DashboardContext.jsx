import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getMyCourses } from '../api/courses';
import { getStudyPlans } from '../api/studyPlan';
import { getNotes } from '../api/notes';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [coursesRes, studyPlansRes, notesRes] = await Promise.all([
        getMyCourses(),
        getStudyPlans(),
        getNotes()
      ]);
      
      setCourses(coursesRes.data || []);
      setStudyPlans(studyPlansRes.data || []);
      setNotes(notesRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const refreshData = () => {
    fetchDashboardData();
  };

  const value = {
    courses,
    studyPlans,
    notes,
    loading,
    error,
    refreshData,
    setCourses,
    setStudyPlans,
    setNotes
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}; 