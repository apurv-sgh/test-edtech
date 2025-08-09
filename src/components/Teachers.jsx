import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaGraduationCap, FaSearch } from 'react-icons/fa';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [specialty, setSpecialty] = useState('');
    const [sortBy, setSortBy] = useState('rating');

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
            },
            {
                _id: '5',
                name: "Dr. Lisa Wang",
                specialty: "Machine Learning",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
                rating: 4.9,
                students: 1100,
                courses: 7,
            },
            {
                _id: '6',
                name: "Mr. James Wilson",
                specialty: "Digital Marketing",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.5,
                students: 350,
                courses: 3,
            }
        ];
        setTeachers(mockTeachers);
        setLoading(false);
    }, []);
    // Filtering and sorting logic
    const filteredAndSortedTeachers = teachers
        .filter(teacher => {
            const matchesSearch = teacher.name.toLowerCase().includes(search.toLowerCase());
            const matchesSpecialty = teacher.specialty.toLowerCase().includes(search.toLowerCase()) ||
                teacher.specialty.toLowerCase().includes(search.toLowerCase());
            return matchesSearch && matchesSpecialty;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'students':
                    return b.students - a.students;
                case 'courses':
                    return b.courses - a.courses;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    if (loading) return (
        <div className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading teachers...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span>Expert Instructors</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
                        Meet Our Teachers
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Learn from industry experts who have helped thousands of students achieve their career goals.
                        Each instructor brings unique expertise and real-world experience to our platform.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search teachers..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full border border-slate-300 dark:border-slate-600 p-3 pl-10 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>

                        <select
                            value={specialty}
                            onChange={e => setSpecialty(e.target.value)}
                            className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
                        >
                            <option value="">All Specialties</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Business Analytics">Business Analytics</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
                        >
                            <option value="rating">Sort by Rating</option>
                            <option value="students">Sort by Students</option>
                            <option value="courses">Sort by Courses</option>
                            <option value="name">Sort by Name</option>
                        </select>

                        <button
                            onClick={() => { setSearch(''); setSpecialty(''); setSortBy('rating'); }}
                            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        Showing {filteredAndSortedTeachers.length} of {teachers.length} teachers
                    </p>
                </div>

                {/* Compact Teachers Grid */}
                {filteredAndSortedTeachers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredAndSortedTeachers.map((teacher) => (
                            <div key={teacher._id} className="group bg-white dark:bg-slate-800 p-3 rounded-xl shadow hover:shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                                <img
                                    src={teacher.avatar}
                                    alt={teacher.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 mb-2"
                                />
                                <h3 className="text-base font-semibold text-slate-800 dark:text-white truncate w-full" title={teacher.name}>
                                    {teacher.name}
                                </h3>
                                <p className="text-xs text-primary font-medium mb-1 truncate w-full" title={teacher.specialty}>
                                    {teacher.specialty}
                                </p>
                                <div className="flex items-center justify-center gap-1 text-xs text-yellow-500 mb-1">
                                    <FaStar className="text-xs" />
                                    {teacher.rating}
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    <span className="flex items-center gap-1"><FaGraduationCap />{teacher.courses}</span>
                                    <span className="flex items-center gap-1"><FaUsers />{teacher.students}</span>
                                </div>
                                <Link
                                    to={`/courses?teacher=${encodeURIComponent(teacher.name)}`}
                                    className="mt-auto bg-primary hover:bg-primary-focus text-white text-xs px-3 py-1 rounded-full font-semibold transition-colors"
                                >
                                    View Courses
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👨‍🏫</div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No teachers found</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your search criteria</p>
                        <button
                            onClick={() => { setSearch(''); setSpecialty(''); setSortBy('rating'); }}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-focus transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Become an Instructor CTA */}
                <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 mt-12 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Want to Join Our Team?</h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                        Share your expertise and help students around the world. Join our community of expert instructors
                        and start creating impactful courses today.
                    </p>
                    <Link
                        to="/signup?role=teacher"
                        className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors inline-block"
                    >
                        Become an Instructor
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Teachers;

