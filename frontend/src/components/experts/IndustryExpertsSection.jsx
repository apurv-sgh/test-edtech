import React, { useEffect, useState } from 'react';
import { getIndustryExpertProfiles } from '../../api/industryExperts';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeroCtaSection from '../HeroCtaSection';
import expertIllustration from '../../assets/experts.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaBriefcase, FaUsers, FaGraduationCap } from 'react-icons/fa';
import IndustryExpertCard from './IndustryExpertCard';

const IndustryExpertsSection = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await getIndustryExpertProfiles();
        setProfiles(res.data || []);
      } catch {
        setProfiles([]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.max(1, Math.min(4, profiles.length)),
    slidesToScroll: 1,
    arrows: true,
    centerMode: false,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, centerMode: false, autoplay: true }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, centerMode: false, autoplay: true }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerMode: false, autoplay: true }
      }
    ]
  };

  // Removed static experts fallback to ensure data is always fetched dynamically

  return (
    <section className="py-0 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900">
      <HeroCtaSection
        headline="Learn from Industry Experts"
        description="Our handpicked instructors are industry leaders with years of experience. They've helped thousands of students achieve their career goals."
        primaryBtn={{ label: 'View All Experts', to: '/all-industry-experts' }}
        secondaryBtn={{ label: 'Become Industry Expert', to: '/become-industry-expert' }}
        image={expertIllustration}
        imagePosition="right"
        bgClass=""
      />
      {/* Industry Experts Carousel */}
      <div className="container mx-auto px-4 mb-12 py-8">
        {loading ? (
          <div className="text-center py-12">Loading experts...</div>
        ) : (profiles.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No experts available at the moment.</div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <Slider {...settings}>
              {profiles.slice(0, 10).map((profile, idx) => (
                <div key={profile._id} className="px-2 py-4">
                  <IndustryExpertCard expert={{
                    id: profile._id,
                    name: profile.expert?.name,
                    company: profile.company,
                    experience: profile.experience,
                    domain: profile.domain,
                    skills: profile.skills,
                    image: profile.profilePicture,
                    rating: profile.rating,
                    courses: profile.courses,
                    students: profile.students,
                  }} />
                </div>
              ))}
            </Slider>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IndustryExpertsSection; 