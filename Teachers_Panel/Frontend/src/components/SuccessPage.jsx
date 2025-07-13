import './SuccessPage.css'

export default function SuccessPage({ onStart }) {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-header">
          <div className="edtech-logo">
            <span className="logo-icon">🎓</span>
            <span>EDTECH</span>
          </div>
        </div>

        <div className="success-content">
          <div className="success-icon">
            <div className="check-circle">
              <span className="check-mark">✓</span>
            </div>
          </div>

          <h2>Channel created successfully!</h2>
          <p>Welcome aboard! Start your success journey with Edtech!</p>

          <button className="start-btn" onClick={onStart}>
            Let's Start!
          </button>
        </div>
      </div>
    </div>
  )
}
