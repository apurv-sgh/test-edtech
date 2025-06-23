import { useState } from 'react'
import './UploadVideos.css'

export default function UploadVideos({ onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    visibility: 'public',
    tags: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
    } else {
      alert('Please select a valid video file')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select a video file')
      return
    }

    setIsUploading(true)
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(0)
      alert('Video uploaded successfully!')
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        visibility: 'public',
        tags: ''
      })
      setSelectedFile(null)
    }, 500)
  }

  return (
    <div className="upload-videos-container">
      <div className="upload-content">
        <header className="upload-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h1>🎬 Upload Videos</h1>
          <p>Share your educational content with students</p>
        </header>

        <div className="upload-form-container">
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-section">
              <h3>Video Details</h3>

              <div className="form-group">
                <label htmlFor="title">Video Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your video content"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="history">History</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="visibility">Visibility</label>
                  <select
                    id="visibility"
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Upload Video</h3>

              <div className="file-upload-area">
                <input
                  type="file"
                  id="video-file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                {!selectedFile ? (
                  <div className="upload-zone" onClick={() => document.getElementById('video-file').click()}>
                    <div className="upload-icon">📁</div>
                    <p>Click to select video file or drag and drop</p>
                    <small>Supported formats: MP4, AVI, MOV, WMV (Max: 500MB)</small>
                  </div>
                ) : (
                  <div className="file-selected">
                    <div className="file-info">
                      <span className="file-icon">🎬</span>
                      <div className="file-details">
                        <p className="file-name">{selectedFile.name}</p>
                        <p className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file"
                        onClick={() => setSelectedFile(null)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="upload-btn"
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
