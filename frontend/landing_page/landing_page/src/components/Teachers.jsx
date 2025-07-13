// src/components/Teachers.jsx
import React from 'react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

const teachers = [
    { name: "Mr. Alen Smith", specialty: "Front-End Expert", avatar: "https://placehold.co/100x100/FFC0CB/000000?text=AS" },
    { name: "Ms. Linda Lee", specialty: "Cognitive Specialist", avatar: "https://placehold.co/100x100/ADD8E6/000000?text=LL" },
    { name: "Mr. John Roy", specialty: "Business Analyst", avatar: "https://placehold.co/100x100/90EE90/000000?text=JR" },
    { name: "Mrs. Emma Jones", specialty: "Data Scientist", avatar: "https://placehold.co/100x100/FFD700/000000?text=EJ" },
];

const TeacherCard = ({ name, specialty, avatar }) => (
    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
        <img src={avatar} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-light" />
        <h3 className="text-lg font-bold text-neutral-dark">{name}</h3>
        <p className="text-gray-500 text-sm mb-4">{specialty}</p>
        <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary"><FaLinkedin size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-primary"><FaTwitter size={20} /></a>
        </div>
    </div>
);

const Teachers = () => {
    return (
        <section className="py-20 bg-primary-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Highly Recommended Teachers</h2>
                    <a href="#" className="text-primary font-semibold hover:underline">All Teachers +</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teachers.map((teacher, index) => <TeacherCard key={index} {...teacher} />)}
                </div>
            </div>
        </section>
    );
};

export default Teachers;