import { describe, it, expect } from 'vitest';
import { validateEnv, getEnvVar, LogLevel, Logger } from '../src';

describe('shared-utils integration tests', () => {
  it('should validate environment variables correctly', () => {
    const specs = [
      { name: 'NODE_ENV', required: true, type: 'string' as const },
      { name: 'PORT', required: false, type: 'number' as const, defaultValue: 3000 },
      { name: 'API_URL', required: true, type: 'url' as const }
    ];

    const result = validateEnv(specs, {
      NODE_ENV: 'test',
      PORT: '3000',
      API_URL: 'https://api.example.com'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid environment variables', () => {
    const specs = [
      { name: 'API_URL', required: true, type: 'url' as const }
    ];

    const result = validateEnv(specs, {
      API_URL: 'not-a-url'
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should get environment variable with default', () => {
    const value = getEnvVar('NON_EXISTENT_VAR', 'default-value');
    expect(value).toBe('default-value');
  });

  it('should log messages at different levels', () => {
    const logger = new Logger('TestLogger', LogLevel.DEBUG);
    
    expect(() => logger.debug('Debug message')).not.toThrow();
    expect(() => logger.info('Info message')).not.toThrow();
    expect(() => logger.warn('Warning message')).not.toThrow();
    expect(() => logger.error('Error message')).not.toThrow();
  });
});
