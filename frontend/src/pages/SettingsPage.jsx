import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiShield, FiBell, FiCamera } from 'react-icons/fi';

// --- Reusable Toggle Switch Component ---
const ToggleSwitch = ({ label, description, enabled, setEnabled }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="font-medium text-slate-800 dark:text-white">{label}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-dark-card
        ${enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`
      }
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}/>
    </button>
  </div>
);

const SettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    enrollments: true,
    submissions: true,
    messages: false,
    updates: true,
  });
  // Profile picture preview state
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Backend URL configuration
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const backendUrl = isLocalhost ? 'http://localhost:5000' : 'https://zegnite-backend2.onrender.com';

  // Protected View for teachers only
  if (user?.role !== 'teacher') {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">Only teachers can access this page.</p>
        <Link to="/" className="text-primary mt-4 inline-block font-semibold">← Go Back Home</Link>
      </div>
    );
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Store the file and show preview
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = ev => {
        setProfilePicPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!selectedFile) {
      alert('Please select a profile picture first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePic', selectedFile);
    
    try {
      const res = await fetch(`${backendUrl}/api/auth/upload-profile-pic`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.success && data.avatar) {
        setUser(prev => ({ ...prev, avatar: data.avatar, profilePicture: data.avatar }));
        setSelectedFile(null);
        setProfilePicPreview(null);
        alert('Profile picture updated successfully!');
      } else {
        alert(data.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Profile picture upload failed', err);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Settings</h1>
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg">
        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex gap-6 px-6">
            <button onClick={() => setActiveTab('profile')} className={`py-4 font-semibold ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}><FiUser className="inline -mt-1 mr-2"/>Profile</button>
            <button onClick={() => setActiveTab('security')} className={`py-4 font-semibold ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}><FiShield className="inline -mt-1 mr-2"/>Security</button>
            <button onClick={() => setActiveTab('notifications')} className={`py-4 font-semibold ${activeTab === 'notifications' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}><FiBell className="inline -mt-1 mr-2"/>Notifications</button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Profile Information</h2>
              <div className="flex items-center gap-6 p-4 bg-primary-light/50 dark:bg-slate-800/50 rounded-lg">
                <div className="relative w-24 h-24">
                  <img
                    src={profilePicPreview || (user.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${backendUrl}${user.profilePicture}`) : null) || user.avatar || `https://placehold.co/100x100/A78BFA/FFFFFF?text=${user.name.charAt(0)}`}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <input
                    id="profile-pic-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfilePicChange}
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-focus"
                    onClick={() => document.getElementById('profile-pic-input').click()}
                  >
                    <FiCamera />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-slate-500">{user.email}</p>
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={!selectedFile || isUploading}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        selectedFile && !isUploading 
                          ? 'bg-primary text-white hover:bg-primary-focus' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isUploading ? 'Uploading...' : 'Update Profile'}
                    </button>
                    {selectedFile && (
                      <button 
                        onClick={() => {
                          setSelectedFile(null);
                          setProfilePicPreview(null);
                        }}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              <form className="max-w-md space-y-4">
                <div><label>Current Password</label><input type="password" placeholder="••••••••" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
                <div><label>New Password</label><input type="password" placeholder="••••••••" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
                <div><label>Confirm New Password</label><input type="password" placeholder="••••••••" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
                <button className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-focus">Change Password</button>
              </form>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Notification Settings</h2>
              <p className="text-slate-500 mb-4">Choose how you want to be notified.</p>
              <div className="max-w-lg divide-y divide-slate-200 dark:divide-slate-700">
                <ToggleSwitch label="New Student Enrollments" description="Get notified when a new student enrolls in one of your courses." enabled={notifications.enrollments} setEnabled={() => setNotifications({...notifications, enrollments: !notifications.enrollments})}/>
                <ToggleSwitch label="Assignment Submissions" description="Get notified when a student submits an assignment." enabled={notifications.submissions} setEnabled={() => setNotifications({...notifications, submissions: !notifications.submissions})}/>
                <ToggleSwitch label="New Messages" description="Receive a notification for new messages in your channels." enabled={notifications.messages} setEnabled={() => setNotifications({...notifications, messages: !notifications.messages})}/>
                <ToggleSwitch label="Platform Updates" description="Receive news and updates about the EdTech platform." enabled={notifications.updates} setEnabled={() => setNotifications({...notifications, updates: !notifications.updates})}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;