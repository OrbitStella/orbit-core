import { describe, it, expect, vi } from 'vitest'
import { greet, formatDate, capitalize, debounce } from '../src/index'

describe('shared-utils', () => {
  describe('greet', () => {
    it('should return greeting with name', () => {
      expect(greet('World')).toBe('Hello, World!')
    })

    it('should handle empty string', () => {
      expect(greet('')).toBe('Hello, !')
    })

    it('should handle special characters', () => {
      expect(greet('John Doe')).toBe('Hello, John Doe!')
    })
  })

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      expect(formatDate(date)).toBe('2024-01-15')
    })

    it('should handle different dates', () => {
      const date = new Date('2023-12-31T23:59:59Z')
      expect(formatDate(date)).toBe('2023-12-31')
    })

    it('should handle leap year', () => {
      const date = new Date('2024-02-29T00:00:00Z')
      expect(formatDate(date)).toBe('2024-02-29')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('should handle all caps', () => {
      expect(capitalize('HELLO')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('should handle string with spaces', () => {
      expect(capitalize('hello world')).toBe('Hello world')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      // Call multiple times quickly
      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled()

      // Fast forward time
      vi.advanceTimersByTime(100)

      // Should have been called once with last argument
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg3')
    })

    it('should call function after wait time', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn('test')

      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled()

      // Fast forward time
      vi.advanceTimersByTime(50)

      // Should be called after wait time
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should reset timer on new calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      
      // Advance time partially
      vi.advanceTimersByTime(50)
      
      // Should not be called yet
      expect(mockFn).not.toHaveBeenCalled()
      
      // Call again
      debouncedFn('second')
      
      // Advance original wait time
      vi.advanceTimersByTime(50)
      
      // Still should not be called (timer reset)
      expect(mockFn).not.toHaveBeenCalled()
      
      // Advance full wait time from last call
      vi.advanceTimersByTime(50)
      
      // Should be called now
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('second')
    })

    it('should handle multiple arguments', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2', 'arg3')
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })
  })
})
