import api from './api';

export const getNotes = () => api.get('/api/notes');
export const getNotesByCourse = (courseId) => api.get(`/api/notes/course/${courseId}`);
export const createNote = (data) => api.post('/api/notes', data);
export const updateNote = (id, data) => api.put(`/api/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);
export const uploadNote = (courseId, file) => {
  const formData = new FormData();
  formData.append('noteFile', file);
  return api.post(`/api/notes/course/${courseId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const downloadNote = (id) => api.get(`/api/notes/${id}/download`, { 
  responseType: 'blob' 
});
export const getNotesForCourse = (courseId) => api.get(`/api/notes/course/${courseId}`); 