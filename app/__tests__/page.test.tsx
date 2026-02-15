import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../page'

// Mock the tab components
jest.mock('@/components/tabs/FrameworkTab', () => {
  return function FrameworkTab() {
    return <div data-testid="framework-tab">Framework Tab</div>
  }
})

jest.mock('@/components/tabs/AssessmentTab', () => {
  return function AssessmentTab() {
    return <div data-testid="assessment-tab">Assessment Tab</div>
  }
})

jest.mock('@/components/tabs/ProblemTab', () => {
  return function ProblemTab() {
    return <div data-testid="problem-tab">Problem Tab</div>
  }
})

jest.mock('@/components/tabs/CostTab', () => {
  return function CostTab() {
    return <div data-testid="cost-tab">Cost Tab</div>
  }
})

jest.mock('@/components/tabs/SolutionTab', () => {
  return function SolutionTab() {
    return <div data-testid="solution-tab">Solution Tab</div>
  }
})

jest.mock('@/components/tabs/PricingTab', () => {
  return function PricingTab() {
    return <div data-testid="pricing-tab">Pricing Tab</div>
  }
})

describe('Home Page', () => {
  it('renders the header', () => {
    render(<Home />)
    // Header is rendered via the component
    expect(screen.getByText('BearOps')).toBeInTheDocument()
  })

  it('renders all tab navigation buttons', () => {
    render(<Home />)
    expect(screen.getByText('Revenue Framework')).toBeInTheDocument()
    expect(screen.getByText('Revenue Gap Analysis')).toBeInTheDocument()
    expect(screen.getByText('The Problem')).toBeInTheDocument()
    expect(screen.getByText('The Cost')).toBeInTheDocument()
    expect(screen.getByText('Why Not DIY')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('displays Framework tab by default', () => {
    render(<Home />)
    expect(screen.getByTestId('framework-tab')).toBeInTheDocument()
  })

  it('switches tabs when clicked', () => {
    render(<Home />)
    
    // Click on Assessment tab
    const assessmentButton = screen.getByText('Revenue Gap Analysis')
    fireEvent.click(assessmentButton)
    
    expect(screen.getByTestId('assessment-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('framework-tab')).not.toBeInTheDocument()
  })

  it('switches to all tabs correctly', () => {
    render(<Home />)
    
    const tabs = [
      { button: 'The Problem', testId: 'problem-tab' },
      { button: 'The Cost', testId: 'cost-tab' },
      { button: 'Why Not DIY', testId: 'solution-tab' },
      { button: 'Pricing', testId: 'pricing-tab' },
    ]

    tabs.forEach(({ button, testId }) => {
      fireEvent.click(screen.getByText(button))
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
  })

  it('highlights active tab button', () => {
    render(<Home />)
    
    const frameworkButton = screen.getByText('Revenue Framework')
    expect(frameworkButton).toHaveClass('active')
    
    const assessmentButton = screen.getByText('Revenue Gap Analysis')
    fireEvent.click(assessmentButton)
    
    expect(assessmentButton).toHaveClass('active')
    expect(frameworkButton).not.toHaveClass('active')
  })
})

