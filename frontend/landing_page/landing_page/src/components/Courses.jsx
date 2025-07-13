// src/components/Courses.jsx
import React from 'react';
import { FaCode, FaBrain, FaChartBar } from 'react-icons/fa';

const courses = [
    {
        icon: <FaCode className="text-primary" size={32} />,
        title: "Web Development",
        description: "Master HTML, CSS, JavaScript and modern frameworks with video lessons by top educators.",
        instructor: "Mr. Alen Smith",
        progress: 89,
        avatar: "https://placehold.co/40x40/FFC0CB/000000?text=A"
    },
    {
        icon: <FaBrain className="text-secondary-orange" size={32} />,
        title: "Cognitive Science",
        description: "Explore the science behind thinking & learning with engaging video lectures.",
        instructor: "Ms. Linda Lee",
        progress: 68,
        avatar: "https://placehold.co/40x40/ADD8E6/000000?text=L"
    },
    {
        icon: <FaChartBar className="text-secondary-green" size={32} />,
        title: "Business Analytics",
        description: "Learn data-driven decision making with hands-on business analytics lessons.",
        instructor: "Mr. John Roy",
        progress: 78,
        avatar: "https://placehold.co/40x40/90EE90/000000?text=J"
    },
];

const CourseCard = ({ icon, title, description, instructor, progress, avatar }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center space-x-4 mb-4">
            {icon}
            <h3 className="text-xl font-bold text-neutral-dark">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <img src={avatar} alt={instructor} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{instructor}</span>
            </div>
            <span className="text-lg font-bold text-primary">{progress}%</span>
        </div>
    </div>
);

const Courses = () => {
    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Featured Courses</h2>
                    <a href="#" className="text-primary font-semibold hover:underline">View All +</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => <CourseCard key={index} {...course} />)}
                </div>
            </div>
        </section>
    );
};

export default Courses;