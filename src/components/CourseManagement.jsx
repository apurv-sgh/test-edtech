
import { useState, useEffect } from 'react'
import { courseAPI } from '../services/api'
import './CourseManagement.css'

export default function CourseManagement({ onBack }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subject: '',
    level: 'beginner',
    duration: 0,
    price: 0,
    maxStudents: 100,
    prerequisites: '',
    learningOutcomes: '',
    tags: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    setLoading(true)
    try {
      const response = await courseAPI.getMyCourses()
      console.log("API upload response:", response);
      if (response.data.success) {
        setCourses(response.data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      alert('Failed to fetch courses')
    }
    setLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      subject: '',
      level: 'beginner',
      duration: 0,
      price: 0,
      maxStudents: 100,
      prerequisites: '',
      learningOutcomes: '',
      tags: '',
      startDate: '',
      endDate: ''
    })
    setEditingCourse(null)
    setShowCreateForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents),
        prerequisites: formData.prerequisites.split(',').map(p => p.trim()).filter(p => p),
        learningOutcomes: formData.learningOutcomes.split(',').map(o => o.trim()).filter(o => o),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      let response
      if (editingCourse) {
        response = await courseAPI.update(editingCourse._id, courseData)
      } else {
        response = await courseAPI.create(courseData)
      }
      console.log("API upload response:", response);

      if (response.data.success) {
        alert(editingCourse ? 'Course updated successfully!' : 'Course created successfully!')
        resetForm()
        fetchMyCourses()
      }
    } catch (error) {
      console.error('Error saving course:', error)
      alert(error.response?.data?.message || 'Failed to save course')
    }
    setLoading(false)
  }

  const handleEdit = (course) => {
    setFormData({
      ...course,
      prerequisites: course.prerequisites.join(', '),
      learningOutcomes: course.learningOutcomes.join(', '),
      tags: course.tags.join(', '),
      startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
      endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : ''
    })
    setEditingCourse(course)
    setShowCreateForm(true)
  }

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await courseAPI.delete(courseId)
        if (response.data.success) {
          alert('Course deleted successfully!')
          fetchMyCourses()
        }
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Failed to delete course')
      }
    }
  }

  return (
    <div className="course-management-container">
      <div className="course-content">
        <header className="course-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div className="header-info">
            <h1>📚 Course Management</h1>
            <p>Create and manage your courses</p>
          </div>
          <button 
            className="create-course-btn" 
            onClick={() => setShowCreateForm(true)}
          >
            + Create New Course
          </button>
        </header>

        {showCreateForm && (
          <div className="course-form-modal">
            <div className="form-wrapper">
              <div className="form-header">
                <h3>{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
                <button className="close-btn" onClick={resetForm}>✕</button>
              </div>

              <form onSubmit={handleSubmit} className="course-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Course Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter course title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="academic">Academic</option>
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Biology</option>
                      <option value="english">English</option>
                      <option value="history">History</option>
                      <option value="computer-science">Computer Science</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your course..."
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (hours) *</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="20"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Students</label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                      placeholder="100"
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    value={formData.prerequisites}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                    placeholder="Basic math, Computer fundamentals (comma separated)"
                  />
                </div>

                <div className="form-group">
                  <label>Learning Outcomes</label>
                  <input
                    type="text"
                    value={formData.learningOutcomes}
                    onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
                    placeholder="Students will learn, Students will understand (comma separated)"
                  />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="programming, web-development, javascript (comma separated)"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="courses-list">
          {loading && !showCreateForm ? (
            <div className="loading">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="no-courses">
              <h3>No courses yet</h3>
              <p>Create your first course to get started!</p>
            </div>
          ) : (
            courses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="badge">{course.category}</span>
                    <span className="badge">{course.subject}</span>
                    <span className="badge level-{course.level}">{course.level}</span>
                  </div>
                  <div className="course-stats">
                    <span>{course.duration} hours</span>
                    <span>{course.enrolledStudents?.length || 0} students</span>
                    <span>${course.price}</span>
                  </div>
                </div>
                <div className="course-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
