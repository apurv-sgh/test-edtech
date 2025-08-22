import React from 'react';
import { Link } from 'react-router-dom';

const HeroCtaSection = ({
  headline,
  description,
  primaryBtn,
  secondaryBtn,
  image,
  imagePosition = 'right',
  bgClass = ''
}) => {
  return (
    <section className={`relative py-16 md:py-24 ${bgClass}`}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Text Column */}
        {imagePosition === 'left' && (
          <div className="md:w-1/2 w-full flex justify-center mb-8 md:mb-0">
            <img src={image} alt="Illustration" className="max-w-xs md:max-w-md w-full h-auto" />
          </div>
        )}
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
            {headline}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto md:mx-0">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to={primaryBtn.to} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              {primaryBtn.label}
            </Link>
            {secondaryBtn.onClick ? (
              <button
                type="button"
                onClick={secondaryBtn.onClick}
                className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {secondaryBtn.label}
              </button>
            ) : (
              <Link to={secondaryBtn.to} className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                {secondaryBtn.label}
              </Link>
            )}
          </div>
        </div>
        {/* Image Column */}
        {imagePosition === 'right' && (
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <img src={image} alt="Illustration" className="max-w-xs md:max-w-md w-full h-auto" />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroCtaSection; 