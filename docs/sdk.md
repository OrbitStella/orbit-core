# Orbit SDK Documentation

The Orbit SDK is a TypeScript library that provides a comprehensive interface for interacting with Stellar and Soroban networks.

## Quick Start

### Installation

```bash
pnpm add @orbit-core/sdk
```

### Basic Usage

```typescript
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk';

// Create client for testnet
const client = createOrbitClient({
  networkUrl: NETWORKS.TESTNET.networkUrl,
  rpcUrl: NETWORKS.TESTNET.rpcUrl,
  networkPassphrase: NETWORKS.TESTNET.networkPassphrase
});

// Deploy contract
const result = await client.deployContract(wasmCode, keypair);
console.log('Contract deployed:', result.contractId);

// Invoke contract method
const invokeResult = await client.invokeContract('increment', [], keypair);
console.log('Transaction ID:', invokeResult.transactionId);
```

## Core Concepts

### OrbitClient

The main class for all Stellar/Soroban operations.

```typescript
class OrbitClient {
  constructor(config: OrbitClientConfig)
  
  // Contract operations
  async deployContract(wasmCode: Buffer, signerKeypair: Keypair, options?: DeployOptions): Promise<DeployResult>
  async invokeContract(method: string, args: any[], signerKeypair?: Keypair, contractId?: string): Promise<InvokeResult>
  async getContractData(key: string, contractId?: string): Promise<any>
  
  // Account operations
  async getAccount(publicKey: string): Promise<Horizon.AccountResponse>
  
  // Utility methods
  setContractId(contractId: string): void
  getContractId(): string | undefined
}
```

### Configuration

```typescript
interface OrbitClientConfig {
  networkUrl: string;        // Horizon server URL
  rpcUrl: string;           // Soroban RPC server URL
  networkPassphrase: string; // Network passphrase
  contractId?: string;      // Optional default contract ID
}
```

### Network Presets

```typescript
import { NETWORKS } from '@orbit-core/sdk';

// Available networks
NETWORKS.TESTNET    // Testnet configuration
NETWORKS.FUTURENET  // Futurenet configuration
NETWORKS.MAINNET    // Mainnet configuration
```

## API Reference

### Static Methods

#### connectToTestnet()
```typescript
static connectToTestnet(): OrbitClient
```
Creates a pre-configured client for Stellar testnet.

```typescript
const client = OrbitClient.connectToTestnet();
```

#### connectToFuturenet()
```typescript
static connectToFuturenet(): OrbitClient
```
Creates a pre-configured client for Stellar futurenet.

#### connectToMainnet()
```typescript
static connectToMainnet(): OrbitClient
```
Creates a pre-configured client for Stellar mainnet.

### Contract Operations

#### deployContract()

Deploys a Soroban contract to the network.

```typescript
async deployContract(
  wasmCode: Buffer,
  signerKeypair: Keypair,
  options?: {
    salt?: string;
    auth?: boolean;
  }
): Promise<{
  contractId: string;
  transactionId: string;
}>
```

**Parameters:**
- `wasmCode`: Compiled WASM contract code
- `signerKeypair`: Keypair for signing the deployment transaction
- `options.salt`: Optional salt for contract address derivation
- `options.auth`: Whether to enable contract authorization

**Returns:**
- `contractId`: Deployed contract ID
- `transactionId`: Deployment transaction ID

**Example:**
```typescript
import fs from 'fs/promises';
import { Keypair } from '@stellar/stellar-sdk';

const wasmCode = await fs.readFile('contract.wasm');
const keypair = Keypair.fromSecret('your-secret-key');

const result = await client.deployContract(wasmCode, keypair, {
  salt: 'my-contract-salt',
  auth: true
});

console.log('Contract ID:', result.contractId);
console.log('Transaction ID:', result.transactionId);
```

#### invokeContract()

Invokes a method on a deployed contract.

```typescript
async invokeContract(
  method: string,
  args: any[] = [],
  signerKeypair?: Keypair,
  contractId?: string
): Promise<{
  result: any;
  transactionId: string;
}>
```

**Parameters:**
- `method`: Contract method name to invoke
- `args`: Arguments to pass to the method (automatically converted)
- `signerKeypair`: Optional keypair for signing (required for write operations)
- `contractId`: Contract ID (uses default if not provided)

**Returns:**
- `result`: Method return value (automatically converted from Soroban types)
- `transactionId`: Invocation transaction ID

**Example:**
```typescript
// Read-only method (no signer needed)
const result = await client.invokeContract('get_counter');

// Write method (requires signer)
const result = await client.invokeContract('increment', [], keypair);
console.log('New counter value:', result.result);

// Method with arguments
const result = await client.invokeContract('set_value', [42], keypair);
```

#### getContractData()

Retrieves data stored in a contract.

```typescript
async getContractData(
  key: string,
  contractId?: string
): Promise<any>
```

**Parameters:**
- `key`: Storage key to retrieve
- `contractId`: Contract ID (uses default if not provided)

**Returns:**
- Data value (automatically converted from Soroban types)

**Example:**
```typescript
const value = await client.getContractData('COUNTER');
console.log('Counter value:', value);
```

### Account Operations

#### getAccount()

Retrieves account information from Horizon.

```typescript
async getAccount(publicKey: string): Promise<Horizon.AccountResponse>
```

**Parameters:**
- `publicKey`: Stellar public key

**Returns:**
- Account response with balance, sequence, and other details

**Example:**
```typescript
const account = await client.getAccount('GABC...XYZ');
console.log('Account ID:', account.accountId());
console.log('Balance:', account.balances);
console.log('Sequence:', account.sequenceNumber());
```

## Error Handling

The SDK provides structured error handling with specific error types:

### Error Types

```typescript
import { 
  OrbitError, 
  NetworkError, 
  ContractError, 
  TransactionError,
  ValidationError 
} from '@orbit-core/sdk';
```

### Error Codes

```typescript
enum ErrorCode {
  // Network errors
  NETWORK_CONNECTION_FAILED = 'NETWORK_CONNECTION_FAILED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  
  // Contract errors
  CONTRACT_DEPLOYMENT_FAILED = 'CONTRACT_DEPLOYMENT_FAILED',
  CONTRACT_INVOCATION_FAILED = 'CONTRACT_INVOCATION_FAILED',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  
  // Validation errors
  VALIDATION_INVALID_CONTRACT_ID = 'VALIDATION_INVALID_CONTRACT_ID',
  VALIDATION_INVALID_PUBLIC_KEY = 'VALIDATION_INVALID_PUBLIC_KEY'
}
```

### Error Handling Example

```typescript
import { 
  isOrbitError, 
  getErrorCode, 
  getErrorSuggestion 
} from '@orbit-core/sdk';

try {
  await client.deployContract(wasmCode, keypair);
} catch (error) {
  if (isOrbitError(error)) {
    console.error('Error code:', getErrorCode(error));
    console.error('Suggestion:', getErrorSuggestion(error));
    console.error('Context:', error.context);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Logging

The SDK includes a comprehensive logging system:

### Basic Usage

```typescript
import { logger, log } from '@orbit-core/sdk';

// Set log level
logger.setLogLevel(LogLevel.INFO);

// Use convenience functions
log.info('Starting operation');
log.error('Operation failed', error, { context: 'data' });
```

### Log Levels

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}
```

### Specialized Logging

```typescript
// Operation logging
log.operation('Contract deployment', { wasmSize: 1024 });
log.success('Contract deployment', { contractId: '...' });
log.failure('Contract deployment', error);

// Transaction logging
log.transaction('tx-123', 'Contract deployed', { contractId: '...' });

// Contract logging
log.contract('contract-456', 'Method invoked', { method: 'increment' });
```

## Advanced Usage

### Custom Configuration

```typescript
const client = new OrbitClient({
  networkUrl: 'https://horizon-testnet.stellar.org',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  contractId: 'your-contract-id'
});
```

### Working with Multiple Contracts

```typescript
// Set default contract
client.setContractId('contract-1');
await client.invokeContract('method1');

// Override for specific call
await client.invokeContract('method2', [], undefined, 'contract-2');
```

### Type Conversion

The SDK automatically converts between JavaScript and Soroban types:

```typescript
// JavaScript types automatically converted
await client.invokeContract('set_values', [
  'string-value',    // -> ScVal.string
  42,                // -> ScVal.i32
  true,              // -> ScVal.bool
  [1, 2, 3],         // -> ScVal.array
  { key: 'value' }   // -> ScVal.map
]);
```

### Batch Operations

```typescript
// Multiple invocations
const results = await Promise.all([
  client.invokeContract('increment'),
  client.invokeContract('increment'),
  client.invokeContract('get_counter')
]);
```

## Best Practices

### 1. Error Handling

Always handle errors properly:

```typescript
try {
  const result = await client.invokeContract('method', args, keypair);
  return result;
} catch (error) {
  if (isOrbitError(error)) {
    // Handle structured error
    throw new Error(`Contract operation failed: ${getErrorSuggestion(error)}`);
  }
  throw error;
}
```

### 2. Resource Management

Reuse clients when possible:

```typescript
// Good: Reuse client
const client = createOrbitClient(config);
await client.invokeContract('method1');
await client.invokeContract('method2');

// Avoid: Creating multiple clients
const client1 = createOrbitClient(config);
const client2 = createOrbitClient(config);
```

### 3. Logging

Use appropriate log levels:

```typescript
// Development
log.debug('Detailed debugging info');

// Production
log.info('Operation started');
log.error('Operation failed', error);
```

### 4. Type Safety

Use TypeScript properly:

```typescript
// Good: Type the result
const result: { result: number; transactionId: string } = 
  await client.invokeContract('get_counter');

// Good: Validate inputs
if (!publicKey.match(/^G[0-9A-Z]{55}$/)) {
  throw new ValidationError('Invalid public key format');
}
```

## Troubleshooting

### Common Issues

1. **Network Connection Failed**
   - Check network connectivity
   - Verify RPC URL is accessible
   - Check firewall settings

2. **Contract Not Found**
   - Verify contract ID is correct
   - Check contract is deployed on the correct network
   - Ensure contract is initialized

3. **Transaction Failed**
   - Check account has sufficient balance
   - Verify transaction parameters
   - Check network status

4. **Invalid Arguments**
   - Ensure arguments match contract method signature
   - Check type conversions
   - Verify argument order

### Debug Mode

Enable debug logging:

```typescript
logger.setLogLevel(LogLevel.DEBUG);
```

### Getting Help

- Check the error context and suggestions
- Review the logs for detailed information
- Consult the Stellar and Soroban documentation
- Join the community Discord for help

## Examples

### Complete Contract Deployment

```typescript
import { createOrbitClient, NETWORKS } from '@orbit-core/sdk';
import { Keypair } from '@stellar/stellar-sdk';
import fs from 'fs/promises';

async function deployContract() {
  // Create client
  const client = createOrbitClient({
    networkUrl: NETWORKS.TESTNET.networkUrl,
    rpcUrl: NETWORKS.TESTNET.rpcUrl,
    networkPassphrase: NETWORKS.TESTNET.networkPassphrase
  });

  // Load contract code
  const wasmCode = await fs.readFile('contract.wasm');
  
  // Create keypair
  const keypair = Keypair.fromSecret('your-secret-key');
  
  try {
    // Deploy contract
    const result = await client.deployContract(wasmCode, keypair, {
      salt: 'my-contract-salt'
    });
    
    console.log('Contract deployed successfully!');
    console.log('Contract ID:', result.contractId);
    console.log('Transaction ID:', result.transactionId);
    
    // Set as default contract
    client.setContractId(result.contractId);
    
    // Initialize contract
    const initResult = await client.invokeContract(
      'initialize', 
      [keypair.publicKey()], 
      keypair
    );
    
    console.log('Contract initialized');
    
    return result.contractId;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}
```

### Contract Interaction

```typescript
async function interactWithContract(contractId: string) {
  const client = OrbitClient.connectToTestnet();
  client.setContractId(contractId);
  
  try {
    // Get current value
    const getResult = await client.invokeContract('get_counter');
    console.log('Current counter:', getResult.result);
    
    // Increment counter
    const incrementResult = await client.invokeContract('increment', [], keypair);
    console.log('Incremented, transaction:', incrementResult.transactionId);
    
    // Get new value
    const newResult = await client.invokeContract('get_counter');
    console.log('New counter:', newResult.result);
    
  } catch (error) {
    console.error('Interaction failed:', error);
    throw error;
  }
}
```

This documentation provides a comprehensive guide to using the Orbit SDK. For more examples and advanced usage, see the project examples and test files.
