import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaCheckCircle, FaStar, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Cta = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            name: "User1",
            role: "Web Development Student",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            quote: "EdTech transformed my career! The courses are well-structured, and the instructors are amazing. I landed my dream job within 6 months!",
            rating: 5
        },
        {
            name: "User2",
            role: "Data Science Graduate",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            quote: "The personalized study plans and live sessions made learning so much easier. I went from zero coding knowledge to building ML models!",
            rating: 5
        },
        {
            name: "User3",
            role: "UX/UI Design Student",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            quote: "The community aspect is incredible! I've made friends with fellow designers and we collaborate on projects together. Highly recommended!",
            rating: 5
        },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToTestimonial = (index) => {
        setCurrentTestimonial(index);
    };

    // Auto-rotate testimonials every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextTestimonial, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentTestimonialData = testimonials[currentTestimonial];

    return (
        <section className="relative bg-purple-600 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <FaRocket className="text-yellow-300" />
                            <span>Join 100k+ Students Already Learning</span>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Ready to Transform Your Future?
                        </h2>
                        
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Start your learning journey today with expert-led courses, 
                            personalized study plans, and a supportive community of learners.
                        </p>
                        
                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-300 text-xl flex-shrink-0" />
                                <span className="text-white/90">Free access to 100+ courses</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-300 text-xl flex-shrink-0" />
                                <span className="text-white/90">Expert instructors</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-300 text-xl flex-shrink-0" />
                                <span className="text-white/90">Certificate upon completion</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-300 text-xl flex-shrink-0" />
                                <span className="text-white/90">24/7 learning support</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/signup"
                                onClick={scrollToTop}
                                className="relative bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl border-2 border-primary/40 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-dark flex items-center justify-center gap-2"
                            >
                                <FaRocket className="text-white" />
                                <span className="relative z-10">Get Started Free</span>
                            </Link>
                            <Link to="/courses" onClick={scrollToTop} className="border-2 border-white/50 text-white hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg backdrop-blur-sm hover:shadow-xl hover:scale-105">
                                View All Courses
                            </Link>
                        </div>
                    </div>
                    
                    {/* Right Content - Testimonials Slideshow */}
                    <div className="relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            {/* Testimonial card */}
                            <div className="bg-white rounded-xl p-6 shadow-xl relative">
                                {/* Navigation arrows */}
                                <button
                                    onClick={prevTestimonial}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/90 hover:bg-white text-purple-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                                >
                                    <FaChevronLeft className="text-sm" />
                                </button>
                                <button
                                    onClick={nextTestimonial}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 translate-x-12 bg-white/90 hover:bg-white text-purple-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                                >
                                    <FaChevronRight className="text-sm" />
                                </button>

                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={currentTestimonialData.image}
                                        alt={`${currentTestimonialData.name} testimonial`}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-purple-200"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-800">{currentTestimonialData.name}</h4>
                                        <p className="text-sm text-gray-600">{currentTestimonialData.role}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(currentTestimonialData.rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400 text-sm" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "{currentTestimonialData.quote}"
                                </p>

                                {/* Testimonial indicators */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToTestimonial(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentTestimonial 
                                                    ? 'bg-purple-600 w-6' 
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Stats floating card */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <FaUsers className="text-purple-600" />
                                        <p className="text-2xl font-bold text-gray-800">100k+</p>
                                    </div>
                                    <p className="text-xs text-gray-600">Active Learners</p>
                                </div>
                            </div>
                            
                            {/* Success rate card */}
                            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">95%</p>
                                    <p className="text-xs opacity-90">Success Rate</p>
                                </div>
                            </div>
                        </div>
                </div>
                </div>
            </div>
        </section>
    );
};

export default Cta;