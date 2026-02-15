'use client'

interface PricingTabProps {
  onTabChange?: (tabId: string) => void
}

export default function PricingTab({ onTabChange }: PricingTabProps) {
  return (
    <div 
      id="pricing-panel" 
      role="tabpanel" 
      aria-labelledby="pricing-tab"
      className="tab-content active"
    >
      <div className="section blue">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2>Engagement Options</h2>
          <p>Designed for funded B2B SaaS startups between ~$3M and ~$15M ARR</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Diagnostic</h3>
            <p>4–6 weeks</p>
            <div className="price">€15k</div>
            <p>Deep dive on your current revenue engine with a clear, prioritised roadmap.</p>
            <ul style={{ paddingLeft: '18px', marginTop: '10px', fontSize: '0.95rem' }}>
              <li>Leadership interviews & deal reviews</li>
              <li>CRM & funnel analysis</li>
              <li>Revenue wall diagnosis & priorities</li>
              <li>Board-ready summary pack</li>
            </ul>
          </div>

          <div className="pricing-card popular">
            <h3>Revenue Infrastructure Sprint</h3>
            <p>10–12 weeks</p>
            <div className="price">€45k</div>
            <p>Design and implement the core infrastructure to scale from here to the next funding round.</p>
            <ul style={{ paddingLeft: '18px', marginTop: '10px', fontSize: '0.95rem' }}>
              <li>Clarified ICP, stages and qualification</li>
              <li>Standardised playbooks & coaching rhythm</li>
              <li>Scorecards, dashboards and pipeline hygiene standards</li>
              <li>Implementation support with your RevOps / sales leader</li>
            </ul>
          </div>

          <div className="pricing-card">
            <h3>Fractional RevOps</h3>
            <p>Quarterly</p>
            <div className="price">From €6k/mo</div>
            <p>Ongoing support to tune, maintain and extend your revenue operating system.</p>
            <ul style={{ paddingLeft: '18px', marginTop: '10px', fontSize: '0.95rem' }}>
              <li>Quarterly planning & scorecard reviews</li>
              <li>System changes & enablement support</li>
              <li>Board & investor reporting support</li>
              <li>Optional project add-ons as needed</li>
            </ul>
          </div>
        </div>

        <div className="faq-section">
          <h4>Common Questions</h4>

          <div className="faq-item">
            <div className="faq-question">How quickly will we see impact?</div>
            <div className="faq-answer">
              Most teams see clearer forecasts and a calmer leadership rhythm within one quarter. Full impact on win
              rates and ramp times typically shows in 2–3 quarters as the new operating system beds in.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">Do you replace our VP Sales or RevOps lead?</div>
            <div className="faq-answer">
              No. BearOps works <em>with</em> your existing leaders. Think of this as installing the rails and tooling
              so they can be more effective, not replacing them.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">What if we're earlier / later stage than your "sweet spot"?</div>
            <div className="faq-answer">
              The patterns work from first GTM hire up to ~€20M ARR. The shape of the engagement and level of
              involvement changes, but the core job is the same: give your revenue engine a simple, trusted backbone.
            </div>
          </div>
        </div>

        <div className="cta-buttons" style={{ marginTop: '3rem', justifyContent: 'center' }}>
          <a href="mailto:martin@bearops.com?subject=Discovery Call Request" className="btn btn-primary">
            Schedule 30-Min Discovery
          </a>
          <a href="mailto:martin@bearops.com?subject=Question About BearOps" className="btn btn-secondary">
            Email Me Questions
          </a>
        </div>
      </div>
    </div>
  )
}
