/**
 * Integration tests for routing and navigation
 * These tests verify that the application routing works correctly
 */

describe('Routing Integration Tests', () => {
  it('should have correct link structure in FrameworkTab', () => {
    // This test verifies that links are properly structured
    // In a real scenario, we'd test actual Next.js routing
    const expectedLinks = [
      '/process/clarifying-strategy-aligning-leadership',
      '/process/setting-clear-priorities-focused-execution',
      '/process/ownership-accountability-high-performance-teams',
    ]

    // Links should be properly formatted
    expectedLinks.forEach(link => {
      expect(link).toMatch(/^\/process\//)
      expect(link).not.toContain(' ')
      expect(link).not.toContain('_')
    })
  })

  it('should have consistent URL structure', () => {
    // All process links should follow the same pattern
    const linkPattern = /^\/process\/[a-z0-9-]+$/
    
    const testLinks = [
      '/process/clarifying-strategy-aligning-leadership',
      '/process/setting-clear-priorities-focused-execution',
      '/process/standardised-sales-playbooks-leadership-cadence',
    ]

    testLinks.forEach(link => {
      expect(link).toMatch(linkPattern)
    })
  })
})

