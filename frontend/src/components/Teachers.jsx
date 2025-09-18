// src/components/Teachers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { getFeaturedTeachers } from '../api/teachers';
import { toast } from 'react-toastify';
import TextTruncate from './common/TextTruncate';
    
const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchFeaturedTeachers = async () => {
            try {
                setLoading(true);
                const response = await getFeaturedTeachers();
                if (response.success) {
                    setTeachers(response.data);
                } else {
                    toast.error('Failed to load featured teachers');
                }
            } catch (error) {
                console.error('Error fetching featured teachers:', error);
                toast.error('Failed to load featured teachers');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedTeachers();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Loading expert teachers...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        <span>Featured Teachers</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4 px-2">
                        Learn from Tech Teachers
                    </h2>
                    <div className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
                        <TextTruncate 
                            text="Our handpicked instructors are industry leaders with years of experience. They've helped thousands of students achieve their career goals."
                            maxLength={120}
                            className="text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Adaptive Featured Teachers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                    {teachers.map((teacher) => (
                        <div key={teacher._id} className="group bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4">
                                <img 
                                    src={teacher.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
                                    alt={teacher.name} 
                                    className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-primary/20 group-hover:border-primary/40 transition-colors shadow-lg"
                                />
                                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-0.5 sm:gap-1 shadow">
                                    <FaStar size={10} className="sm:w-3 sm:h-3" />
                                    <span className="text-xs sm:text-xs">{teacher.averageRating || 0}</span>
                                </div>
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors mb-1 w-full px-2" title={teacher.name}>
                                <TextTruncate 
                                    text={teacher.name}
                                    maxLength={20}
                                    className="block"
                                />
                            </h3>
                            <p className="text-primary font-semibold text-xs sm:text-sm mb-2 w-full px-2">
                                Expert Teacher
                            </p>
                            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 px-2">
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
                                onClick={scrollToTop}
                                className="mt-auto bg-primary hover:bg-primary-focus text-white text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors shadow-lg w-full sm:w-auto"
                            >
                                View Courses
                            </Link>
                        </div>
                    ))}
                </div>

                {/* View All Teachers Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4 px-2">
                            Meet Our Complete Faculty
                        </h3>
                        <div className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                            <TextTruncate 
                                text="We have 100+ expert instructors across various domains. Each teacher brings unique expertise and real-world experience to help you succeed in your learning journey."
                                maxLength={150}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <Link 
                                to="/teachers" 
                                onClick={scrollToTop} 
                                className="bg-primary hover:bg-primary-focus text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                View All Teachers
                            </Link>
                            <Link 
                                to="/signup?role=teacher" 
                                onClick={scrollToTop} 
                                className="border border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                            >
                                Become an Instructor
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Teachers;