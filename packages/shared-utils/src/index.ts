/**
 * Shared utilities for Orbit Core applications
 */

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Logging utility for consistent log formatting
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(prefix: string = 'Orbit', level: LogLevel = LogLevel.INFO) {
    this.prefix = prefix;
    this.level = level;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (level < this.level) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context
    };

    const levelStr = LogLevel[level];
    const timestamp = entry.timestamp.toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';

    console.log(`[${timestamp}] [${this.prefix}] [${levelStr}] ${message}${contextStr}`);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

export function createLogger(prefix: string, level?: LogLevel): Logger {
  return new Logger(prefix, level);
}

/**
 * Environment validation helper
 */
export interface EnvVarSpec {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'url';
  defaultValue?: string | number | boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnv(
  specs: EnvVarSpec[],
  env: Record<string, string | undefined> = process.env
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const spec of specs) {
    const value = env[spec.name];

    if (value === undefined) {
      if (spec.required) {
        errors.push(`Required environment variable ${spec.name} is not set`);
      } else if (spec.defaultValue !== undefined) {
        warnings.push(`Environment variable ${spec.name} is not set, using default value`);
      }
      continue;
    }

    // Type validation
    switch (spec.type) {
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`Environment variable ${spec.name} must be a number`);
        }
        break;
      case 'boolean':
        if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
          errors.push(`Environment variable ${spec.name} must be a boolean`);
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`Environment variable ${spec.name} must be a valid URL`);
        }
        break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function getEnvVar(
  name: string,
  defaultValue?: string,
  env: Record<string, string | undefined> = process.env
): string {
  return env[name] ?? defaultValue ?? '';
}

// Export performance utilities
export { MemoizeCache, memoize, batch, debounceImmediate, throttle } from './performance';

// Export security utilities
export { 
  sha256, 
  generateToken, 
  sanitizeInput, 
  validatePublicKey, 
  validateSecretKey, 
  maskSensitiveData, 
  hasSecurityRisks,
  RateLimiter 
} from './security';
