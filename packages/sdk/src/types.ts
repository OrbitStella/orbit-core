/**
 * TypeScript types for Soroban contract interfaces
 */

export interface SorobanContract {
  contractId: string;
  wasmHash?: string;
  spec?: ContractSpec;
}

export interface ContractSpec {
  functions: ContractFunction[];
  structs?: ContractStruct[];
  enums?: ContractEnum[];
}

export interface ContractFunction {
  name: string;
  inputs: FunctionArg[];
  outputs: FunctionArg[];
}

export interface FunctionArg {
  name: string;
  type: string;
  doc?: string;
}

export interface ContractStruct {
  name: string;
  fields: StructField[];
}

export interface StructField {
  name: string;
  type: string;
  doc?: string;
}

export interface ContractEnum {
  name: string;
  values: EnumValue[];
}

export interface EnumValue {
  name: string;
  value?: number;
  doc?: string;
}

export interface ContractInvocation {
  contractId: string;
  method: string;
  args: any[];
  signer?: string;
}

export interface ContractDeployment {
  wasmCode: Buffer;
  signer: string;
  salt?: string;
  auth?: boolean;
}

export interface ContractState {
  key: string;
  value: any;
  durability: 'persistent' | 'temporary' | 'ephemeral';
}

export interface TransactionResult {
  hash: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  result?: any;
  error?: string;
  fee: number;
}

export interface NetworkConfig {
  networkUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  friendbotUrl?: string;
}
