import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookReader, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-bg text-slate-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <FaBookReader className="text-primary" />
              EdTech
            </Link>
            <p className="text-slate-400">Unlock your potential with our expert-led courses.</p>
             <div className="flex space-x-4 mt-4">
              <a href="#" className="text-slate-400 hover:text-white"><FaTwitter /></a>
              <a href="#" className="text-slate-400 hover:text-white"><FaLinkedin /></a>
              <a href="#" className="text-slate-400 hover:text-white"><FaGithub /></a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Courses</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Web Development</a></li>
              <li><a href="#" className="hover:text-white">Data Science</a></li>
              <li><a href="#" className="hover:text-white">Business Analytics</a></li>
              <li><a href="#" className="hover:text-white">Cognitive Science</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="#" className="hover:text-white">Pricing</Link></li>
              <li><Link to="#" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} EdTech Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;