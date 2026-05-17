/**
 * Transaction fee estimation utilities
 */

import { BASE_FEE } from '@stellar/stellar-sdk';

export interface FeeEstimate {
  baseFee: number;
  operations: number;
  estimatedFee: number;
  recommendedFee: number;
}

export function estimateTransactionFee(
  operationCount: number,
  baseFee: number = BASE_FEE,
  multiplier: number = 1.5
): FeeEstimate {
  const estimatedFee = operationCount * baseFee;
  const recommendedFee = Math.ceil(estimatedFee * multiplier);

  return {
    baseFee,
    operations: operationCount,
    estimatedFee,
    recommendedFee
  };
}

export function calculateOptimalFee(
  currentNetworkFee: number,
  operationCount: number,
  priority: 'low' | 'medium' | 'high' = 'medium'
): number {
  const multipliers = {
    low: 1.0,
    medium: 1.5,
    high: 2.0
  };

  const baseFee = operationCount * currentNetworkFee;
  return Math.ceil(baseFee * multipliers[priority]);
}

export function validateFee(fee: number, minFee: number = 100): boolean {
  return fee >= minFee && fee <= 1000000; // Max fee cap
}
