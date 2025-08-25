import api from './apit';
import { getCourses } from './courses';

/** 
 * Fetches all test from the backend and transforms them into the shape
 * the frontend components expects.
*/
export const getTests = () => {
    return api.get('/api/tests').then(res => {
        console.log('Full API response:', res.data.testSeries); 
        // Backend returns { success: true, tests: [...] }
        // The frontend expects the data property to be the array itself.
        const rawTests = Array.isArray(res.data.testSeries) ? res.data.testSeries : [];
        const tests = rawTests.map(t => ({
            ...t,
            _id: t._id || t.id, // Use MongoDB _id, fallback to id if present
            author: t.teacher?.name || 'Unknown Author',
            title: t.title || '',
            subject: t.subject || '',
            date: t.date || '',
        }));
        // Return a response object that mimics a direct axios response
        return { ...res, data: tests };
    });
};

/**
 * Create a new test.
 * Maps the frontend form data to the backend Test schema.
 */
export const createTest = (testData) => {
    const payload = {
        title: testData.title ?? '',
        subject: testData.subject ?? '',
        date: testData.date ?? '',
        description: testData.description ?? '',
        courseId: testData.courseId ?? '',
        category: testData.category ?? '',
        questions: testData.questions ?? '',
        duration: testData.duration ?? '',
    };
    return api.post('/api/tests', payload);
};

/**
 * Deletes a test by ID.
 */
export const deleteTest = (id) => {
    return api.delete(`/api/tests/${id}`);
};

/**
 * Updates a test by ID.
 * @param {string} testId - The ID of the test to update.
 * @param {object} testData - The updated test data.
 * @returns {Promise} - A promise that resolves to the updated test data.
 */
export const updateTest = (testId, testData) => {
    const payload = {
        title: testData.title,
        description: testData.description,
        courseId: testData.courseId,
        author: testData.author
    };
    // The backend gets the teacher ID from the auth token, so 'author' is not sent.
    return api.put(`/api/tests/${testId}`, payload);
};

/**
 * Fetches all tests and filters them by course on the client-side.
 * This is workaround because the backend API doesn't support server-side filtering by course.
 */
export const getTestsForCourse = async (courseId) => {
    try {
        // Fetch both all tests and all courses concurrently
        const [testsRes, coursesRes] = await Promise.all([
            getTests(), // This function already returns tests in the correct frontend format
            getCourses()
        ]);

        const allTests = testsRes.data;
        const allCourses = coursesRes.data;

        // Find the title of the selected course
        const selectedCourse = allCourses.find(c => c._id === courseId);
        if (!selectedCourse) {
            // If course isn't found, return an empty array.
            return { ...testsRes, data: [] };
        }

        // Filter tests where the subject matches the course title
        const filterTests = allTests.filter(t => t.subject === selectedCourse.title);
        return { ...testsRes, data: filterTests };
    } catch (error) {
        console.error('Error fetching tests for course:', error);
        throw error; // Re-throw to be handled by the component
    }
};

/**
 * Creates a test associated with a specific course.
 * It fetches course data to determine the 'subject' for the new test.
 */
export const createTestForCourse = async (courseId, testData) => {
    try {
        const courseRes = await getCourses();
        const selectedCourse = courseRes.data.find(c => c._id === courseId);

        if (!selectedCourse) {
            throw new Error('Selected course not found');
        }

        const payload = {
            title: testData.title,
            description: testData.description,
            courseId: selectedCourse._id,
            subject: selectedCourse.title
        };

        return api.post('/api/tests', payload);
    } catch (error) {
        console.error('Error creating test for course:', error);
        throw error; // Re-throw to be handled by the component
    }
};