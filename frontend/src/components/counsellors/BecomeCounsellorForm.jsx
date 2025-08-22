import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaBriefcase, FaClock, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';

const BecomeCounsellorForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState(null); // null, 'none', 'pending', 'verified'
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    linkedinUrl: '',
    currentCompany: '',
    experience: '',
    availableTime: '',
    skills: '',
    bio: '',
    sessionPrice: '',
    sessionDuration: ''
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?role=counsellor');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/counsellors/me', {
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

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      documents.forEach(doc => {
        formData.append('documents', doc);
      });
      await axios.post('http://localhost:5000/api/counsellors/profile', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit application');
    }
    setLoading(false);
  };

  // Only do conditional rendering after all hooks
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
          <Button onClick={() => navigate("/counsellor/dashboard")}>
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
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">You are already a registered counsellor!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You can edit your profile and manage your sessions from your dashboard.</p>
          <button
            onClick={() => navigate('/counsellor/dashboard')}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Go to Counsellor Dashboard
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
              Thank you for your interest in becoming a counsellor.
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
            onClick={() => window.history.back()}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Counsellors
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
              <strong>Note:</strong> The information you provide will be used for verification purposes. Only verified counsellors can offer 1:1 guidance to students.
            </p>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Become a Career Counsellor
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Help students navigate college admissions and career planning through personalized 1:1 guidance sessions
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
                  name="currentCompany"
                  value={form.currentCompany}
                  onChange={handleChange}
                  required
                  placeholder="Your current company"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Experience and Availability */}
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
                  <FaClock className="inline mr-2" />
                  Available Time *
                </label>
                <select
                  name="availableTime"
                  value={form.availableTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="">Select availability</option>
                  <option value="weekdays-evening">Weekdays (Evening)</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                  <option value="weekdays-day">Weekdays (Day)</option>
                </select>
              </div>
            </div>

            {/* Session Price and Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Session Price (INR) *
                </label>
                <input
                  name="sessionPrice"
                  value={form.sessionPrice}
                  onChange={handleChange}
                  required
                  type="number"
                  min="0"
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Session Duration *
                </label>
                <select
                  name="sessionDuration"
                  value={form.sessionDuration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="">Select duration</option>
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1 hour">1 hour</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Areas of Expertise *
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                placeholder="e.g., Admission Guidance, Career Planning, Interview Preparation, Resume Review, College Applications"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Specify your counseling and guidance expertise areas
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
                placeholder="Tell us about your experience in career counseling, admission guidance, and why you want to help students with their academic and career journey..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
              />
            </div>

            {/* Document Upload */}
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Verification Documents (Resume, Certificates, or any proof of counselling expertise)</label>
              <input name="documents" type="file" multiple onChange={handleFileChange} className="w-full" />
              <p className="text-xs text-slate-500 mt-1">Upload your resume, certificates, or any document that proves your counselling expertise.</p>
            </div>
            {documents.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selected files:</p>
                <div className="space-y-1">
                  {documents.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FaFileUpload className="text-primary" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              </div>
            )}

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

export default BecomeCounsellorForm; 