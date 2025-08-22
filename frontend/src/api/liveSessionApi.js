import api from './api'; // Import the configured Axios instance

/**
 * Fetches the list of live sessions.
 * The backend will automatically filter sessions based on the user's role (teacher vs student)
 * because the auth token is sent with the request.
 */
export const getLiveSessions = () => {
  return api.get('/api/live-sessions');
};

/**
 * Creates a new live session.
 */
export const createLiveSession = (sessionData) => {
  return api.post('/api/live-sessions', sessionData);
};

/**
 * Updates an existing live session by its ID.
 */
export const updateLiveSession = (id, sessionData) => {
  return api.put(`/api//live-sessions/${id}`, sessionData);
};

/**
 * Deletes a live session by its ID.
 */
export const deleteLiveSession = (id) => {
  return api.delete(`/api//live-sessions/${id}`);
};