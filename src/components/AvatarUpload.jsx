import { useState } from 'react'
import './AvatarUpload.css'

export default function AvatarUpload({ onNext, onBack }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUploadClick = () => {
    document.getElementById('avatar-input').click()
  }

  const handleEditClick = () => {
    handleUploadClick()
  }

  const handleContinue = () => {
    onNext({ avatar: selectedFile })
  }

  return (
    <div className="avatar-upload-container">
      <div className="upload-card">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="upload-header">
          <div className="edtech-logo">
            <span className="logo-icon">🎓</span>
            <span>EDTECH</span>
          </div>
          <div className="step-indicator">2 / 2</div>
          <h2>Upload your Avatar</h2>
          <p>Setup your channel and start the revolutionization.</p>
        </div>

        <div className="avatar-section">
          <div className="avatar-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar preview" />
            ) : (
              <div className="avatar-placeholder">
                <span className="image-icon">🖼️</span>
              </div>
            )}
          </div>

          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div className="upload-buttons">
            <button className="upload-btn" onClick={handleUploadClick}>
              📤 Upload
            </button>
            <button className="edit-btn" onClick={handleEditClick}>
              ✏️ Edit
            </button>
          </div>
        </div>

        <button 
          className="continue-btn" 
          onClick={handleContinue}
          disabled={!selectedFile}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
