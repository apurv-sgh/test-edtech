import React, { useEffect, useState } from 'react';
import CounsellorCard from './CounsellorCard';
import BecomeCounsellor from './BecomeCounsellor';
import { getCounsellorProfiles } from '../../api/counsellors';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeroCtaSection from '../HeroCtaSection';
import counsellorIllustration from '../../assets/counselors.jpg';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const cardImages = [
  '/assets/teacher-1.jpg',
  '/assets/teacher-2.jpg',
  '/assets/teacher-3.jpg',
  '/assets/teacher-4.jpg',
  '/assets/counselors.jpg',
];

const CounsellorsSection = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBecomeCounsellor = useCallback(() => {
    if (!user) {
      navigate('/signup?role=counsellor');
    } else if (user.role === 'counsellor') {
      if (user.status === 'pending') {
        navigate('/become-counsellor'); // Will show pending message
      } else if (user.status === 'verified') {
        navigate('/counsellor/dashboard');
      }
    } else {
      navigate('/become-counsellor');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await getCounsellorProfiles();
        setProfiles(res.data || []);
      } catch {
        setProfiles([]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  // Carousel settings
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

  return (
    
    <section className="py-0 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900">

      {/* Hero/CTA Section */}
      <HeroCtaSection
        headline="Get personalized 1:1 guidance for your academic and career journey"
        description="Our expert counsellors provide personalized admission guidance, career planning, interview preparation, and more—through dedicated 1:1 sessions tailored to your needs."
        primaryBtn={{ label: 'View All Counsellors', to: '/counsellors' }}
        secondaryBtn={{ label: 'Become Counsellor', onClick: handleBecomeCounsellor }}
        image={counsellorIllustration}
        imagePosition="right"
        bgClass=""
      />

      {/* Counsellors Carousel */}
      
      <div className="container mx-auto px-4 mb-12 py-8">
        {loading ? (
          <div className="text-center py-12">Loading counsellors...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No counsellors available at the moment.</div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <Slider {...settings}>
              {profiles.slice(0, 10).map((profile, idx) => (
                <div key={profile._id} className="px-2 py-4">
                  <CounsellorCard counsellor={{
                    id: profile._id, // Use the profile's MongoDB _id for navigation and fetching
                    name: profile.counsellor?.name,
                    company: profile.currentCompany,
                    experience: profile.experience,
                    topics: profile.topics,
                    rating: profile.counsellor?.rating || 4.5,
                    image: profile.profilePicture || cardImages[idx % cardImages.length],
                    feedback: profile.counsellor?.feedback || 0,
                  }} />
            </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
};

export default CounsellorsSection; 