import { render, screen } from '@testing-library/react'
import FrameworkTab from '../FrameworkTab'

describe('FrameworkTab Component', () => {
  it('renders the framework title', () => {
    render(<FrameworkTab />)
    expect(screen.getByText('The BearOps Revenue Framework')).toBeInTheDocument()
  })

  it('renders the framework description', () => {
    render(<FrameworkTab />)
    expect(
      screen.getByText(/BearOps helps organisations build the foundation/)
    ).toBeInTheDocument()
  })

  it('renders all three pillars', () => {
    render(<FrameworkTab />)
    expect(screen.getByText('BearOps Vision & Alignment')).toBeInTheDocument()
    expect(screen.getByText('BearOps People & Process')).toBeInTheDocument()
    expect(screen.getByText('BearOps Tech & Insight')).toBeInTheDocument()
  })

  it('renders pillar icons', () => {
    render(<FrameworkTab />)
    expect(screen.getByText('🎯')).toBeInTheDocument()
    expect(screen.getByText('⚙️')).toBeInTheDocument()
    expect(screen.getByText('💻')).toBeInTheDocument()
  })

  it('renders links to process pages', () => {
    render(<FrameworkTab />)
    expect(
      screen.getByText('Clarifying Strategy & Aligning the Leadership Team')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Setting Clear Priorities & Driving Focused Execution')
    ).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    const { container } = render(<FrameworkTab />)
    const tabContent = container.querySelector('.tab-content')
    expect(tabContent).toBeInTheDocument()
    expect(tabContent).toHaveClass('active')
  })
})

