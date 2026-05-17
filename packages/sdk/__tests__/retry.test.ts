import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../src/retry';

describe('retry utility', () => {
  it('should succeed on first attempt', async () => {
    const operation = vi.fn().mockResolvedValue('success');
    const result = await withRetry(operation);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    const result = await withRetry(operation, { maxAttempts: 3, delayMs: 10 });
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should throw after max attempts', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('fail'));
    
    await expect(
      withRetry(operation, { maxAttempts: 2, delayMs: 10 })
    ).rejects.toThrow('fail');
    
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should call onRetry callback', async () => {
    const onRetry = vi.fn();
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    await withRetry(operation, { maxAttempts: 3, delayMs: 10, onRetry });
    
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
  });

  it('should use exponential backoff', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    const startTime = Date.now();
    await withRetry(operation, { maxAttempts: 3, delayMs: 50, backoffMultiplier: 2 });
    const duration = Date.now() - startTime;
    
    // Should have waited: 50ms + 100ms = 150ms minimum
    expect(duration).toBeGreaterThanOrEqual(140);
  });
});
