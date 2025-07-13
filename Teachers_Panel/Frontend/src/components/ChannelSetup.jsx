import { useState } from 'react'
import './ChannelSetup.css'

export default function ChannelSetup({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    channelName: '',
    category: '',
    singleTeam: '',
    username: '',
    bio: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="channel-setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div className="edtech-logo">
            <span className="logo-icon">🎓</span>
            <span>EDTECH</span>
          </div>
          <div className="step-indicator">1 / 2</div>
          <h2>Create Your Channel</h2>
          <p>Setup your channel and start the revolutionization.</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="channelName">Channel Name *</label>
            <input
              type="text"
              id="channelName"
              value={formData.channelName}
              onChange={(e) => handleInputChange('channelName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="science">Science</option>
              <option value="mathematics">Mathematics</option>
              <option value="language">Language</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="singleTeam">Single/Team *</label>
            <select
              id="singleTeam"
              value={formData.singleTeam}
              onChange={(e) => handleInputChange('singleTeam', e.target.value)}
              required
            >
              <option value="">Select Strength</option>
              <option value="single">Single Instructor</option>
              <option value="small">Small Team (2-5)</option>
              <option value="medium">Medium Team (6-15)</option>
              <option value="large">Large Team (15+)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              placeholder="Your Full Name"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio *</label>
            <textarea
              id="bio"
              placeholder="Channel Description"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows="3"
              required
            />
          </div>

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
