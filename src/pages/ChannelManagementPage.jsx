import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiEdit, FiTrash, FiX, FiUsers, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Modal Component for the Form ---
const ChannelModal = ({ isOpen, onClose, onSave, channelToEdit }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', category: 'JEE', team: 'Science Team', teacher: user?.name || '', bio: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (channelToEdit) {
      setFormData(channelToEdit);
      setLogoPreview(channelToEdit.logo || null);
      setLogoFile(null);
    } else {
      setFormData({ name: '', category: 'JEE', team: 'Science Team', teacher: user?.name || '', bio: '' });
      setLogoPreview(null);
      setLogoFile(null);
    }
  }, [channelToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass logoFile and logoPreview in formData
    onSave({ ...formData, logo: logoPreview, logoFile });
    onClose();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = ev => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><FiX /></button>
        <h2 className="text-2xl font-bold mb-4">{channelToEdit ? 'Edit Community' : 'Create New Community'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Community Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" /></div>
          <div className="flex gap-4">
            <div className="w-1/2"><label>Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><option>JEE</option><option>NEET</option><option>UPSC</option></select></div>
            <div className="w-1/2"><label>Your Team</label><select value={formData.team} onChange={(e) => setFormData({ ...formData, team: e.target.value })} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><option>Science Team</option><option>Arts Team</option><option>Commerce Team</option></select></div>
          </div>
          <div><label>Teacher Name</label><input type="text" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" /></div>
          <div><label>Community Bio</label><textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows="3" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"></textarea></div>
          <div>
            <label>Community Logo/Image</label>
            <div className="flex items-center gap-4 mt-1">
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {logoPreview && (
                <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded object-cover border" />
              )}
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">{channelToEdit ? 'Save Changes' : 'Create Community'}</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ChannelManagementPage = () => {
  const { user } = useContext(AuthContext);
  const [channels, setChannels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const navigate = useNavigate();

  const handleSaveChannel = (channelData) => {
    if (editingChannel) {
      setChannels(channels.map(c => c.id === editingChannel.id ? { ...c, ...channelData } : c));
      alert('Community updated successfully!');
    } else {
      setChannels([...channels, { ...channelData, id: Date.now() }]);
      alert('Community created successfully!');
    }
    setEditingChannel(null);
  };

  const handleDeleteChannel = (id) => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      setChannels(channels.filter(c => c.id !== id));
    }
  };

  const openCreateModal = () => {
    setEditingChannel(null);
    setIsModalOpen(true);
  };

  const openEditModal = (channel) => {
    setEditingChannel(channel);
    setIsModalOpen(true);
  };

  const handleCardClick = (channelId) => {
    // Navigate to the dedicated chat/management page for this channel
    navigate(`/teacher-dashboard/channel/${channelId}`);
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">Only teachers can manage communities.</p>
        <Link to="/" className="text-primary mt-4 inline-block font-semibold">← Go Back Home</Link>
      </div>
    );
  }

  return (
    <>
      <ChannelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveChannel} channelToEdit={editingChannel} />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Communities</h1>
          <button onClick={openCreateModal} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-primary-focus transition-colors">
            <FiPlus /> Create New Community
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="text-center py-20 bg-primary-light/50 dark:bg-dark-card rounded-xl shadow-md border-2 border-dashed border-slate-300 dark:border-slate-700">
            <FiMessageSquare className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">Create a new community to connect with your students</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Your created communities will appear here.</p>
            <button onClick={openCreateModal} className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">
              Create Your First Community
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {channels.map(channel => (
                <motion.div key={channel.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-dark-card rounded-xl shadow-md flex flex-col">
                  <div onClick={() => handleCardClick(channel.id)} className="p-6 flex-grow cursor-pointer">
                    <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-2 py-1 rounded-full">{channel.category}</span>
                    <div className="flex items-center justify-between mt-3">
                      <h3 className="text-xl font-bold">{channel.name}</h3>
                      {channel.logo && (
                        <img
                          src={typeof channel.logo === 'string' ? channel.logo : URL.createObjectURL(channel.logo)}
                          alt="Logo"
                          className="w-12 h-12 rounded-full object-cover border ml-4"
                          style={{ flexShrink: 0 }}
                        />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">by {channel.teacher}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 flex-grow line-clamp-2">{channel.bio}</p>
                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                    <button onClick={() => openEditModal(channel)} className="w-full bg-primary/10 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20"><FiEdit /> Edit</button>
                    <button onClick={() => handleDeleteChannel(channel.id)} className="w-full bg-red-500/10 text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20"><FiTrash /> Delete</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};
export default ChannelManagementPage;