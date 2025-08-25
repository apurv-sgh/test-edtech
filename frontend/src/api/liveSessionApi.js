import apit from './apit'; // Import the configured Axios instance

/**
 * Fetches the list of live sessions.
 * The backend will automatically filter sessions based on the user's role (teacher vs student)
 * because the auth token is sent with the request.
 */
const teacherToken = localStorage.getItem('teacherToken');
export const getLiveSessions = () => {
  return apit.get('/api/live-sessions', {
    headers: {
      Authorization: `Bearer ${teacherToken}`
    }
  });
};


/**
 * Creates a new live session.
 */
export const createLiveSession = (sessionData) => {
  return apit.post('/api/live-sessions', sessionData);
};

/**
 * Updates an existing live session by its ID.
 */
export const updateLiveSession = (id, sessionData) => {
  return apit.put(`/api/live-sessions/${id}`, sessionData);
};

/**
 * Deletes a live session by its ID.
 */
export const deleteLiveSession = (id) => {
  return apit.delete(`/api/live-sessions/${id}`);
};