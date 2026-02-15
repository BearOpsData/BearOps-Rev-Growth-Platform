'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import FrameworkTab from '@/components/tabs/FrameworkTab'
import AssessmentTab from '@/components/tabs/AssessmentTab'
import ProblemTab from '@/components/tabs/ProblemTab'
import CostTab from '@/components/tabs/CostTab'
import SolutionTab from '@/components/tabs/SolutionTab'
import PricingTab from '@/components/tabs/PricingTab'

export default function Home() {
  const [activeTab, setActiveTab] = useState('framework')

  const tabs = [
    { id: 'framework', label: 'Revenue Framework' },
    { id: 'assessment', label: 'Revenue Gap Analysis' },
    { id: 'problem', label: 'The Problem' },
    { id: 'cost', label: 'The Cost' },
    { id: 'solution', label: 'Why Not DIY' },
    { id: 'pricing', label: 'Pricing' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'framework':
        return <FrameworkTab onTabChange={setActiveTab} />
      case 'assessment':
        return <AssessmentTab onTabChange={setActiveTab} />
      case 'problem':
        return <ProblemTab onTabChange={setActiveTab} />
      case 'cost':
        return <CostTab onTabChange={setActiveTab} />
      case 'solution':
        return <SolutionTab onTabChange={setActiveTab} />
      case 'pricing':
        return <PricingTab onTabChange={setActiveTab} />
      default:
        return <FrameworkTab onTabChange={setActiveTab} />
    }
  }

  // Error boundary would be added here in production
  if (!tabs || tabs.length === 0) {
    return <div>Error: No tabs configured</div>
  }

  return (
    <div className="container">
      <Header />
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  )
}

