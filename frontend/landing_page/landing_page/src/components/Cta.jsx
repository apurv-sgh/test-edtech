import React from 'react';
import Button from './Button';

const Cta = () => {
    return (
        <section className="bg-primary-dark">
            <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-center text-white">
                <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
                    <h2 className="text-3xl font-bold mb-3">Ready to start learning?</h2>
                    <p className="text-primary-light mb-6">
                        Sign up now and unlock your potential with Edutech's expert teachers and rich video content.
                    </p>
                    <Button variant="light">Get Started Free</Button>
                </div>
                <div className="md:w-1/3 flex justify-center">
                    <img src="https://placehold.co/200x200/FFFFFF/4A3E9F?text=Avatar" alt="Student learning" className="rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default Cta;