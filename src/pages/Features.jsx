import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPlayCircle, FaUserCheck, FaChartLine, FaComments, FaCertificate, FaMobileAlt } from 'react-icons/fa';

const features = [
    {
        icon: <FaPlayCircle size={32} className="text-primary" />,
        title: "On-Demand Video Lectures",
        description: "Learn at your own pace with access to a vast library of high-quality video content from expert instructors."
    },
    {
        icon: <FaUserCheck size={32} className="text-secondary-green" />,
        title: "Expert Tutors",
        description: "Get guidance and support from industry professionals and seasoned educators who are passionate about teaching."
    },
    {
        icon: <FaChartLine size={32} className="text-secondary-orange" />,
        title: "Progress Tracking",
        description: "Monitor your learning journey with intuitive dashboards, track course completion, and review quiz scores."
    },
    {
        icon: <FaComments size={32} className="text-blue-500" />,
        title: "Interactive Community",
        description: "Engage with fellow learners and instructors in discussion forums, Q&A sessions, and collaborative projects."
    },
    {
        icon: <FaCertificate size={32} className="text-yellow-500" />,
        title: "Course Certifications",
        description: "Earn valuable certificates upon course completion to showcase your new skills on your resume and social profiles."
    },
    {
        icon: <FaMobileAlt size={32} className="text-purple-500" />,
        title: "Learn Anywhere",
        description: "Access your courses on any device, anytime. Our platform is fully responsive for learning on the go."
    },
];

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-neutral-dark mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const FeaturesPage = () => {
    return (
        <>
        <div className="bg-white dark:bg-dark-bg min-h-[calc(100vh-150px)]">
            <main>
                {/* Hero Section */}
                <section className="bg-white py-20 dark:bg-dark-bg">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white">
                            Powerful Features for <span className="text-primary">Modern Learning</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto dark:text-slate-400">
                            Our platform is packed with tools and resources designed to provide an engaging, effective, and flexible learning experience.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 dark:bg-dark-bg">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => <FeatureCard key={index} {...feature} />)}
                        </div>
                    </div>
                </section>

                {/* Detailed Feature Showcase */}
                <section className="py-20 bg-white dark:bg-dark-bg">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center text-slate-400">
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-dark mb-4 text-slate-600 dark:text-slate-400">Track Your Journey to Success</h2>
                            <p className="text-gray-600 mb-6">Our analytics dashboard gives you a clear view of your progress. See which topics you've mastered and where you need to focus, keeping you motivated and on track to achieve your goals.</p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-3"><FaUserCheck className="text-primary" /> Personalized Learning Paths</li>
                                <li className="flex items-center gap-3"><FaChartLine className="text-primary" /> Detailed Performance Reports</li>
                                <li className="flex items-center gap-3"><FaCertificate className="text-primary" /> Goal Setting & Reminders</li>
                            </ul>
                        </div>
                        <img
                            src="https://placehold.co/600x400/E9E6FF/4A3E9F?text=Analytics+Dashboard"
                            alt="Analytics Dashboard"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </section>
            </main>
        </div>
        </>
    );
};

export default FeaturesPage;