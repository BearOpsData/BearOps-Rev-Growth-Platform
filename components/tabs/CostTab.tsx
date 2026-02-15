'use client'

import { useState } from 'react'

interface CostTabProps {
  onTabChange?: (tabId: string) => void
}

export default function CostTab({ onTabChange }: CostTabProps) {
  const [arr, setArr] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [attainment, setAttainment] = useState('')
  const [results, setResults] = useState<{
    quarterlyLoss: number
    annualLoss: number
    inefficiencyCost: number
    totalCost: number
  } | null>(null)

  const calculateCost = () => {
    const arrValue = parseFloat(arr) || 0
    const teamSizeValue = parseInt(teamSize) || 0
    const attainmentValue = parseFloat(attainment) || 0

    if (arrValue === 0 || teamSizeValue === 0 || attainmentValue === 0) {
      alert('Please fill in all fields')
      return
    }

    const targetAttainment = 70
    const avgQuotaPerRep = (arrValue * 1000000) / teamSizeValue
    const quarterlyQuotaPerRep = avgQuotaPerRep / 4
    
    const currentQuarterlyRevenue = quarterlyQuotaPerRep * teamSizeValue * (attainmentValue / 100)
    const targetQuarterlyRevenue = quarterlyQuotaPerRep * teamSizeValue * (targetAttainment / 100)
    
    const quarterlyLoss = targetQuarterlyRevenue - currentQuarterlyRevenue
    const annualLoss = quarterlyLoss * 4
    const inefficiencyCost = teamSizeValue * 30000
    const totalCost = annualLoss + inefficiencyCost

    setResults({
      quarterlyLoss,
      annualLoss,
      inefficiencyCost,
      totalCost,
    })
  }

  const formatCurrency = (value: number, suffix: string) => {
    if (suffix === 'K') {
      return `$${Math.round(value / 1000)}K`
    } else {
      return `$${(Math.round(value / 100000) / 10)}M`
    }
  }

  return (
    <div 
      id="cost-panel" 
      role="tabpanel" 
      aria-labelledby="cost-tab"
      className="tab-content active"
    >
      <div className="section yellow">
        <div className="section-header">
          <h2>What This Revenue Wall Costs You Each Quarter</h2>
          <p>Most CEOs underestimate the real cost of broken revenue infrastructure</p>
        </div>

        <div className="calculator-card">
          <div className="calculator-inputs">
            <div className="input-group">
              <label>Current ARR ($M)</label>
              <input 
                type="number" 
                id="arr" 
                placeholder="6" 
                step="0.1"
                value={arr}
                onChange={(e) => setArr(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Sales Team Size (AEs)</label>
              <input 
                type="number" 
                id="team-size" 
                placeholder="5" 
                step="1"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Average Quota Attainment (%)</label>
              <input 
                type="number" 
                id="attainment" 
                placeholder="40" 
                step="5"
                value={attainment}
                onChange={(e) => setAttainment(e.target.value)}
              />
            </div>
          </div>
          
          <button className="calculate-btn" onClick={calculateCost}>
            Calculate Your Cost
          </button>

          <div className={`calculator-results ${results ? 'show' : ''}`}>
            {results ? (
              <>
                <div className="calc-result-card">
                  <div className="calc-label">Quarterly Revenue Left on the Table</div>
                  <div className="calc-value">{formatCurrency(results.quarterlyLoss, 'K')}</div>
                </div>
                <div className="calc-result-card">
                  <div className="calc-label">Annual Revenue Left on the Table</div>
                  <div className="calc-value">{formatCurrency(results.annualLoss, 'M')}</div>
                </div>
                <div className="calc-result-card">
                  <div className="calc-label">Operational Inefficiency Cost</div>
                  <div className="calc-value">{formatCurrency(results.inefficiencyCost, 'K')}</div>
                </div>
                <div className="calc-result-card">
                  <div className="calc-label">Total Annual Cost of Broken Revenue Infrastructure</div>
                  <div className="calc-value">{formatCurrency(results.totalCost, 'M')}</div>
                </div>
              </>
            ) : (
              <>
                <div className="calc-result-card">
                  <div className="calc-label">Quarterly Revenue Left on the Table</div>
                  <div className="calc-value">$0K</div>
                </div>
                <div className="calc-result-card">
                  <div className="calc-label">Annual Revenue Left on the Table</div>
                  <div className="calc-value">$0M</div>
                </div>
                <div className="calc-result-card">
                  <div className="calc-label">Operational Inefficiency Cost</div>
                  <div className="calc-value">$0K</div>
                </div>
                <div className="calc-result-card">
                  <div className="calc-label">Total Annual Cost of Broken Revenue Infrastructure</div>
                  <div className="calc-value">$0M</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="cta-buttons" style={{ marginTop: '3rem' }}>
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
