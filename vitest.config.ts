import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/**/__tests__/**/*.test.{js,ts}',
      'packages/**/*.test.{js,ts}',
      'apps/**/__tests__/**/*.test.{js,ts}',
      'apps/**/*.test.{js,ts}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/*.config.{js,ts}',
        '**/*.d.ts'
      ]
    },
    setupFiles: ['./vitest.setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@orbit-core/sdk': resolve(__dirname, './packages/sdk/src'),
      '@orbit-core/cli': resolve(__dirname, './packages/cli/src'),
      '@orbit-core/shared-utils': resolve(__dirname, './packages/shared-utils/src'),
      '@orbit-core/web': resolve(__dirname, './apps/web/src')
    }
  }
})
