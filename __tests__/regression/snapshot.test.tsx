/**
 * Snapshot Regression Tests
 * These tests catch unintended UI changes by comparing component output
 */

import { render } from '@testing-library/react'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import FrameworkTab from '@/components/tabs/FrameworkTab'

describe('Snapshot Regression Tests', () => {
  const mockTabs = [
    { id: 'framework', label: 'Revenue Framework' },
    { id: 'assessment', label: 'Revenue Gap Analysis' },
  ]

  const mockOnTabChange = jest.fn()

  it('Header component should match snapshot', () => {
    const { container } = render(<Header />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('TabNavigation component should match snapshot', () => {
    const { container } = render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="framework"
        onTabChange={mockOnTabChange}
      />
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('TabNavigation with active tab should match snapshot', () => {
    const { container } = render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="assessment"
        onTabChange={mockOnTabChange}
      />
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('FrameworkTab component should match snapshot', () => {
    const { container } = render(<FrameworkTab />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should detect changes in component structure', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('.header')
    
    // Critical structure that should never change
    expect(header).toBeInTheDocument()
    expect(header?.querySelector('.logo')).toBeInTheDocument()
    expect(header?.querySelector('.tagline')).toBeInTheDocument()
    expect(header?.querySelector('.subtitle')).toBeInTheDocument()
  })
})

