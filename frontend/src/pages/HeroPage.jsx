import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// import Button from './Button';
import { FaPlayCircle, FaGraduationCap, FaUsers, FaVideo } from 'react-icons/fa';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounter = () => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = end;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  return (
    <span ref={counterRef} className="inline-block">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const HeroPage = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="relative bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-dark-bg dark:via-slate-900 dark:to-slate-800 py-20 overflow-hidden">
            {/* Background image and overlay */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    alt="Students collaborating on online learning"
                    className="w-full h-full object-cover object-center opacity-70"
                />
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/60 dark:bg-slate-900/60 mix-blend-multiply"></div>
                </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content (now centered) */}
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
                            <FaGraduationCap className="text-primary" />
                            <span>Trusted by 100k+ Students Worldwide</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Knowledge</span> with Expert Teachers
                        </h1>
                        <p className="text-lg text-gray-100 dark:text-gray-300 mb-8 leading-relaxed">
                            Discover thousands of high-quality video lectures from industry experts. 
                            Learn at your own pace with personalized learning paths and real-time progress tracking.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
                            <Link
                                to="/signup"
                                onClick={scrollToTop}
                                className="relative bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl border-2 border-primary/40 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-dark"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Get Started Free
                                </span>
                            </Link>
                            <Link 
                                to="/courses" 
                                onClick={scrollToTop}
                                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group flex items-center justify-center gap-2"
                            >
                                <FaPlayCircle className="group-hover:scale-110 transition-transform" />
                                <span>Explore Courses</span>
                            </Link>
                        </div>
                        {/* Animated Stats */}
                        <div className="grid grid-cols-3 gap-6 text-center md:text-left">
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl group hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <FaVideo className="text-primary text-xl group-hover:scale-110 transition-transform" />
                                    <p className="text-2xl font-bold text-neutral-dark dark:text-white">
                                        <AnimatedCounter end={30} suffix="k+" />
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Video Lectures</p>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl group hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <FaGraduationCap className="text-primary text-xl group-hover:scale-110 transition-transform" />
                                    <p className="text-2xl font-bold text-neutral-dark dark:text-white">
                                        <AnimatedCounter end={2} suffix="k+" />
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Expert Teachers</p>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl group hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <FaUsers className="text-primary text-xl group-hover:scale-110 transition-transform" />
                                    <p className="text-2xl font-bold text-neutral-dark dark:text-white">
                                        <AnimatedCounter end={100} suffix="k+" />
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
                            </div>
                        </div>
                    </div>
                    {/* Remove right illustration and live session card */}
                </div>
            </div>
        </section>
    );
};

export default HeroPage;