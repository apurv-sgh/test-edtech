import React from 'react';
import Button from './Button';
import { FaPlayCircle } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="bg-primary-light py-20">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-dark leading-tight">
                        Unlock <span className="text-primary">Knowledge</span> with Top Teachers & Video Lectures
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        Browse thousands of video lectures from expert teachers. Track your learning, rewatch, and keep improving at your own pace.
                    </p>
                    <div className="mt-8 flex justify-center md:justify-start space-x-4">
                        <Button variant="solid">Get Started Free</Button>
                        <Button variant="outline">Explore Courses</Button>
                    </div>
                    <div className="mt-12 flex justify-center md:justify-start space-x-8 text-neutral-dark">
                        <div>
                            <p className="text-3xl font-bold">30k+</p>
                            <p className="text-gray-500">Video lectures</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">2k+</p>
                            <p className="text-gray-500">Expert Tutors</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">100k+</p>
                            <p className="text-gray-500">Active Students</p>
                        </div>
                    </div>
                </div>

                {/* Right Illustration */}
                <div className="relative">
                    <img
                        src="https://placehold.co/600x400/E9E6FF/4A3E9F?text=Illustration"
                        alt="Students watching an online lecture"
                        className="rounded-lg shadow-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm text-primary font-bold py-3 px-6 rounded-full shadow-lg hover:bg-white transition">
                            <FaPlayCircle size={24} />
                            <span>Watch & Learn</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;