import React from 'react';

const FlipCard = ({ course }) => {
  return (
    <div className="group h-80 w-full [perspective:1000px]">
      <div className="relative h-full w-full rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <img className="h-full w-full rounded-xl object-cover" src={course.image} alt={course.title} />
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-end p-6">
            <h3 className="text-white text-2xl font-bold">{course.title}</h3>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-primary-light dark:bg-dark-card p-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex min-h-full flex-col items-center justify-center text-slate-800 dark:text-slate-200">
            <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
            <p className="mb-4 text-sm">{course.description}</p>
            <button className="mt-2 rounded-md bg-primary py-2 px-6 text-white hover:bg-primary-focus transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;