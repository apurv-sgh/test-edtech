import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BecomeCounsellor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleClick = () => {
    if (!user || user.role !== 'counsellor') {
      navigate('/counsellor/login');
    } else {
      navigate('/become-counsellor');
    }
  };
  return (
    <button
      className="bg-primary hover:bg-primary-dark focus:ring-2 focus:ring-primary/50 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 outline-none"
      onClick={handleClick}
    >
      Become a Counsellor
    </button>
  );
};

export default BecomeCounsellor; 