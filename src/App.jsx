import './App.css'
import { useState } from 'react'
import { useTeacherAuth } from './services/useAuth'
import ChannelSetup from './components/ChannelSetup'
import AvatarUpload from './components/AvatarUpload'
import SuccessPage from './components/SuccessPage'
import UploadVideos from './components/UploadVideos'
import UploadNotes from './components/UploadNotes'
import GroupDiscussion from './components/GroupDiscussion'
import CourseManagement from './components/CourseManagement'
import LiveSession from './components/LiveSession'

export default function App() {
   useTeacherAuth();

  const [currentStep, setCurrentStep] = useState('dashboard') // dashboard, channelSetup, avatarUpload, success, uploadVideos, uploadNotes, groupDiscussion,courseManagement
  const [activeTab, setActiveTab] = useState('overview')
  const [channelData, setChannelData] = useState({})

  const handleCreateChannelClick = () => {
    setCurrentStep('channelSetup')
  }

  const handleChannelSetupNext = (data) => {
    setChannelData(prev => ({ ...prev, ...data }))
    setCurrentStep('avatarUpload')
  }

  const handleChannelSetupBack = () => {
    setCurrentStep('dashboard')
  }

  const handleAvatarUploadNext = (data) => {
    setChannelData(prev => ({ ...prev, ...data }))
    setCurrentStep('success')
  }

  const handleAvatarUploadBack = () => {
    setCurrentStep('channelSetup')
  }

  const handleSuccessStart = () => {
    setCurrentStep('dashboard')
  }

  const handleCourseManagement= () => {
    setCurrentStep('courseManagement')
  }

  const handleLiveSessions= () => {
    setCurrentStep('liveSessions')
  }

  const handleUploadVideosClick = () => {
    setCurrentStep('uploadVideos')
  }

  const handleUploadNotesClick = () => {
    setCurrentStep('uploadNotes')
  }

  const handleGroupDiscussionClick = () => {
    setCurrentStep('groupDiscussion')
  }

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard')
  }

  if (currentStep === 'channelSetup') {
    return <ChannelSetup onNext={handleChannelSetupNext} onBack={handleChannelSetupBack} />
  }

  if (currentStep === 'avatarUpload') {
    return <AvatarUpload onNext={handleAvatarUploadNext} onBack={handleAvatarUploadBack} />
  }

  if (currentStep === 'success') {
    return <SuccessPage onStart={handleSuccessStart} />
  }

  if (currentStep === 'courseManagement') {
    return <CourseManagement onNext={handleCourseManagement} onBack={handleBackToDashboard} />
  }

  if (currentStep === 'liveSessions') {
    return <LiveSession onNext={handleLiveSessions} onBack={handleBackToDashboard} />
  }

  if (currentStep === 'uploadVideos') {
    return <UploadVideos onBack={handleBackToDashboard} />
  }

  if (currentStep === 'uploadNotes') {
    return <UploadNotes onBack={handleBackToDashboard} />
  }

  if (currentStep === 'groupDiscussion') {
    return <GroupDiscussion onBack={handleBackToDashboard} />
  }

  // Dashboard view
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-avatar">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSarXFXlU3auvYEOOyKAnggkGZ2WJBQcv41qg&s" alt="Profile" />
          </div>
          <h3>Hey Suresh</h3>
          <p>Continue Your Journey And Achieve Your Target</p>
          <div className="profile-stats">
            <div className="stat">
              <span>🔔</span>
            </div>
            <div className="stat">
              <span>📚</span>
            </div>
            <div className="stat">
              <span>📧</span>
            </div>
          </div>
        </div>

        <nav className="nav-menu">
          <h4>OVERVIEW</h4>
          <ul>
            <li className={activeTab === 'overview' ? 'active' : ''}>
              <span>📊</span> Dashboard
            </li>
            <li onClick={handleCreateChannelClick} style={{ cursor: 'pointer' }}>
              <span>👥</span> New Channel
            </li>
            <li onClick={handleCourseManagement} style={{ cursor: 'pointer' }}>
              <span>📚</span> Course Management
            </li>
            <li onClick={handleLiveSessions} style={{ cursor: 'pointer' }}>
              <span>🎥</span> Live Sessions
            </li>
            <li onClick={handleUploadVideosClick} style={{ cursor: 'pointer' }}>
              <span>🎬</span> Upload Videos
            </li>
            <li onClick={handleUploadNotesClick} style={{ cursor: 'pointer' }}>
              <span>📝</span> Upload Notes
            </li>
            <li onClick={handleGroupDiscussionClick} style={{ cursor: 'pointer' }}>
              <span>👨‍🏫</span> Groups
            </li>
          </ul>

          <h4>OTHER TUTORS</h4>
          <div className="tutor-list">
            <div className="tutor">
              <div className="tutor-avatar"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSarXFXlU3auvYEOOyKAnggkGZ2WJBQcv41qg&s" alt="Profile" /></div>
              <span>Prakash Bansal</span>
            </div>
            <div className="tutor">
              <div className="tutor-avatar"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSarXFXlU3auvYEOOyKAnggkGZ2WJBQcv41qg&s" alt="Profile" /></div>
              <span>Naval Arora</span>
            </div>
          </div>

          <h4>SETTINGS</h4>
          <ul>
            <li>
              <span>⚙️</span> Settings
            </li>
            <li>
              <span>🚪</span> Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <input type="text" placeholder="Type here..." />
          </div>
            <button className="filter-btn">🔽</button>
          <div className="platform-info">
            <div className="logo">E</div>
            <span>EDTECH</span>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, Suresh Rawat</h1>
            <p>You have 27 new students added to your domain. Please reach out to the Team if you want them excluded from your domain.</p>
          </div>
          <div className="welcome-illustration">
            <div className="people-icons">
              <img src="https://static.tildacdn.com/tild6664-3331-4565-b631-643736616136/photo.svg" alt="illustration" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="chart-card">
            <h3>Channel Statistic</h3>
            <div className="chart">
              <div className="bars">
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
                <div className="bar" style={{height: '70%'}}></div>
                <div className="bar" style={{height: '50%'}}></div>
              </div>
            </div>
            <p>Months:</p>
            <br />
            <div className="insights">
              <h4>Insights</h4>

            </div>
          </div>

          <div className="batch-report">
            <h3>Batch Report</h3>
            <div className="batch-stats">
              <div className="batch-item">
                <span className="batch-label">Class A</span>
                <div className="progress-circle">
                  <span>32%</span>
                </div>
              </div>
              <div className="batch-item">
                <span className="batch-label">Class B</span>
                <div className="progress-circle">
                  <span>43%</span>
                </div>
              </div>
              <div className="batch-item">
                <span className="batch-label">Class C</span>
                <div className="progress-circle">
                  <span>67%</span>
                </div>
              </div>
              <div className="batch-item">
                <span className="batch-label">Class D</span>
                <div className="progress-circle">
                  <span>56%</span>
                </div>
              </div>
              <div className="batch-item">
                <span className="batch-label">Class E</span>
                <div className="progress-circle">
                  <span>77%</span>
                </div>
              </div> 
            </div>
          </div>

          <div className="recent-activities">
            <div className="activities-header">
              <h3>Recent Activities</h3>
              <button>See all</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-date">31</div>
                <div className="activity-details">
                  <h4>Meeting with the B.A</h4>
                  <p>10:00 AM - 3:00 PM</p>
                  <span>Meeting Hall</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">04</div>
                <div className="activity-details">
                  <h4>Meeting with the J...</h4>
                  <p>10:00 AM - 3:00 PM</p>
                  <span>Meeting Hall</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">12</div>
                <div className="activity-details">
                  <h4>Class B middle exer...</h4>
                  <p>10:00 AM - 3:00 PM</p>
                  <span>Quizzing</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">16</div>
                <div className="activity-details">
                  <h4>Send Mr App depa...</h4>
                  <p>10:00 AM - 3:00 PM</p>
                  <span>Assignment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Cards */}
        <section className="bottom-cards">
          <div className="card-item">
            <div className="notify">
            🔔</div>
            <div className="card-date">
              <span>03/04/2024</span>
              <span>Batch A</span>
            </div>
          </div>
          <div className="card-item">
            <div className="notify">
            🔔</div>
            <div className="card-date">
              <span>03/04/2024</span>
              <span>Batch B</span>
            </div>
          </div>
          <div className="card-item">
            <div className="card-date">
              <span>Explore More Batches </span>

            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Live Classes</h3>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Assignments</h3>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Earnings & Analytics</h3>
          </div>
        </section>
      </main>
    </div>
  )
}
