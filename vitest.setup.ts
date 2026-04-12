// Vitest setup file
import { beforeAll, afterAll } from 'vitest'

// Global test setup
beforeAll(() => {
  // Set up test environment
  process.env.NODE_ENV = 'test'
})

afterAll(() => {
  // Clean up after tests
  delete process.env.NODE_ENV
})

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
}
