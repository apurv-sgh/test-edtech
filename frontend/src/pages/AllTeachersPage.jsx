import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaGraduationCap, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { getAllTeachers } from '../api/teachers';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import TextTruncate from '../components/common/TextTruncate';

const AllTeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchTeachers = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await getAllTeachers({ page, limit: 12, search });
            if (response.success) {
                setTeachers(response.data);
                setPagination(response.pagination);
            } else {
                toast.error('Failed to load teachers');
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            toast.error('Failed to load teachers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers(currentPage, searchTerm);
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTeachers(1, searchTerm);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && teachers.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
                    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading teachers...</p>
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
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
                        >
                            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            Back to Home
                        </Link>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                            All Teachers
                        </h1>
                        <div className="text-gray-600 dark:text-gray-400 max-w-2xl px-2">
                            <TextTruncate 
                                text="Discover our complete faculty of expert instructors. Each teacher brings unique expertise and real-world experience to help you succeed in your learning journey."
                                maxLength={120}
                                className="text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 sm:mb-8">
                        <form onSubmit={handleSearch} className="max-w-md mx-auto sm:mx-0">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="text"
                                    placeholder="Search teachers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Teachers Grid */}
                    {teachers.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                {teachers.map((teacher) => (
                                    <div key={teacher._id} className="group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4">
                                            <img 
                                                src={teacher.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
                                                alt={teacher.name} 
                                                className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-primary/20 group-hover:border-primary/40 transition-colors shadow-lg"
                                            />
                                            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-0.5 sm:gap-1 shadow">
                                                <FaStar size={8} className="sm:w-3 sm:h-3" />
                                                <span className="text-xs">{teacher.averageRating || 0}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1 w-full px-2" title={teacher.name}>
                                            <TextTruncate 
                                                text={teacher.name}
                                                maxLength={18}
                                                className="block"
                                            />
                                        </h3>
                                        <p className="text-primary font-semibold text-xs sm:text-sm mb-2 w-full px-2">
                                            Expert Teacher
                                        </p>
                                        <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 px-2">
                                            <span className="flex items-center gap-1">
                                                <FaGraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="hidden sm:inline">{teacher.totalCourses || 0} Courses</span>
                                                <span className="sm:hidden">{teacher.totalCourses || 0}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="hidden sm:inline">{teacher.totalStudents || 0} Students</span>
                                                <span className="sm:hidden">{teacher.totalStudents || 0}</span>
                                            </span>
                                        </div>
                                        <Link 
                                            to={`/teacher/${teacher._id}`}
                                            className="mt-auto bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors shadow-lg w-full sm:w-auto"
                                        >
                                            View Courses
                                        </Link>
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
                                        const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                                        
                                        if (!isNearCurrentPage && page !== 1 && page !== pagination.totalPages) {
                                            return null;
                                        }
                                        
                                        if (!isNearCurrentPage && page === pagination.totalPages && currentPage < pagination.totalPages - 2) {
                                            return (
                                                <React.Fragment key={page}>
                                                    <span className="px-2 text-gray-500">...</span>
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        }
                                        
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
                            <FaUsers className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No teachers found</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchTerm ? 'Try adjusting your search terms.' : 'No teachers are available at the moment.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllTeachersPage;
