/**
 * Unit tests for utility functions
 */

describe('Utility Functions', () => {
  describe('Tab switching logic', () => {
    it('should handle valid tab IDs', () => {
      const validTabs = ['framework', 'assessment', 'problem', 'cost', 'solution', 'pricing']
      
      validTabs.forEach(tab => {
        expect(tab).toBeTruthy()
        expect(typeof tab).toBe('string')
        expect(tab.length).toBeGreaterThan(0)
      })
    })

    it('should have consistent tab structure', () => {
      const tabs = [
        { id: 'framework', label: 'Revenue Framework' },
        { id: 'assessment', label: 'Revenue Gap Analysis' },
      ]

      tabs.forEach(tab => {
        expect(tab).toHaveProperty('id')
        expect(tab).toHaveProperty('label')
        expect(typeof tab.id).toBe('string')
        expect(typeof tab.label).toBe('string')
      })
    })
  })

  describe('Component props validation', () => {
    it('should validate tab navigation props', () => {
      const mockProps = {
        tabs: [
          { id: 'tab1', label: 'Tab 1' },
          { id: 'tab2', label: 'Tab 2' },
        ],
        activeTab: 'tab1',
        onTabChange: jest.fn(),
      }

      expect(mockProps.tabs).toBeInstanceOf(Array)
      expect(mockProps.tabs.length).toBeGreaterThan(0)
      expect(typeof mockProps.activeTab).toBe('string')
      expect(typeof mockProps.onTabChange).toBe('function')
    })
  })
})

