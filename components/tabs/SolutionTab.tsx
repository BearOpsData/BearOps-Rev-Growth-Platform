'use client'

interface SolutionTabProps {
  onTabChange?: (tabId: string) => void
}

export default function SolutionTab({ onTabChange }: SolutionTabProps) {
  return (
    <div 
      id="solution-panel" 
      role="tabpanel" 
      aria-labelledby="solution-tab"
      className="tab-content active"
    >
      <div className="section green">
        <div className="section-header">
          <h2>Why Not Just Build This Internally?</h2>
          <p>
            You absolutely can. The question is whether your leadership team has the time, alignment and reusable assets
            to do it while still hitting this quarter's number.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '10px' }}>The DIY Path</h3>
            <p style={{ marginBottom: '10px' }}>Most teams try to build this internally by:</p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.95rem' }}>
              <li>Running ad hoc workshops on ICP, stages and playbooks.</li>
              <li>Copying bits of methodology from books, blogs and conferences.</li>
              <li>Configuring Salesforce / HubSpot on the fly as issues appear.</li>
              <li>Writing long Notion docs nobody keeps up to date.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              It <em>can</em> work – but it usually takes 12–18 months, burns a lot of leadership calories, and still leaves gaps.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: '10px' }}>The BearOps Path</h3>
            <p style={{ marginBottom: '10px' }}>Instead, BearOps brings:</p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.95rem' }}>
              <li>A pre-built revenue operating system (EOS/Pinnacle inspired) adapted for SaaS.</li>
              <li>Templates for VTO, accountability charts, playbooks, scorecards and reviews.</li>
              <li>Working examples from other funded startups at your stage.</li>
              <li>Hands-on support to implement in 8–12 weeks, not 18 months.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              You finish with tools and operating rhythms your team owns – not a PowerPoint you forget about.
            </p>
          </div>
        </div>

        <div className="cta-buttons" style={{ marginTop: '3rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onTabChange?.('assessment')}
          >
            Score Your Revenue Engine
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => onTabChange?.('pricing')}
          >
            See Engagement Options
          </button>
        </div>
      </div>
    </div>
  )
}
