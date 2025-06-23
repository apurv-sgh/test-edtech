import { useState, useEffect } from 'react'
import './GroupDiscussion.css'

export default function GroupDiscussion({ onBack }) {
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Leo Das',
      avatar: 'LD',
      message: 'Can someone help me understand the quadratic formula?',
      time: '10:30 AM',
      group: 'Mathematics',
      replies: 3
    },
    {
      id: 2,
      user: 'Pablo Wilson',
      avatar: 'PW',
      message: 'Great explanation in today\'s physics class! The diagram really helped.',
      time: '10:25 AM',
      group: 'Physics',
      replies: 1
    },
    {
      id: 3,
      user: 'Mike Louise',
      avatar: 'ML',
      message: 'Assignment due tomorrow. Anyone wants to form a study group?',
      time: '10:20 AM',
      group: 'Computer Science',
      replies: 5
    }
  ])

  const [groups] = useState([
    { id: 'all', name: 'All Discussions', count: 24 },
    { id: 'mathematics', name: 'Mathematics', count: 8 },
    { id: 'physics', name: 'Physics', count: 6 },
    { id: 'computer-science', name: 'Computer Science', count: 10 }
  ])

  const [activeUsers] = useState([
    { name: 'Alice Brown', avatar: 'AB', status: 'online' },
    { name: 'David Lee', avatar: 'DL', status: 'online' },
    { name: 'Emma Davis', avatar: 'ED', status: 'away' },
    { name: 'Frank Miller', avatar: 'FM', status: 'online' }
  ])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: 'You',
        avatar: 'YU',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        group: selectedGroup === 'all' ? 'General' : groups.find(g => g.id === selectedGroup)?.name,
        replies: 0
      }
      setMessages(prev => [message, ...prev])
      setNewMessage('')
    }
  }

  const filteredMessages = selectedGroup === 'all' 
    ? messages 
    : messages.filter(msg => msg.group.toLowerCase().replace(' ', '-') === selectedGroup)

  return (
    <div className="group-discussion-container">
      <div className="discussion-layout">
        {/* Sidebar */}
        <aside className="discussion-sidebar">
          <div className="sidebar-header">
            <button className="back-btn" onClick={onBack}>
              ← Back
            </button>
            <h2>👥 Group Discussion</h2>
          </div>

          <div className="groups-section">
            <h3>Discussion Groups</h3>
            <div className="groups-list">
              {groups.map(group => (
                <div 
                  key={group.id}
                  className={`group-item ${selectedGroup === group.id ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <span className="group-name">{group.name}</span>
                  <span className="group-count">{group.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="active-users-section">
            <h3>Active Users ({activeUsers.length})</h3>
            <div className="users-list">
              {activeUsers.map((user, index) => (
                <div key={index} className="user-item">
                  <div className="user-avatar">
                    <span>{user.avatar}</span>
                    <div className={`status-indicator ${user.status}`}></div>
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Discussion Area */}
        <main className="discussion-main">
          <div className="discussion-header">
            <h2>{groups.find(g => g.id === selectedGroup)?.name || 'All Discussions'}</h2>
            <div className="discussion-actions">
              <button className="action-btn">📎 Attach</button>
              <button className="action-btn">🔍 Search</button>
              <button className="action-btn">⚙️ Settings</button>
            </div>
          </div>

          <div className="messages-container">
            {filteredMessages.map(message => (
              <div key={message.id} className="message-card">
                <div className="message-header">
                  <div className="user-info">
                    <div className="user-avatar">{message.avatar}</div>
                    <div className="user-details">
                      <span className="user-name">{message.user}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                  </div>
                  <div className="message-group">#{message.group}</div>
                </div>

                <div className="message-content">
                  <p>{message.message}</p>
                </div>

                <div className="message-actions">
                  <button className="action-btn">👍 Like</button>
                  <button className="action-btn">💬 Reply ({message.replies})</button>
                  <button className="action-btn">📤 Share</button>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>No discussions yet</h3>
                <p>Start a conversation by posting your first message!</p>
              </div>
            )}
          </div>

          <div className="message-input-container">
            <form onSubmit={handleSendMessage} className="message-form">
              <div className="input-wrapper">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Start a discussion in ${groups.find(g => g.id === selectedGroup)?.name || 'this group'}...`}
                  rows="3"
                  className="message-input"
                />
                <div className="input-actions">
                  <button type="button" className="tool-btn">😊</button>
                  <button type="button" className="tool-btn">📎</button>
                  <button type="button" className="tool-btn">🖼️</button>
                </div>
              </div>
              <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                Send 📤
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
