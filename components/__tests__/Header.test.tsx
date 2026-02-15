import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header Component', () => {
  it('renders the BearOps logo text', () => {
    render(<Header />)
    expect(screen.getByText('BearOps')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Header />)
    expect(screen.getByText('Scale Revenue Infrastructure')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Header />)
    expect(screen.getByText('Clarity that Scales, Structure that Performs')).toBeInTheDocument()
  })

  it('renders the logo image with correct alt text', () => {
    render(<Header />)
    const logoImage = screen.getByAltText('BearOps Logo')
    expect(logoImage).toBeInTheDocument()
    // Next.js Image component may render differently, so we check for presence
  })

  it('has correct CSS classes', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('.header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('header')
  })
})

