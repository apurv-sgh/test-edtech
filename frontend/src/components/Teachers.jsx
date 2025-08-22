// src/components/Teachers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaGraduationCap } from 'react-icons/fa';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // For now, using mock data. In real app, fetch from API
        const mockTeachers = [
            {
                _id: '1',
                name: "Dr. Sarah Johnson",
                specialty: "Web Development",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.9,
                students: 1247,
                courses: 8,
            },
            {
                _id: '2',
                name: "Prof. Michael Chen",
                specialty: "Data Science",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.8,
                students: 892,
                courses: 6,
            },
            {
                _id: '3',
                name: "Dr. Emily Rodriguez",
                specialty: "Business Analytics",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.7,
                students: 567,
                courses: 5,
            },
            {
                _id: '4',
                name: "Mr. David Kim",
                specialty: "UI/UX Design",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.6,
                students: 423,
                courses: 4,
            }
        ];
        setTeachers(mockTeachers);
        setLoading(false);
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
        <section className="py-20 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span>Featured Teachers</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                        Learn from Tech Teachers
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Our handpicked instructors are industry leaders with years of experience. 
                        They've helped thousands of students achieve their career goals.
                    </p>
                </div>

                {/* Adaptive Featured Teachers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                    {teachers.map((teacher) => (
                        <div key={teacher._id} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 mb-4">
                                <img 
                                    src={teacher.avatar} 
                                    alt={teacher.name} 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors shadow-lg"
                                />
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
                                    <FaStar size={12} />
                                    {teacher.rating}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors mb-1 truncate w-full" title={teacher.name}>
                                {teacher.name}
                            </h3>
                            <p className="text-primary font-semibold text-sm mb-2 truncate w-full" title={teacher.specialty}>
                                {teacher.specialty}
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                <span className="flex items-center gap-1"><FaGraduationCap />{teacher.courses} Courses</span>
                                <span className="flex items-center gap-1"><FaUsers />{teacher.students} Students</span>
                            </div>
                            <Link 
                                to={`/courses?teacher=${encodeURIComponent(teacher.name)}`}
                                onClick={scrollToTop}
                                className="mt-auto bg-primary hover:bg-primary-focus text-white text-sm px-6 py-2 rounded-full font-semibold transition-colors shadow-lg"
                            >
                                View Courses
                            </Link>
                        </div>
                    ))}
                </div>

                {/* View All Teachers Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            Meet Our Complete Faculty
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                            We have 100+ expert instructors across various domains. Each teacher brings unique expertise 
                            and real-world experience to help you succeed in your learning journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/teachers" onClick={scrollToTop} className="bg-primary hover:bg-primary-focus text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                                View All Teachers
                            </Link>
                            <Link to="/signup?role=teacher" onClick={scrollToTop} className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors">
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