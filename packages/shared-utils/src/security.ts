/**
 * Security utilities for sensitive operations
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Hash a string using SHA-256
 */
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Validate a Stellar public key format
 */
export function validatePublicKey(key: string): boolean {
  // Stellar public keys start with 'G' and are 56 characters long
  const stellarKeyRegex = /^G[A-Z0-9]{55}$/;
  return stellarKeyRegex.test(key);
}

/**
 * Validate a Stellar secret key format
 */
export function validateSecretKey(key: string): boolean {
  // Stellar secret keys start with 'S' and are 56 characters long
  const stellarSecretRegex = /^S[A-Z0-9]{55}$/;
  return stellarSecretRegex.test(key);
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length);
  }
  return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars * 2) + data.slice(-visibleChars);
}

/**
 * Check if a string contains potential security risks
 */
export function hasSecurityRisks(input: string): boolean {
  const riskPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /document\./i,
    /window\./i
  ];

  return riskPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  reset(): void {
    this.requests = [];
  }
}
