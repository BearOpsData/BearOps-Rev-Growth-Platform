'use client'

import React, { useState } from 'react'

interface HeatmapDimension {
  pillar: string
  label: string
  items: Array<{ name: string; desc: string }>
}

const heatmapDimensions: HeatmapDimension[] = [
  {
    pillar: "Alignment",
    label: "Pillar 1 – Alignment & Operating Discipline",
    items: [
      { name: "Strategic Clarity & VTO", desc: "Clear 3-year vision, 1-year goals, quarterly priorities everyone can recite?" },
      { name: "ICP Definition", desc: "Specific, data-backed ICP that sales/marketing agree on?" },
      { name: "Leadership Alignment", desc: "Exec team agrees on priorities without revisiting issues?" },
      { name: "Quarterly Rocks", desc: "3–5 Rocks per quarter with 70%+ completion?" },
      { name: "Meeting Rhythm", desc: "Weekly L10s, monthly reviews, quarterly planning?" },
      { name: "Scorecard & KPIs", desc: "8–12 metrics tracked weekly with accountability?" },
      { name: "Value Proposition", desc: "One clear value prop used consistently?" }
    ]
  },
  {
    pillar: "People",
    label: "Pillar 2 – People, Roles & GTM Process",
    items: [
      { name: "Role Definition", desc: "Every role has documented responsibilities and metrics?" },
      { name: "Sales Methodology", desc: "One documented methodology everyone uses?" },
      { name: "Coaching Cadence", desc: "Regular 1:1s, deal reviews, development plans?" },
      { name: "Onboarding Program", desc: "Structured 60–90 day onboarding with milestones?" },
      { name: "Lead Routing", desc: "Automated routing with clear MQL→SQL→SAO rules?" },
      { name: "Sales → CS Handoff", desc: "Documented handoff with kickoffs and success plans?" },
      { name: "Deal Reviews", desc: "Weekly reviews with qualification criteria?" },
      { name: "Compensation Plans", desc: "Comp aligned to goals with clear accelerators?" }
    ]
  },
  {
    pillar: "Systems",
    label: "Pillar 3 – Systems, Data & Reporting",
    items: [
      { name: "CRM Foundation", desc: "CRM is single source of truth with 95%+ quality?" },
      { name: "Tech Stack Integration", desc: "All tools integrated with bidirectional sync?" },
      { name: "Lead Scoring", desc: "Automated scoring based on fit + intent?" },
      { name: "Journey Tracking", desc: "Can track full journey with attribution?" },
      { name: "Forecasting Accuracy", desc: "Within 10% of actuals for 3 consecutive quarters?" },
      { name: "Revenue Analytics", desc: "Real-time dashboards for win rates, velocity?" },
      { name: "Board Reporting", desc: "Automated decks without manual data pulls?" },
      { name: "Customer Health Scoring", desc: "Predicts churn 60–90 days in advance?" }
    ]
  }
]

interface AssessmentTabProps {
  onTabChange?: (tabId: string) => void
}

interface ScoreData {
  score: number
  pillar: string
}

export default function AssessmentTab({ onTabChange }: AssessmentTabProps) {
  const [scores, setScores] = useState<Record<string, ScoreData>>({})

  const handleScoreClick = (itemKey: string, score: number, pillar: string) => {
    setScores(prev => ({ ...prev, [itemKey]: { score, pillar } }))
  }

  const getHeatmapColor = (score: number) => {
    if (score >= 4.5) return '#22c55e'
    if (score >= 3.5) return '#34d399'
    if (score >= 2.5) return '#eab308'
    if (score >= 1.5) return '#fb923c'
    return '#f87171'
  }

  const getHeatmapLabel = (score: number) => {
    if (score >= 4.5) return '🎯 Integrated & Scalable'
    if (score >= 3.5) return '✅ Strong'
    if (score >= 2.5) return '⚠️ Defined but Inconsistent'
    if (score >= 1.5) return '🟡 Emerging'
    return '🔴 Ad hoc / Fragile'
  }

  const calculateResults = () => {
    const entries = Object.entries(scores)
    if (!entries.length) return null

    const pillarData: Record<string, { total: number; count: number; items: Array<{ name: string; score: number }> }> = {}
    
    entries.forEach(([itemKey, data]) => {
      const itemName = itemKey.split('-').slice(1).join('-')
      if (!pillarData[data.pillar]) {
        pillarData[data.pillar] = { total: 0, count: 0, items: [] }
      }
      pillarData[data.pillar].total += data.score
      pillarData[data.pillar].count++
      pillarData[data.pillar].items.push({ name: itemName, score: data.score })
    })

    Object.values(pillarData).forEach(p => {
      p.items.sort((a, b) => a.score - b.score)
    })

    const overallAvg = entries.reduce((sum, [, v]) => sum + v.score, 0) / entries.length
    const overallColor = getHeatmapColor(overallAvg)

    const weakest = Object.entries(pillarData)
      .sort((a, b) => (a[1].total / a[1].count) - (b[1].total / b[1].count))[0]

    return { pillarData, overallAvg, overallColor, weakest }
  }

  const results = calculateResults()


  return (
    <div 
      id="assessment-panel" 
      role="tabpanel" 
      aria-labelledby="assessment-tab"
      className="tab-content active"
    >
      <div className="heatmap-header">
        <div className="heatmap-title">BearOps Revenue Engine Heatmap</div>
        <p className="heatmap-subtitle">
          Score where your revenue engine really is today across Alignment, People & Process, and Systems & Data.
          Click the level (1–5) that best reflects reality for each row.
        </p>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'rgba(248,113,113,0.8)' }}></div>
            <span>1 = Ad hoc / fragile</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'rgba(251,146,60,0.8)' }}></div>
            <span>2 = Emerging</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'rgba(234,179,8,0.8)' }}></div>
            <span>3 = Defined but inconsistent</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'rgba(52,211,153,0.8)' }}></div>
            <span>4 = Strong</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: 'rgba(34,197,94,0.8)' }}></div>
            <span>5 = Integrated & scalable</span>
          </div>
        </div>
      </div>

      <div className="heatmap-card">
        <div className="card-title">
          Revenue Engine Maturity Heatmap
          <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 400, marginTop: '4px' }}>
            Click once per row. This should reflect how the company actually runs today, not the plan.
          </div>
        </div>

        <div className="instructions">
          <strong>📋 How to use this:</strong>
          Click once per row to score how your company <em>actually</em> operates today (not the plan). 
          We'll calculate your overall maturity, per-pillar scores, and the biggest bottleneck.
        </div>

        <table className="heatmap-table">
          <thead>
            <tr>
              <th style={{ minWidth: '280px' }}>Dimension</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
            </tr>
          </thead>
          <tbody id="heatmapRows">
            {heatmapDimensions.map((pillar) => (
              <React.Fragment key={pillar.pillar}>
                <tr>
                  <td className="pillar-label" colSpan={6}>{pillar.label}</td>
                </tr>
                {pillar.items.map((item) => {
                  const itemKey = `${pillar.pillar}-${item.name}`
                  const selectedScore = scores[itemKey]?.score
                  return (
                    <tr key={itemKey} data-pillar={pillar.pillar} data-item={item.name}>
                      <td>
                        <div className="row-label-main">{item.name}</div>
                        <div className="row-label-sub">{item.desc}</div>
                      </td>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <td key={score}>
                          <div
                            className={`level-cell lvl-${score} ${selectedScore === score ? 'selected' : ''}`}
                            onClick={() => handleScoreClick(itemKey, score, pillar.pillar)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleScoreClick(itemKey, score, pillar.pillar)
                              }
                            }}
                            aria-label={`Score ${item.name} as ${score}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <span>{score}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div id="heatmapResults" className="heatmap-results">
          {!results ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
              👆 Start by clicking a score (1–5) on a few rows above to see your maturity profile and priority focus.
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.12))', borderRadius: '12px', padding: '1.75rem' }}>
              <h2 style={{ color: '#3b82f6', marginBottom: '1.25rem', fontSize: '1.2rem' }}>📊 Your Revenue Engine Maturity</h2>

              <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(15,23,42,0.9)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Overall Score</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 700, color: results.overallColor }}>{results.overallAvg.toFixed(1)}/5</div>
                <div style={{ marginTop: '0.4rem', color: '#cbd5e1' }}>{getHeatmapLabel(results.overallAvg)}</div>
              </div>

              {Object.entries(results.pillarData).map(([pillarKey, data]) => {
                const avg = data.total / data.count
                const color = getHeatmapColor(avg)
                const pillarName =
                  pillarKey === 'Alignment' ? 'Alignment & Operating Discipline' :
                  pillarKey === 'People' ? 'People, Roles & GTM Process' :
                  'Systems, Data & Reporting'

                return (
                  <div key={pillarKey} style={{ marginBottom: '1.5rem', background: 'rgba(15,23,42,0.9)', borderRadius: '12px', padding: '1.25rem', borderLeft: `4px solid ${color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '1rem' }}>{pillarName}</h3>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{avg.toFixed(1)}</div>
                    </div>

                    <div style={{ display: 'grid', gap: '0.6rem' }}>
                      {data.items.map((item) => {
                        const barWidth = (item.score / 5) * 100
                        const itemColor = getHeatmapColor(item.score)

                        return (
                          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ flex: 1, color: '#cbd5e1', fontSize: '0.85rem' }}>{item.name}</div>
                            <div style={{ flex: '0 0 180px', position: 'relative', height: '20px', background: 'rgba(15,23,42,0.9)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ position: 'absolute', height: '100%', width: `${barWidth}%`, background: itemColor }}></div>
                              <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                {item.score}/5
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {results.weakest && (
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(16,185,129,0.12)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.5)' }}>
                  <h3 style={{ color: '#10b981', marginBottom: '0.75rem', fontSize: '1rem' }}>🎯 Priority Recommendation</h3>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    <strong>Start with: {
                      results.weakest[0] === 'Alignment' ? 'Alignment & Operating Discipline' :
                      results.weakest[0] === 'People' ? 'People, Roles & GTM Process' :
                      'Systems, Data & Reporting'
                    }</strong> ({(results.weakest[1].total / results.weakest[1].count).toFixed(1)}/5)<br /><br />
                    This is your biggest bottleneck. Focus here first over the next 4–6 weeks to lift revenue predictability before adding more headcount or complexity.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="cta-buttons" style={{ marginTop: '3rem' }}>
        <button 
          className="btn btn-primary"
          onClick={() => onTabChange?.('pricing')}
        >
          See How We Can Help
        </button>
        <a href="mailto:martin@bearops.com?subject=Maturity Assessment Discussion" className="btn btn-secondary">
          Discuss My Results
        </a>
      </div>
    </div>
  )
}
