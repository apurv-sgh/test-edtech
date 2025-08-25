
import apit from './apit';
import { getCourses } from './courses';

/**
 * Updates a quiz by its ID.
 * @param {string} quizId - The ID of the quiz to update.
 * @param {object} quizData - The updated quiz data.
 * @returns {Promise} Axios response promise.
 */
export const updateQuizDetails = (quizId, quizData) => {
    // Only send fields that are allowed to be updated
    const payload = {
        title: quizData.title,
        description: quizData.description,
        subject: quizData.subject,
        questions: quizData.questions,
        points: quizData.points,
    };
    return apit.put(`/api/quizzes/${quizId}`, payload);
};
// import api from './api';

// export const getQuizzes = () => api.get('/api/quizzes');
// export const getQuiz = (id) => api.get(`/api/quizzes/${id}`);
// export const createQuiz = (data) => api.post('/api/quizzes', data);
export const updateQuiz = (id, data) => apit.put(`/api/quizzes/${id}`, data);
// export const getQuizById = (id) => axios.get(`${API_URL}/${id}`);

// export const deleteQuiz = (id) => api.delete(`/api/quizzes/${id}`);
// export const getQuizzesForCourse = (courseId) => api.get(`/api/quizzes/courses/${courseId}`);
// export const createQuizForCourse = (courseId, data) => api.post(`/api/quizzes/courses/${courseId}`, data); 


// src/api/quizzes.js

/**
 * Fetches all quizzes from the backend and transforms them
 * into the shape the frontend component expects.
 */

export const getQuizById = (id) => {
    return api.get(`/api/quizzes/:${id}`, (req, res) => {
  const quizzes = readQuizzes();
  const quiz = quizzes.find(q => q._id === req.params.id);
  if (quiz) {
    res.status(200).json(quiz);
  } else {
    res.status(404).json({ message: 'Quiz not found' });
  }
});
}

export const getQuizzes = () => {
    return apit.get('/api/quizzes').then(res => {
        // Backend returns { success: true, quizzes: [...] }
        // The frontend expects the data property to be the array itself.
        const quizzes = res.data.quizzes.map(q => ({
            ...q,
            _id: q.id, // Map backend 'id' to frontend '_id' for keys and delete function
            author: q.teacher?.name || 'Unknown Author', // Map 'teacher.name' to 'author'
        }));
        // Return a response object that mimics a direct axios response
        return { ...res, data: quizzes };
    });
};

/**
 * Fetches all quizzes and filters them by course on the client-side.
 * This is a workaround because the backend API doesn't support server-side filtering by course.
 */
export const getQuizzesForCourse = async (courseId) => {
    try {
        // Fetch both all quizzes and all courses concurrently
        const [quizzesRes, coursesRes] = await Promise.all([
            getQuizzes(), // This function already returns quizzes in the correct frontend format
            getCourses()
        ]);

        const allQuizzes = quizzesRes.data;
        const allCourses = coursesRes.data;

        // Find the title of the selected course
        const selectedCourse = allCourses.find(c => c._id === courseId);
        if (!selectedCourse) {
            // If course isn't found, return an empty array
            return { ...quizzesRes, data: [] };
        }

        // Filter quizzes where the subject matches the course title
        const filteredQuizzes = allQuizzes.filter(q => q.subject === selectedCourse.title);

        return { ...quizzesRes, data: filteredQuizzes };
    } catch (error) {
        console.error("Failed to get quizzes for course", error);
        throw error; // Re-throw to be handled by the component
    }
};

/**
 * Creates a new quiz.
 * Maps the frontend form data to the backend Quiz schema.
 */
const token = localStorage.getItem('token');
export const createQuiz = (quizData) => {
    const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
    const payload = {
        title: quizData.title,
        description: quizData.description,
        subject: 'General', // Backend requires a 'subject', provide a default
    };
    // The backend gets the teacher ID from the auth token, so 'author' is not sent.
    return apit.post('/api/quizzes', payload,config);
};

/**
 * Creates a quiz associated with a specific course.
 * It fetches course data to determine the 'subject' for the new quiz.
 */
export const createQuizForCourse = async (courseId, quizData) => {
    try {
        const coursesRes = await getCourses();
        const selectedCourse = coursesRes.data.find(c => c._id === courseId);

        if (!selectedCourse) {
            throw new Error('Selected course not found');
        }

        const payload = {
            title: quizData.title,
            description: quizData.description,
            subject: selectedCourse.title, // Use the course title as the subject
        };

    return apit.post('/api/quizzes', payload);
    } catch (error) {
        console.error("Failed to create quiz for course", error);
        throw error;
    }
};


/**
 * Deletes a quiz by its ID.
 */
export const deleteQuiz = (quizId) => {
    // The component passes quiz._id, which we mapped from the backend's 'id'.
    return apit.delete(`/api/quizzes/${quizId}`);
};