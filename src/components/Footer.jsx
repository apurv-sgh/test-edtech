import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookReader, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-dark-bg/90 text-slate-200 backdrop-blur-md border-t-4 border-t-gradient-to-r from-primary via-blue-400 to-green-400">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-green-400" />
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Social */}
          <div className="md:col-span-1 flex flex-col items-start justify-between h-full">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white mb-4">
              <FaBookReader className="text-primary drop-shadow" />
              EdTech
            </Link>
            <p className="text-slate-400 mb-4">Unlock your potential with our expert-led courses and vibrant community.</p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="group bg-gradient-to-br from-primary via-blue-400 to-green-400 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><FaTwitter className="text-white group-hover:rotate-6 transition-transform" /></a>
              <a href="#" className="group bg-gradient-to-br from-primary via-blue-400 to-green-400 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><FaLinkedin className="text-white group-hover:-rotate-6 transition-transform" /></a>
              <a href="#" className="group bg-gradient-to-br from-primary via-blue-400 to-green-400 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><FaGithub className="text-white group-hover:rotate-12 transition-transform" /></a>
            </div>
          </div>
          {/* Courses */}
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide">Courses</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Science</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Business Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cognitive Science</a></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide">Stay Updated</h3>
            <p className="text-slate-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="flex items-center bg-white/10 rounded-lg overflow-hidden shadow-inner">
              <input type="email" placeholder="Your email" className="bg-transparent px-4 py-2 text-slate-200 placeholder-slate-400 focus:outline-none flex-1" />
              <button type="submit" className="bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white px-4 py-2 font-semibold hover:from-primary-focus hover:to-green-500 transition-all">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-14 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} <span className="text-primary font-bold">EdTech Inc.</span> All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;