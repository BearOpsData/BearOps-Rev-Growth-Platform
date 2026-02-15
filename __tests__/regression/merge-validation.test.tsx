/**
 * Merge Validation Regression Tests
 * These tests run before code is merged to ensure no regressions
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

describe('Merge Validation - Pre-Merge Regression Tests', () => {
  /**
   * Critical Path: User can navigate the entire application
   * This must never break
   */
  it('CRITICAL: Complete user journey should work', async () => {
    render(<Home />)

    // 1. User lands on page
    expect(screen.getByText('BearOps')).toBeInTheDocument()
    expect(screen.getByText('Scale Revenue Infrastructure')).toBeInTheDocument()

    // 2. User sees Framework tab by default
    const frameworkTab = screen.getByText('Revenue Framework')
    expect(frameworkTab).toHaveClass('active')
    expect(screen.getByText(/BearOps helps organisations/i)).toBeInTheDocument()

    // 3. User navigates through all tabs
    const tabs = [
      'Revenue Gap Analysis',
      'The Problem',
      'The Cost',
      'Why Not DIY',
      'Pricing',
    ]

    for (const tabName of tabs) {
      const tab = screen.getByText(tabName)
      fireEvent.click(tab)
      
      await waitFor(() => {
        expect(tab).toHaveClass('active')
      })
    }

    // 4. User returns to Framework tab
    fireEvent.click(frameworkTab)
    await waitFor(() => {
      expect(frameworkTab).toHaveClass('active')
    })
  })

  /**
   * Critical Path: All components render without errors
   */
  it('CRITICAL: All components should render without errors', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    try {
      render(<Home />)
      
      // Should not have any console errors
      expect(consoleError).not.toHaveBeenCalled()
      expect(consoleWarn).not.toHaveBeenCalled()
    } finally {
      consoleError.mockRestore()
      consoleWarn.mockRestore()
    }
  })

  /**
   * Critical Path: Accessibility must be maintained
   */
  it('CRITICAL: Accessibility should not regress', () => {
    render(<Home />)

    // All tabs should be accessible
    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBeGreaterThan(0)

    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute('role', 'tab')
      expect(tab).toHaveAttribute('aria-selected')
      expect(tab).toHaveAttribute('aria-controls')
    })

    // Navigation should be properly labeled
    const nav = screen.getByRole('tablist')
    expect(nav).toHaveAttribute('aria-label')
  })

  /**
   * Critical Path: Framework tab content must be accessible
   */
  it('CRITICAL: Framework tab must always render core content', () => {
    render(<Home />)

    // These elements must always exist
    const criticalContent = [
      'The BearOps Revenue Framework',
      'BearOps Vision & Alignment',
      'BearOps People & Process',
      'BearOps Tech & Insight',
    ]

    criticalContent.forEach((content) => {
      expect(screen.getByText(content)).toBeInTheDocument()
    })
  })

  /**
   * Performance Regression: Tab switching should be fast
   */
  it('PERFORMANCE: Tab switching should be responsive', async () => {
    render(<Home />)

    const startTime = performance.now()
    
    const assessmentTab = screen.getByText('Revenue Gap Analysis')
    fireEvent.click(assessmentTab)
    
    await waitFor(() => {
      expect(assessmentTab).toHaveClass('active')
    })

    const endTime = performance.now()
    const duration = endTime - startTime

    // Tab switching should complete in under 100ms
    expect(duration).toBeLessThan(100)
  })

  /**
   * Data Integrity: Tab structure should be consistent
   */
  it('DATA INTEGRITY: Tab structure should not change', () => {
    render(<Home />)

    const expectedTabs = [
      { id: 'framework', label: 'Revenue Framework' },
      { id: 'assessment', label: 'Revenue Gap Analysis' },
      { id: 'problem', label: 'The Problem' },
      { id: 'cost', label: 'The Cost' },
      { id: 'solution', label: 'Why Not DIY' },
      { id: 'pricing', label: 'Pricing' },
    ]

    const buttons = screen.getAllByRole('tab')
    expect(buttons).toHaveLength(expectedTabs.length)

    expectedTabs.forEach((expectedTab, index) => {
      expect(buttons[index]).toHaveAttribute('id', `${expectedTab.id}-tab`)
      expect(buttons[index]).toHaveTextContent(expectedTab.label)
    })
  })
})

