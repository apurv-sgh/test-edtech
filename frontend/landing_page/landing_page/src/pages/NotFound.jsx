import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="text-4xl font-bold text-slate-800 dark:text-white mt-4">Page Not Found</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-all">
        Go Back Home
      </Link>
    </div>
  );
};
export default NotFound;