import api from './api';

export const getQuizzes = () => api.get('/api/quizzes');
export const getQuiz = (id) => api.get(`/api/quizzes/${id}`);
export const createQuiz = (data) => api.post('/api/quizzes', data);
export const updateQuiz = (id, data) => api.put(`/api/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/api/quizzes/${id}`);
export const getQuizzesForCourse = (courseId) => api.get(`/api/quizzes/courses/${courseId}`);
export const createQuizForCourse = (courseId, data) => api.post(`/api/quizzes/courses/${courseId}`, data); 