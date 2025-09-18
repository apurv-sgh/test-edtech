import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaBriefcase, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import api from '../../api/api';

const API_URL = `${api.defaults.baseURL}`;

const BecomeIndustryExpertForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState(null); // null, 'none', 'pending', 'verified'
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    linkedinUrl: '',
    company: '',
    experience: '',
    domain: '',
    skills: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?role=industry_expert');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/industry-experts/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data && res.data.status) {
          setProfileStatus(res.data.status); // 'pending' or 'verified'
        } else {
          setProfileStatus('none');
        }
      } catch (err) {
        setProfileStatus('none'); // No profile exists
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = { ...form };
      // Convert skills to array if it's a string
      if (typeof formData.skills === 'string') {
        formData.skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      await axios.post(`${API_URL}/api/industry-experts/profile`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit application');
    }
    setLoading(false);
  };

  if (!user || profileStatus === null) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }
  if (profileStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Your application is under review!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Our team is reviewing your details. You will be notified once verified.</p>
          <div>
          <Button onClick={() => navigate("/industry-experts/dashboard")} >
            Back to Dashboard
          </Button>
        </div>        
        </div>
      </div>
    );
  }
  if (profileStatus === 'verified') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">You are already a registered industry expert!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You can edit your profile and manage your seminars from your dashboard.</p>
          <button
            onClick={() => navigate('/industry-experts/dashboard')}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Go to Expert Dashboard
          </button>
        </div>
      </div>
    );
  }
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Application Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thank you for your interest in becoming an industry expert.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
              What happens next?
            </h3>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Our team will review your application within 24 hours</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>We'll verify your credentials and experience</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>You'll receive an email notification with the result</p>
              </div>
            </div>
          </div>
          <button
            onClick={() =>navigate('/industry-experts/dashboard')}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Experts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 rounded">
            <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
              <strong>Note:</strong> The information you provide will be used for verification purposes. Only verified experts can offer webinars and seminars to students.
            </p>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Become an Industry Expert
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your expertise and help students through live webinars and seminars.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaLinkedin className="inline mr-2" />
                  LinkedIn Profile URL *
                </label>
                <input
                  name="linkedinUrl"
                  value={form.linkedinUrl}
                  onChange={handleChange}
                  required
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaBriefcase className="inline mr-2" />
                  Current Company *
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="Your current company"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Experience and Domain */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Domain/Field of Expertise *
                </label>
                <input
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Data Science, Web Development, UI/UX, Business Analytics"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Key Skills/Technologies *
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                placeholder="e.g., Python, React, Machine Learning, Figma, Analytics"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                List your main technical or domain skills (comma separated)
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Professional Bio *
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Tell us about your industry experience, achievements, and what you can offer to students..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              By submitting this form, you agree to our terms of service and privacy policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeIndustryExpertForm; 