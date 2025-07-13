// src/components/History.jsx
import React from 'react';
import { FaRegFileCode, FaLightbulb, FaChartLine } from 'react-icons/fa';

const historyItems = [
    { icon: <FaRegFileCode size={24} className="text-blue-500" />, title: "React Basics - Components", instructor: "Mr. Alen Smith", time: "Watched 2m ago", status: "Completed", statusColor: "green" },
    { icon: <FaLightbulb size={24} className="text-yellow-500" />, title: "Memory & Learning", instructor: "Ms. Linda Lee", time: "Watched 1h ago", status: "In Progress", statusColor: "orange" },
    { icon: <FaChartLine size={24} className="text-green-500" />, title: "Intro to Data Visualization", instructor: "Mr. John Roy", time: "Watched 1d ago", status: "Completed", statusColor: "green" },
];

const statusStyles = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
};

const History = () => {
    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Your Video Watch History</h2>
                    <a href="#" className="text-primary font-semibold hover:underline">See All +</a>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col lg:flex-row items-center gap-8">
                    {/* Left Side: History List */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        {historyItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-neutral-dark">{item.title}</h4>
                                        <p className="text-sm text-gray-500">By {item.instructor} | {item.time}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[item.statusColor]}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Right Side: Illustration */}
                    <div className="w-full lg:w-1/2">
                        <img src="https://placehold.co/500x300/E9E6FF/4A3E9F?text=Analytics+View" alt="Analytics Dashboard" className="rounded-lg w-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default History;