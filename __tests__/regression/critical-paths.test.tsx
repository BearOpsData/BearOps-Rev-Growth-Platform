/**
 * Regression Tests - Critical User Paths
 * These tests ensure core functionality doesn't break when code is merged
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

describe('Regression Tests - Critical User Paths', () => {
  describe('Home Page Critical Paths', () => {
    it('should always render the header on page load', () => {
      render(<Home />)
      expect(screen.getByText('BearOps')).toBeInTheDocument()
      expect(screen.getByText('Scale Revenue Infrastructure')).toBeInTheDocument()
    })

    it('should always show Framework tab by default', () => {
      render(<Home />)
      const frameworkButton = screen.getByText('Revenue Framework')
      expect(frameworkButton).toHaveClass('active')
      expect(screen.getByText(/BearOps helps organisations/i)).toBeInTheDocument()
    })

    it('should always allow navigation between all tabs', () => {
      render(<Home />)
      
      const tabs = [
        'Revenue Framework',
        'Revenue Gap Analysis',
        'The Problem',
        'The Cost',
        'Why Not DIY',
        'Pricing',
      ]

      tabs.forEach((tabName) => {
        const tabButton = screen.getByText(tabName)
        fireEvent.click(tabButton)
        expect(tabButton).toHaveClass('active')
      })
    })

    it('should maintain tab state correctly when switching', () => {
      render(<Home />)
      
      // Start on Framework
      const frameworkTab = screen.getByText('Revenue Framework')
      expect(frameworkTab).toHaveClass('active')
      
      // Switch to Assessment
      const assessmentTab = screen.getByText('Revenue Gap Analysis')
      fireEvent.click(assessmentTab)
      expect(assessmentTab).toHaveClass('active')
      expect(frameworkTab).not.toHaveClass('active')
      
      // Switch back - regression: should work correctly
      fireEvent.click(frameworkTab)
      expect(frameworkTab).toHaveClass('active')
      expect(assessmentTab).not.toHaveClass('active')
    })
  })

  describe('Component Rendering Regression', () => {
    it('should always render all navigation tabs', () => {
      render(<Home />)
      
      const expectedTabs = [
        'Revenue Framework',
        'Revenue Gap Analysis',
        'The Problem',
        'The Cost',
        'Why Not DIY',
        'Pricing',
      ]

      expectedTabs.forEach((tab) => {
        expect(screen.getByText(tab)).toBeInTheDocument()
      })
    })

    it('should always render Framework tab content structure', () => {
      render(<Home />)
      
      // Critical content that should never break
      expect(screen.getByText('The BearOps Revenue Framework')).toBeInTheDocument()
      expect(screen.getByText('BearOps Vision & Alignment')).toBeInTheDocument()
      expect(screen.getByText('BearOps People & Process')).toBeInTheDocument()
      expect(screen.getByText('BearOps Tech & Insight')).toBeInTheDocument()
    })

    it('should always render all three pillars in Framework tab', () => {
      render(<Home />)
      
      const pillars = [
        'BearOps Vision & Alignment',
        'BearOps People & Process',
        'BearOps Tech & Insight',
      ]

      pillars.forEach((pillar) => {
        expect(screen.getByText(pillar)).toBeInTheDocument()
      })
    })
  })

  describe('User Interaction Regression', () => {
    it('should handle rapid tab switching without errors', async () => {
      render(<Home />)
      
      const tabs = [
        'Revenue Framework',
        'Revenue Gap Analysis',
        'The Problem',
        'The Cost',
      ]

      // Rapidly switch between tabs
      for (const tabName of tabs) {
        const tab = screen.getByText(tabName)
        fireEvent.click(tab)
        await waitFor(() => {
          expect(tab).toHaveClass('active')
        })
      }
    })

    it('should not break when clicking the same tab multiple times', () => {
      render(<Home />)
      
      const frameworkTab = screen.getByText('Revenue Framework')
      
      // Click same tab multiple times
      fireEvent.click(frameworkTab)
      fireEvent.click(frameworkTab)
      fireEvent.click(frameworkTab)
      
      // Should still work correctly
      expect(frameworkTab).toHaveClass('active')
      expect(screen.getByText(/BearOps helps organisations/i)).toBeInTheDocument()
    })
  })

  describe('Data Integrity Regression', () => {
    it('should maintain correct tab order', () => {
      render(<Home />)
      
      const expectedOrder = [
        'Revenue Framework',
        'Revenue Gap Analysis',
        'The Problem',
        'The Cost',
        'Why Not DIY',
        'Pricing',
      ]

      const buttons = screen.getAllByRole('tab')
      const actualOrder = buttons.map(btn => btn.textContent)

      expect(actualOrder).toEqual(expectedOrder)
    })

    it('should have consistent tab IDs', () => {
      render(<Home />)
      
      const expectedIds = ['framework', 'assessment', 'problem', 'cost', 'solution', 'pricing']
      const buttons = screen.getAllByRole('tab')
      
      expectedIds.forEach((expectedId, index) => {
        expect(buttons[index]).toHaveAttribute('id', `${expectedId}-tab`)
      })
    })
  })

  describe('Accessibility Regression', () => {
    it('should always have proper ARIA attributes', () => {
      render(<Home />)
      
      const buttons = screen.getAllByRole('tab')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('role', 'tab')
        expect(button).toHaveAttribute('aria-selected')
        expect(button).toHaveAttribute('aria-controls')
      })
    })

    it('should always have accessible navigation structure', () => {
      render(<Home />)
      
      const navigation = screen.getByRole('tablist')
      expect(navigation).toBeInTheDocument()
      expect(navigation).toHaveAttribute('aria-label', 'Main navigation tabs')
    })
  })
})

