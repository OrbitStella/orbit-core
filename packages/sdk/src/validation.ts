/**
 * Contract method validation utilities
 */

import type { ContractSpec, ContractFunction, FunctionArg } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MethodCall {
  method: string;
  args: any[];
}

export function validateMethodCall(
  methodCall: MethodCall,
  contractSpec: ContractSpec
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find the method in the spec
  const method = contractSpec.functions.find(f => f.name === methodCall.method);
  
  if (!method) {
    errors.push(`Method '${methodCall.method}' not found in contract spec`);
    return { valid: false, errors, warnings };
  }

  // Validate argument count
  if (methodCall.args.length !== method.inputs.length) {
    errors.push(
      `Argument count mismatch: expected ${method.inputs.length}, got ${methodCall.args.length}`
    );
  }

  // Validate argument types
  methodCall.args.forEach((arg, index) => {
    if (index >= method.inputs.length) return;
    
    const expectedType = method.inputs[index]?.type;
    const actualType = typeof arg;
    
    if (expectedType && !isTypeCompatible(actualType, expectedType)) {
      errors.push(
        `Argument ${index} type mismatch: expected ${expectedType}, got ${actualType}`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function isTypeCompatible(actual: string, expected: string): boolean {
  const typeMap: Record<string, string[]> = {
    'string': ['string'],
    'number': ['number'],
    'boolean': ['boolean'],
    'u64': ['number', 'string'],
    'i64': ['number', 'string'],
    'u32': ['number', 'string'],
    'i32': ['number', 'string'],
    'address': ['string'],
    'bytes': ['string', 'object'],
    'vec': ['array', 'object'],
    'map': ['object'],
    'option': ['object', 'null']
  };

  const compatibleTypes = typeMap[expected] || [expected];
  return compatibleTypes.includes(actual);
}

export function validateContractSpec(spec: ContractSpec): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!spec.functions || spec.functions.length === 0) {
    warnings.push('Contract spec has no functions defined');
  }

  spec.functions.forEach(func => {
    if (!func.name) {
      errors.push('Function has no name');
    }
    
    if (!func.inputs) {
      warnings.push(`Function '${func.name}' has no input parameters defined`);
    }
    
    if (!func.outputs) {
      warnings.push(`Function '${func.name}' has no output parameters defined`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
