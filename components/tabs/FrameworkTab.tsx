'use client'

import Link from 'next/link'

interface FrameworkTabProps {
  onTabChange?: (tabId: string) => void
}

export default function FrameworkTab({ onTabChange }: FrameworkTabProps) {
  return (
    <div 
      id="framework-panel" 
      role="tabpanel" 
      aria-labelledby="framework-tab"
      className="tab-content active"
    >
      <div className="pillars-intro">
        <h2>The BearOps Revenue Framework</h2>
        <p>
          BearOps helps organisations build the foundation for scalable, repeatable revenue systems.
        </p>
      </div>

      <div className="pillars-grid">
        {/* Vision & Alignment Pillar */}
        <div className="pillar-card vision">
          <span className="pillar-icon">🎯</span>
          <h3 className="pillar-title">BearOps Vision & Alignment</h3>
          <p className="pillar-subtitle">
            Helping leadership create clarity, focus, and accountability so the whole company moves in one direction
            and executes with discipline.
          </p>
          <ul className="pillar-features">
            <li>
              <Link href="/process/clarifying-strategy-aligning-leadership">
                Clarifying Strategy & Aligning the Leadership Team
              </Link>
            </li>
            <li>
              <Link href="/process/setting-clear-priorities-focused-execution">
                Setting Clear Priorities & Driving Focused Execution
              </Link>
            </li>
            <li>
              <Link href="/process/ownership-accountability-high-performance-teams">
                Ownership, Accountability & High-Performance Teams
              </Link>
            </li>
          </ul>
        </div>

        {/* People & Process Pillar */}
        <div className="pillar-card process">
          <span className="pillar-icon">⚙️</span>
          <h3 className="pillar-title">BearOps People & Process</h3>
          <p className="pillar-subtitle">
            Create a high-performance organisation by giving people clear roles, playbooks, incentives, and aligned
            workflows, so the entire revenue engine executes the same way, every day.
          </p>
          <ul className="pillar-features">
            <li>
              <Link href="/process/standardised-sales-playbooks-leadership-cadence">
                Standardised Sales Playbooks & Leadership Cadence
              </Link>
            </li>
            <li>
              <Link href="/process/revenue-planning-quota-capacity">
                Market-Backed Quota & Compensation Models
              </Link>
            </li>
            <li>
              <Link href="/process/aligned-customer-journey">
                Aligned Customer Journey Across Marketing, Sales & CS
              </Link>
            </li>
          </ul>
        </div>

        {/* Tech & Insight Pillar */}
        <div className="pillar-card tech">
          <span className="pillar-icon">💻</span>
          <h3 className="pillar-title">BearOps Tech & Insight</h3>
          <p className="pillar-subtitle">
            Clean, connected systems and revenue analytics so your board, leadership team and managers are all looking at the same numbers.
          </p>
          <ul className="pillar-features">
            <li>
              <Link href="/process/one-source-of-truth">
                One Source of Truth for Metrics & Reporting
              </Link>
            </li>
            <li>
              <Link href="/process/clean-connected-revenue-tech-stack">
                Clean, Connected Revenue Tech Stack with Clear Ownership
              </Link>
            </li>
            <li>
              <Link href="/process/customer-journey-visibility-reporting-foundation">
                Customer Journey Visibility & Reporting Foundation
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="principle-panel">
        <div className="principle-header">
          <span className="principle-badge">BearOps Revenue Engine Principle</span>
          <span className="principle-title">"What is accepted is not applied."</span>
        </div>

        <div className="principle-grid">
          <div>
            <div className="principle-col-title">What's accepted on paper</div>
            <div className="principle-list">
              <div className="principle-item">
                <span className="principle-bullet">•</span>
                <span>"We have a clear strategy and priorities."</span>
              </div>
              <div className="principle-item">
                <span className="principle-bullet">•</span>
                <span>"There's one sales process everyone should follow."</span>
              </div>
              <div className="principle-item">
                <span className="principle-bullet">•</span>
                <span>"CRM is our source of truth for reporting."</span>
              </div>
            </div>
          </div>

          <div>
            <div className="principle-col-title">What's applied in reality</div>
            <div className="principle-list">
              <div className="principle-item">
                <span className="principle-bullet">•</span>
                <span>Execs pull in different directions once the quarter starts.</span>
              </div>
              <div className="principle-item">
                <span className="principle-bullet">•</span>
                <span>Each team runs their own version of the process.</span>
              </div>
              <div className="principle-item">
                <span className="principle-bullet">•</span>
                <span>Forecasts and dashboards don't quite match what's in the deals.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="principle-footer">
          <p style={{ marginBottom: '1rem' }}>
            Most leadership teams already agree they need clear strategy, one GTM process, clean data and accountable execution.
            The problem is that those standards live in slide decks and workshops, not in how the revenue engine actually runs
            week-to-week.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Every BearOps engagement follows a consistent pattern: <strong>discover the current state, map the ideal state, build
            the process together, train your team, and embed it into operations.</strong>
          </p>
          <p style={{ marginBottom: 0 }}>
            By the time we're done, you don't have a consultant's recommendations. You have <strong>working tools, documented
            standards, and a repeatable operating system</strong> that drives predictable revenue execution.
            <br /><br />
            <strong>This is infrastructure, not advice.</strong>
          </p>
        </div>
      </div>

      <div className="cta-buttons" style={{ marginTop: '3rem' }}>
        <button 
          className="btn btn-primary"
          onClick={() => onTabChange?.('assessment')}
        >
          Gap Analysis
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => onTabChange?.('pricing')}
        >
          See Pricing
        </button>
      </div>
    </div>
  )
}

