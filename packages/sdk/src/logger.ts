/**
 * Logger utility for Orbit SDK
 * Provides structured logging with different levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = LogLevel[entry.level];
    const message = entry.message;
    
    let formatted = `[${timestamp}] ${level}: ${message}`;
    
    if (entry.context) {
      formatted += ` | Context: ${JSON.stringify(entry.context)}`;
    }
    
    if (entry.error) {
      formatted += ` | Error: ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\nStack: ${entry.error.stack}`;
      }
    }
    
    return formatted;
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error
    };

    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    const formatted = this.formatMessage(entry);
    
    // Output to console with appropriate method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.addLog(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.addLog(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.addLog(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.addLog(LogLevel.ERROR, message, context, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  // Convenience methods for common operations
  logOperation(operation: string, context?: Record<string, any>): void {
    this.info(`Starting operation: ${operation}`, context);
  }

  logSuccess(operation: string, context?: Record<string, any>): void {
    this.info(`Operation completed successfully: ${operation}`, context);
  }

  logFailure(operation: string, error: Error, context?: Record<string, any>): void {
    this.error(`Operation failed: ${operation}`, error, context);
  }

  logTransaction(transactionId: string, operation: string, context?: Record<string, any>): void {
    this.info(`Transaction ${transactionId}: ${operation}`, {
      transactionId,
      operation,
      ...context
    });
  }

  logContract(contractId: string, operation: string, context?: Record<string, any>): void {
    this.info(`Contract ${contractId}: ${operation}`, {
      contractId,
      operation,
      ...context
    });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience functions
export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, any>) => logger.error(message, error, context),
  operation: (operation: string, context?: Record<string, any>) => logger.logOperation(operation, context),
  success: (operation: string, context?: Record<string, any>) => logger.logSuccess(operation, context),
  failure: (operation: string, error: Error, context?: Record<string, any>) => logger.logFailure(operation, error, context),
  transaction: (transactionId: string, operation: string, context?: Record<string, any>) => logger.logTransaction(transactionId, operation, context),
  contract: (contractId: string, operation: string, context?: Record<string, any>) => logger.logContract(contractId, operation, context)
};
