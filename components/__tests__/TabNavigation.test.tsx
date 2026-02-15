import { render, screen, fireEvent } from '@testing-library/react'
import TabNavigation from '../TabNavigation'

describe('TabNavigation Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ]

  it('renders all tabs', () => {
    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="tab1"
        onTabChange={() => {}}
      />
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="tab2"
        onTabChange={() => {}}
      />
    )

    const tab2 = screen.getByText('Tab 2')
    expect(tab2).toHaveClass('active')
  })

  it('calls onTabChange when a tab is clicked', () => {
    const mockOnTabChange = jest.fn()
    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="tab1"
        onTabChange={mockOnTabChange}
      />
    )

    const tab2 = screen.getByText('Tab 2')
    fireEvent.click(tab2)

    expect(mockOnTabChange).toHaveBeenCalledWith('tab2')
    expect(mockOnTabChange).toHaveBeenCalledTimes(1)
  })

  it('renders correct number of buttons', () => {
    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="tab1"
        onTabChange={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('applies correct CSS classes', () => {
    const { container } = render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="tab1"
        onTabChange={() => {}}
      />
    )

    const navigation = container.querySelector('.tab-navigation')
    expect(navigation).toBeInTheDocument()
  })
})

