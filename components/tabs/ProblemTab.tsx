'use client'

interface ProblemTabProps {
  onTabChange?: (tabId: string) => void
}

export default function ProblemTab({ onTabChange }: ProblemTabProps) {
  return (
    <div 
      id="problem-panel" 
      role="tabpanel" 
      aria-labelledby="problem-tab"
      className="tab-content active"
    >
      <div className="section red">
        <div className="hero-content">
          <h2 className="hero-title">You've Hit the Revenue Wall</h2>
          <p className="hero-subtitle">
            Your startup scaled to $3–8M ARR on founder-led sales.<br />
            Now you're hiring AEs but revenue isn't scaling with headcount.
          </p>
          
          <div className="symptoms">
            <h3>The symptoms you're seeing:</h3>
            <div className="symptom-item">
              New reps take 6–9 months to ramp <span style={{ opacity: 0.7 }}>(should be 90 days)</span>
            </div>
            <div className="symptom-item">
              Only 30–50% of your team hits quota <span style={{ opacity: 0.7 }}>(should be 70%+)</span>
            </div>
            <div className="symptom-item">
              Forecasts swing 40% week-to-week <span style={{ opacity: 0.7 }}>(should be ±10%)</span>
            </div>
            <div className="symptom-item">
              Your VP Sales spends 60% of time firefighting instead of coaching
            </div>
          </div>

          <div className="root-cause">
            <strong>The root cause:</strong> You're scaling people without scaling infrastructure.
          </div>

          <div className="cta-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => onTabChange?.('cost')}
            >
              See What This Costs You
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onTabChange?.('framework')}
            >
              See The Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
