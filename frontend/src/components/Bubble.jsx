import React from "react";
import { Link } from "react-router-dom";

const Bubble = () => {
    return (
        <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Explore Our Top Categories</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12">Find your passion from a wide range of subjects.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {courseBubbles.map((course, index) => (
              <Link 
                to='/'
                key={course}
                className="bg-primary-light dark:bg-dark-card text-slate-700 dark:text-slate-200 rounded-full px-6 py-3 font-semibold shadow-md cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white dark:hover:bg-primary hover:shadow-lg hover:-translate-y-1 animate-float"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                {course}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
};

