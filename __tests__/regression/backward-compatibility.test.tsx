/**
 * Backward Compatibility Regression Tests
 * Ensures that changes don't break existing functionality or APIs
 */

import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import Home from '@/app/page'

describe('Backward Compatibility Regression Tests', () => {
  describe('Component API Stability', () => {
    it('Header should always accept no props', () => {
      // Regression: Header should work without props
      expect(() => render(<Header />)).not.toThrow()
    })

    it('TabNavigation should accept expected props structure', () => {
      const props = {
        tabs: [
          { id: 'tab1', label: 'Tab 1' },
          { id: 'tab2', label: 'Tab 2' },
        ],
        activeTab: 'tab1',
        onTabChange: jest.fn(),
      }

      // Regression: Should not break with expected props
      expect(() => render(<TabNavigation {...props} />)).not.toThrow()
    })

    it('TabNavigation should handle empty tabs array gracefully', () => {
      const props = {
        tabs: [],
        activeTab: '',
        onTabChange: jest.fn(),
      }

      // Regression: Should not crash with empty tabs
      expect(() => render(<TabNavigation {...props} />)).not.toThrow()
    })
  })

  describe('CSS Class Stability', () => {
    it('should always use expected CSS classes', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('.header')
      expect(header).toBeInTheDocument()
      expect(header?.querySelector('.logo')).toBeInTheDocument()
      expect(header?.querySelector('.tagline')).toBeInTheDocument()
      expect(header?.querySelector('.subtitle')).toBeInTheDocument()
    })

    it('should maintain tab navigation CSS classes', () => {
      const { container } = render(
        <TabNavigation
          tabs={[{ id: 'tab1', label: 'Tab 1' }]}
          activeTab="tab1"
          onTabChange={jest.fn()}
        />
      )
      
      const nav = container.querySelector('.tab-navigation')
      expect(nav).toBeInTheDocument()
      
      const button = container.querySelector('.tab-btn')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('active')
    })
  })

  describe('Data Structure Compatibility', () => {
    it('should handle tab data structure correctly', () => {
      const tabs = [
        { id: 'framework', label: 'Revenue Framework' },
        { id: 'assessment', label: 'Revenue Gap Analysis' },
      ]

      render(
        <TabNavigation
          tabs={tabs}
          activeTab="framework"
          onTabChange={jest.fn()}
        />
      )

      // Regression: Should render all tabs
      tabs.forEach((tab) => {
        expect(screen.getByText(tab.label)).toBeInTheDocument()
      })
    })

    it('should maintain link structure in FrameworkTab', () => {
      render(<FrameworkTab />)
      
      // Regression: Critical links should always exist
      expect(
        screen.getByText('Clarifying Strategy & Aligning the Leadership Team')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Setting Clear Priorities & Driving Focused Execution')
      ).toBeInTheDocument()
    })
  })

  describe('Behavior Compatibility', () => {
    it('should maintain default tab behavior', () => {
      render(<Home />)
      
      // Regression: Framework should always be default
      const frameworkTab = screen.getByText('Revenue Framework')
      expect(frameworkTab).toHaveClass('active')
    })

    it('should maintain tab switching behavior', () => {
      const { container } = render(<Home />)
      
      const assessmentTab = screen.getByText('Revenue Gap Analysis')
      assessmentTab.click()
      
      // Regression: Active class should move correctly
      expect(assessmentTab).toHaveClass('active')
      
      const frameworkTab = screen.getByText('Revenue Framework')
      expect(frameworkTab).not.toHaveClass('active')
    })
  })
})

