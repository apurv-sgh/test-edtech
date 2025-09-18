import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaUsers, FaGraduationCap, FaArrowLeft, FaCalendar, FaClock, FaPlay } from 'react-icons/fa';
import { getTeacherById, getTeacherCourses } from '../api/teachers';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import TextTruncate from '../components/common/TextTruncate';

const TeacherProfilePage = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchTeacher = async () => {
        try {
            setLoading(true);
            const response = await getTeacherById(id);
            if (response.success) {
                setTeacher(response.data);
            } else {
                toast.error('Failed to load teacher profile');
            }
        } catch (error) {
            console.error('Error fetching teacher:', error);
            toast.error('Failed to load teacher profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async (page = 1) => {
        try {
            setCoursesLoading(true);
            const response = await getTeacherCourses(id, { page, limit: 12 });
            if (response.success) {
                setCourses(response.data);
                setPagination(response.pagination);
            } else {
                toast.error('Failed to load teacher courses');
            }
        } catch (error) {
            console.error('Error fetching teacher courses:', error);
            toast.error('Failed to load teacher courses');
        } finally {
            setCoursesLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTeacher();
            fetchCourses(currentPage);
        }
    }, [id, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
                    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading teacher profile...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!teacher) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
                    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Teacher not found</h1>
                            <Link to="/teachers" className="text-primary hover:text-primary-dark text-sm sm:text-base">
                                Back to All Teachers
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
                <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {/* Back Button */}
                    <Link 
                        to="/teachers" 
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
                    >
                        <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        Back to All Teachers
                    </Link>

                    {/* Teacher Profile Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                            <div className="relative">
                                <img 
                                    src={teacher.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
                                    alt={teacher.name} 
                                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-2 sm:border-4 border-primary/20 shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-yellow-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-0.5 sm:gap-1 shadow">
                                    <FaStar size={10} className="sm:w-3 sm:h-3" />
                                    <span className="text-xs sm:text-sm">{teacher.stats?.averageRating || 0}</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
                                    <TextTruncate 
                                        text={teacher.name}
                                        maxLength={25}
                                        className="block"
                                    />
                                </h1>
                                <p className="text-primary font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                                    Expert Teacher
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center">
                                        <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                                            {teacher.stats?.totalCourses || 0}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Courses</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center">
                                        <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                                            {teacher.stats?.totalStudents || 0}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Students</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center">
                                        <FaStar className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                                            {teacher.stats?.totalRating || 0}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                                    </div>
                                </div>

                                {teacher.education && teacher.education.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Education</h3>
                                        {teacher.education.map((edu, index) => (
                                            <div key={index} className="text-gray-600 dark:text-gray-400">
                                                {edu.degree} in {edu.field} from {edu.institution}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {teacher.interests && teacher.interests.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Specializations</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {teacher.interests.map((interest, index) => (
                                                <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Courses Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Courses by {teacher.name}
                        </h2>

                        {coursesLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading courses...</p>
                            </div>
                        ) : courses.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {courses.map((course) => (
                                        <div key={course._id} className="group bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600">
                                            <div className="relative mb-4">
                                                <img 
                                                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
                                                    alt={course.title} 
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                                                    <FaPlay className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                {course.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="w-4 h-4" />
                                                    {course.duration}h
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaUsers className="w-4 h-4" />
                                                    {course.studentsEnrolled?.length || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="w-4 h-4" />
                                                    {course.rating?.average || 0}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-primary">
                                                    ₹{course.price}
                                                </span>
                                                <Link 
                                                    to={`/course/${course._id}`}
                                                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    View Course
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!pagination.hasPrev}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        
                                        {[...Array(pagination.totalPages)].map((_, index) => {
                                            const page = index + 1;
                                            const isCurrentPage = page === currentPage;
                                            
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                                        isCurrentPage
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!pagination.hasNext}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <FaGraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses available</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    This teacher hasn't published any courses yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherProfilePage;
