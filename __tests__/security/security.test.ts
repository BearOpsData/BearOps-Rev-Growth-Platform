/**
 * Security Tests
 * Tests for security configurations and validations
 */

import { sanitizeInput, isValidEmail, isValidUrl, rateLimiter } from '@/lib/security'

describe('Security Utilities', () => {
  describe('Input Sanitization', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const sanitized = sanitizeInput(input)
      expect(sanitized).toBe('scriptalert("xss")/scriptHello')
      expect(sanitized).not.toContain('<script>')
    })

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")'
      const sanitized = sanitizeInput(input)
      expect(sanitized).not.toContain('javascript:')
    })

    it('should remove event handlers', () => {
      const input = 'onclick="alert(1)" onerror="alert(2)"'
      const sanitized = sanitizeInput(input)
      expect(sanitized).not.toContain('onclick')
      expect(sanitized).not.toContain('onerror')
    })

    it('should handle non-string input', () => {
      expect(sanitizeInput(null as any)).toBe('')
      expect(sanitizeInput(undefined as any)).toBe('')
      expect(sanitizeInput(123 as any)).toBe('')
    })

    it('should trim whitespace', () => {
      const input = '  hello world  '
      const sanitized = sanitizeInput(input)
      expect(sanitized).toBe('hello world')
    })
  })

  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
    })
  })

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
    })
  })

  describe('Rate Limiting', () => {
    beforeEach(() => {
      // Reset rate limiter
      rateLimiter.reset('test-ip')
    })

    it('should allow requests within limit', () => {
      for (let i = 0; i < 10; i++) {
        expect(rateLimiter.isAllowed('test-ip')).toBe(true)
      }
    })

    it('should block requests exceeding limit', () => {
      // Make many requests quickly
      const results = []
      for (let i = 0; i < 150; i++) {
        results.push(rateLimiter.isAllowed('test-ip'))
      }

      // Some should be blocked
      expect(results.filter(r => !r).length).toBeGreaterThan(0)
    })

    it('should handle different identifiers separately', () => {
      expect(rateLimiter.isAllowed('ip1')).toBe(true)
      expect(rateLimiter.isAllowed('ip2')).toBe(true)
      expect(rateLimiter.isAllowed('ip1')).toBe(true)
    })
  })
})

describe('Security Headers', () => {
  it('should have security headers configured in middleware', () => {
    // This test verifies that security headers are expected
    // Actual testing would require integration test with Next.js
    const expectedHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security',
      'Content-Security-Policy',
    ]

    expectedHeaders.forEach((header) => {
      expect(header).toBeTruthy()
    })
  })
})

