import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

describe('Application Integration Tests', () => {
  it('renders complete application structure', () => {
    render(<Home />)
    
    // Check header
    expect(screen.getByText('BearOps')).toBeInTheDocument()
    expect(screen.getByText('Scale Revenue Infrastructure')).toBeInTheDocument()
    
    // Check navigation
    expect(screen.getByText('Revenue Framework')).toBeInTheDocument()
    
    // Check default tab content
    expect(screen.getByText(/BearOps helps organisations/i)).toBeInTheDocument()
  })

  it('navigates through all tabs without errors', async () => {
    render(<Home />)
    
    const tabs = [
      'Revenue Framework',
      'Revenue Gap Analysis',
      'The Problem',
      'The Cost',
      'Why Not DIY',
      'Pricing',
    ]

    for (const tabName of tabs) {
      const tabButton = screen.getByText(tabName)
      fireEvent.click(tabButton)
      
      await waitFor(() => {
        expect(tabButton).toHaveClass('active')
      })
    }
  })

  it('maintains state when switching tabs', () => {
    render(<Home />)
    
    // Start on Framework tab
    const frameworkTab = screen.getByText('Revenue Framework')
    expect(frameworkTab).toHaveClass('active')
    
    // Switch to Assessment
    const assessmentTab = screen.getByText('Revenue Gap Analysis')
    fireEvent.click(assessmentTab)
    expect(assessmentTab).toHaveClass('active')
    expect(frameworkTab).not.toHaveClass('active')
    
    // Switch back to Framework
    fireEvent.click(frameworkTab)
    expect(frameworkTab).toHaveClass('active')
    expect(assessmentTab).not.toHaveClass('active')
  })

  it('renders all components without console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Home />)
    
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})

