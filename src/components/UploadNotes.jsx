import { useState } from 'react'
import './UploadNotes.css'
import { notesAPI } from '../services/api' 

export default function UploadNotes({ onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    course: '',
    description: '',
    tags: '',
    visibility: 'public'
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [noteContent, setNoteContent] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/') ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('course', formData.course)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('content', noteContent)
      formDataToSend.append('tags', formData.tags)
      formDataToSend.append('visibility', formData.visibility)
      
      // Add files
      selectedFiles.forEach(file => {
        formDataToSend.append('files', file)
      })
      
      // Make API call (for now, just simulate success)
      const response = await notesAPI.upload(formDataToSend)
      
      if (response.data.success) {
        alert('Notes uploaded successfully!')

      /*console.log('Uploading notes...', {
        title: formData.title,
        subject: formData.subject,
        course: formData.course,
        description: formData.description,
        content: noteContent,
        tags: formData.tags,
        visibility: formData.visibility,
        filesCount: selectedFiles.length
      })*/
      
      alert('Notes uploaded successfully!')
      
      // Reset form
      setFormData({
        title: '',
        subject: '',
        course: '',
        description: '',
        tags: '',
        visibility: 'public'
      })
      setSelectedFiles([])
      setNoteContent('')
    } 
  }catch (error) {
      console.error('Upload error:', error)
      alert(error.response?.data?.message || 'Failed to upload notes. Please try again.')
    }
  }

  return (
    <div className="upload-notes-container">
      <div className="upload-content">
        <header className="upload-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h1>📝 Upload Notes</h1>
          <p>Share your study materials and notes with students</p>
        </header>

        <div className="upload-form-container">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-section">
              <h3>Note Details</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Note Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter note title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="history">History</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="course">Select Course</label>
                <input
                  type="text"
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  placeholder="Enter specific Course Name or Id"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the notes"
                  rows="3"
                />
              </div>

              <div className="form-row">
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

                <div className="form-group">
                  <label htmlFor="visibility">Visibility</label>
                  <select
                    id="visibility"
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="class-only">Class Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Note Content</h3>

              <div className="content-tabs">
                <button type="button" className="tab active">Write Notes</button>
                <button type="button" className="tab">Upload Files</button>
              </div>

              <div className="content-area">
                <div className="text-editor">
                  <div className="editor-toolbar">
                    <button type="button" className="tool-btn">B</button>
                    <button type="button" className="tool-btn">I</button>
                    <button type="button" className="tool-btn">U</button>
                    <button type="button" className="tool-btn">📝</button>
                    <button type="button" className="tool-btn">📎</button>
                  </div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your notes here..."
                    rows="10"
                    className="note-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Attach Files</h3>

              <div className="file-upload-area">
                <input
                  type="file"
                  id="note-files"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                <div className="upload-zone" onClick={() => document.getElementById('note-files').click()}>
                  <div className="upload-icon">📎</div>
                  <p>Click to attach files or drag and drop</p>
                  <small>Supported: PDF, DOC, DOCX, Images (Max: 10MB each)</small>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="attached-files">
                    <h4>Attached Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-icon">📄</span>
                        <div className="file-details">
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button 
                          type="button" 
                          className="remove-file"
                          onClick={() => removeFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="save-draft-btn">
                Save as Draft
              </button>
              <button type="submit" className="publish-btn">
                Publish Notes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
