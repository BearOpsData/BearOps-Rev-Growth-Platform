/**
 * Security utilities and validation functions
 */

/**
 * Validates environment variables at startup
 */
export function validateEnvironmentVariables() {
  const requiredVars: string[] = []
  const optionalVars: string[] = []

  // Add required environment variables here as they're added
  // Example: if (process.env.API_KEY) { requiredVars.push('API_KEY') }

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }

  return true
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis or a dedicated service
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []

    // Remove requests outside the window
    const validRequests = requests.filter((time) => now - time < this.windowMs)

    if (validRequests.length >= this.maxRequests) {
      return false
    }

    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }

  reset(identifier: string): void {
    this.requests.delete(identifier)
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Generates a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const crypto = require('crypto')
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Validates CSRF token (placeholder - implement based on your auth system)
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // TODO: Implement proper CSRF validation
  // This is a placeholder
  return token === sessionToken && token.length > 0
}

