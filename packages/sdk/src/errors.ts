/**
 * Custom error classes for Orbit SDK
 * Provides structured error handling with error codes and context
 */

export enum ErrorCode {
  // Network errors
  NETWORK_CONNECTION_FAILED = 'NETWORK_CONNECTION_FAILED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE',
  
  // Account errors
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  ACCOUNT_INSUFFICIENT_BALANCE = 'ACCOUNT_INSUFFICIENT_BALANCE',
  ACCOUNT_INVALID_PUBLIC_KEY = 'ACCOUNT_INVALID_PUBLIC_KEY',
  
  // Contract errors
  CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',
  CONTRACT_DEPLOYMENT_FAILED = 'CONTRACT_DEPLOYMENT_FAILED',
  CONTRACT_INVOCATION_FAILED = 'CONTRACT_INVOCATION_FAILED',
  CONTRACT_NOT_INITIALIZED = 'CONTRACT_NOT_INITIALIZED',
  CONTRACT_INVALID_DATA = 'CONTRACT_INVALID_DATA',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  TRANSACTION_INVALID = 'TRANSACTION_INVALID',
  
  // Configuration errors
  CONFIG_INVALID_NETWORK = 'CONFIG_INVALID_NETWORK',
  CONFIG_MISSING_RPC_URL = 'CONFIG_MISSING_RPC_URL',
  CONFIG_MISSING_NETWORK_PASSPHRASE = 'CONFIG_MISSING_NETWORK_PASSPHRASE',
  
  // Validation errors
  VALIDATION_INVALID_CONTRACT_ID = 'VALIDATION_INVALID_CONTRACT_ID',
  VALIDATION_INVALID_PUBLIC_KEY = 'VALIDATION_INVALID_PUBLIC_KEY',
  VALIDATION_INVALID_SECRET_KEY = 'VALIDATION_INVALID_SECRET_KEY',
  VALIDATION_INVALID_ARGUMENTS = 'VALIDATION_INVALID_ARGUMENTS',
  
  // File system errors
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface ErrorContext {
  [key: string]: any;
}

export class OrbitError extends Error {
  public readonly code: ErrorCode;
  public readonly context?: ErrorContext;
  public readonly cause?: Error;
  public readonly timestamp: string;

  constructor(
    code: ErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message);
    
    this.name = 'OrbitError';
    this.code = code;
    this.context = context;
    this.cause = cause;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrbitError);
    }
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack
      } : undefined
    };
  }

  toString(): string {
    let str = `${this.name} [${this.code}]: ${this.message}`;
    
    if (this.context && Object.keys(this.context).length > 0) {
      str += `\nContext: ${JSON.stringify(this.context, null, 2)}`;
    }
    
    if (this.cause) {
      str += `\nCaused by: ${this.cause.message}`;
    }
    
    return str;
  }
}

// Network-related errors
export class NetworkError extends OrbitError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext, cause?: Error) {
    super(code, message, context, cause);
    this.name = 'NetworkError';
  }
}

export class AccountError extends OrbitError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext, cause?: Error) {
    super(code, message, context, cause);
    this.name = 'AccountError';
  }
}

export class ContractError extends OrbitError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext, cause?: Error) {
    super(code, message, context, cause);
    this.name = 'ContractError';
  }
}

export class TransactionError extends OrbitError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext, cause?: Error) {
    super(code, message, context, cause);
    this.name = 'TransactionError';
  }
}

export class ValidationError extends OrbitError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext, cause?: Error) {
    super(code, message, context, cause);
    this.name = 'ValidationError';
  }
}

export class FileError extends OrbitError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext, cause?: Error) {
    super(code, message, context, cause);
    this.name = 'FileError';
  }
}

// Error factory functions for common scenarios
export const createNetworkError = (
  message: string,
  context?: ErrorContext,
  cause?: Error
): NetworkError => {
  return new NetworkError(
    ErrorCode.NETWORK_CONNECTION_FAILED,
    message,
    context,
    cause
  );
};

export const createAccountError = (
  message: string,
  context?: ErrorContext,
  cause?: Error
): AccountError => {
  return new AccountError(
    ErrorCode.ACCOUNT_NOT_FOUND,
    message,
    context,
    cause
  );
};

export const createContractError = (
  message: string,
  context?: ErrorContext,
  cause?: Error
): ContractError => {
  return new ContractError(
    ErrorCode.CONTRACT_INVOCATION_FAILED,
    message,
    context,
    cause
  );
};

export const createTransactionError = (
  message: string,
  context?: ErrorContext,
  cause?: Error
): TransactionError => {
  return new TransactionError(
    ErrorCode.TRANSACTION_FAILED,
    message,
    context,
    cause
  );
};

export const createValidationError = (
  message: string,
  context?: ErrorContext,
  cause?: Error
): ValidationError => {
  return new ValidationError(
    ErrorCode.VALIDATION_INVALID_ARGUMENTS,
    message,
    context,
    cause
  );
};

export const createFileError = (
  message: string,
  context?: ErrorContext,
  cause?: Error
): FileError => {
  return new FileError(
    ErrorCode.FILE_NOT_FOUND,
    message,
    context,
    cause
  );
};

// Error handling utilities
export const isOrbitError = (error: any): error is OrbitError => {
  return error instanceof OrbitError;
};

export const getErrorCode = (error: any): ErrorCode => {
  if (isOrbitError(error)) {
    return error.code;
  }
  return ErrorCode.UNKNOWN_ERROR;
};

export const getErrorContext = (error: any): ErrorContext | undefined => {
  if (isOrbitError(error)) {
    return error.context;
  }
  return undefined;
};

export const formatErrorForUser = (error: any): string => {
  if (isOrbitError(error)) {
    return `${error.message}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
};

// Error recovery suggestions
export const getErrorSuggestion = (error: any): string => {
  if (!isOrbitError(error)) {
    return 'Please check the error details and try again.';
  }

  switch (error.code) {
    case ErrorCode.NETWORK_CONNECTION_FAILED:
      return 'Please check your internet connection and try again.';
    
    case ErrorCode.NETWORK_TIMEOUT:
      return 'The request timed out. Please try again.';
    
    case ErrorCode.ACCOUNT_NOT_FOUND:
      return 'Please verify the account public key is correct.';
    
    case ErrorCode.ACCOUNT_INSUFFICIENT_BALANCE:
      return 'Please ensure the account has sufficient balance for the transaction.';
    
    case ErrorCode.CONTRACT_NOT_FOUND:
      return 'Please verify the contract ID is correct.';
    
    case ErrorCode.CONTRACT_DEPLOYMENT_FAILED:
      return 'Please check the contract code and try again.';
    
    case ErrorCode.CONTRACT_INVOCATION_FAILED:
      return 'Please check the method name and arguments, then try again.';
    
    case ErrorCode.TRANSACTION_FAILED:
      return 'Please check the transaction details and try again.';
    
    case ErrorCode.VALIDATION_INVALID_CONTRACT_ID:
      return 'Please provide a valid contract ID.';
    
    case ErrorCode.VALIDATION_INVALID_PUBLIC_KEY:
      return 'Please provide a valid Stellar public key.';
    
    case ErrorCode.FILE_NOT_FOUND:
      return 'Please check the file path and ensure the file exists.';
    
    default:
      return 'Please check the error details and try again.';
  }
};
