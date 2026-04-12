import { 
  Horizon, 
  Server, 
  TransactionBuilder, 
  Networks,
  Keypair,
  Asset,
  Contract,
  BASE_FEE,
  Networks as StellarNetworks
} from '@stellar/stellar-sdk';
import { 
  Server as SorobanRpcServer, 
  xdr, 
  Address,
  nativeToScVal,
  scValToNative
} from '@stellar/stellar-sdk';

import { logger } from './logger';
import { 
  OrbitError, 
  ErrorCode, 
  createNetworkError, 
  createContractError, 
  createTransactionError, 
  createValidationError 
} from './errors';

export interface OrbitClientConfig {
  networkUrl: string;
  networkPassphrase: string;
  rpcUrl: string;
  contractId?: string;
}

export class OrbitClient {
  private horizonServer: Server;
  private rpcServer: SorobanRpcServer;
  private networkPassphrase: string;
  private contractId?: string;

  constructor(config: OrbitClientConfig) {
    // Validate configuration
    this.validateConfig(config);
    
    logger.info('Creating OrbitClient', {
      networkUrl: config.networkUrl,
      rpcUrl: config.rpcUrl,
      networkPassphrase: config.networkPassphrase,
      contractId: config.contractId
    });

    try {
      this.horizonServer = new Server(config.networkUrl);
      this.rpcServer = new SorobanRpcServer(config.rpcUrl);
      this.networkPassphrase = config.networkPassphrase;
      this.contractId = config.contractId;
      
      logger.success('OrbitClient created successfully');
    } catch (error) {
      const orbitError = createNetworkError(
        'Failed to initialize OrbitClient',
        { networkUrl: config.networkUrl, rpcUrl: config.rpcUrl },
        error as Error
      );
      logger.failure('OrbitClient creation', orbitError);
      throw orbitError;
    }
  }

  private validateConfig(config: OrbitClientConfig): void {
    if (!config.networkUrl) {
      throw createValidationError(
        'Network URL is required',
        { config }
      );
    }

    if (!config.rpcUrl) {
      throw createValidationError(
        'RPC URL is required',
        { config }
      );
    }

    if (!config.networkPassphrase) {
      throw createValidationError(
        'Network passphrase is required',
        { config }
      );
    }

    // Validate URL format
    try {
      new URL(config.networkUrl);
      new URL(config.rpcUrl);
    } catch (error) {
      throw createValidationError(
        'Invalid URL format',
        { networkUrl: config.networkUrl, rpcUrl: config.rpcUrl },
        error as Error
      );
    }
  }

  /**
   * Deploy a Soroban contract
   */
  async deployContract(
    wasmCode: Buffer,
    signerKeypair: Keypair,
    options: {
      salt?: string;
      auth?: boolean;
    } = {}
  ): Promise<{ contractId: string; transactionId: string }> {
    const publicKey = signerKeypair.publicKey();
    
    logger.operation('Contract deployment', {
      publicKey: publicKey,
      wasmSize: wasmCode.length,
      options
    });

    try {
      // Load account
      logger.debug('Loading account for deployment', { publicKey });
      const account = await this.horizonServer.loadAccount(publicKey);
      
      // Create contract deployment transaction
      logger.debug('Creating deployment transaction');
      const contract = new Contract(wasmCode);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.deploy({
            salt: options.salt ? nativeToScVal(options.salt) : undefined,
            auth: options.auth
          })
        )
        .setTimeout(30)
        .build();

      // Sign transaction
      logger.debug('Signing transaction');
      transaction.sign(signerKeypair);
      
      // Submit transaction
      logger.debug('Submitting deployment transaction');
      const result = await this.horizonServer.submitTransaction(transaction);
      
      if (result.successful) {
        // Extract contract ID from result
        logger.debug('Extracting contract ID from transaction result');
        const contractResult = result.operationResults[0];
        const contractId = Contract.fromLedgerEntryXdr(contractResult.valueXdr)
          .contractId()
          .toString();
        
        const deploymentResult = {
          contractId,
          transactionId: result.hash
        };

        logger.success('Contract deployment completed', deploymentResult);
        logger.transaction(result.hash, 'Contract deployed', { contractId });
        
        return deploymentResult;
      }
      
      // Handle failed deployment
      const error = new Error(`Deployment failed: ${result.resultMetaXdr}`);
      logger.failure('Contract deployment', error as Error, {
        transactionId: result.hash,
        resultMetaXdr: result.resultMetaXdr
      });
      
      throw createContractError(
        'Contract deployment failed',
        {
          transactionId: result.hash,
          resultMetaXdr: result.resultMetaXdr
        },
        error
      );
    } catch (error) {
      if (error instanceof OrbitError) {
        throw error;
      }
      
      const orbitError = createContractError(
        'Failed to deploy contract',
        {
          publicKey,
          wasmSize: wasmCode.length,
          options
        },
        error as Error
      );
      
      logger.failure('Contract deployment', orbitError);
      throw orbitError;
    }
  }

  /**
   * Invoke a contract method
   */
  async invokeContract(
    method: string,
    args: any[] = [],
    signerKeypair?: Keypair,
    contractId?: string
  ): Promise<{ result: any; transactionId: string }> {
    try {
      const targetContractId = contractId || this.contractId;
      if (!targetContractId) {
        throw new Error('No contract ID provided');
      }

      const account = await this.horizonServer.loadAccount(
        signerKeypair?.publicKey() || await this.getDefaultAccount()
      );

      // Convert arguments to ScVal
      const scArgs = args.map(arg => nativeToScVal(arg));

      const contract = new Contract(targetContractId);
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(contract.call(method, ...scArgs))
        .setTimeout(30)
        .build();

      if (signerKeypair) {
        transaction.sign(signerKeypair);
      }

      const result = await this.horizonServer.submitTransaction(transaction);
      
      if (result.successful) {
        // Wait for transaction to be included in ledger
        const invokeResult = await this.rpcServer.getTransaction(result.hash);
        if (invokeResult.status === 'SUCCESS') {
          const returnValue = invokeResult.resultMeta?.XDR || invokeResult.result?.returnValue;
          const nativeResult = returnValue ? scValToNative(returnValue) : null;
          
          return {
            result: nativeResult,
            transactionId: result.hash
          };
        } else {
          throw new Error(`Transaction failed: ${invokeResult.status}`);
        }
      }
      
      throw new Error(`Invocation failed: ${result.resultMetaXdr}`);
    } catch (error) {
      throw new Error(`Failed to invoke contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account information
   */
  async getAccount(publicKey: string): Promise<Horizon.AccountResponse> {
    try {
      const account = await this.horizonServer.loadAccount(publicKey);
      return account;
    } catch (error) {
      throw new Error(`Failed to get account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get contract data
   */
  async getContractData(
    key: string,
    contractId?: string
  ): Promise<any | null> {
    try {
      const targetContractId = contractId || this.contractId;
      if (!targetContractId) {
        throw new Error('No contract ID provided');
      }

      const contract = new Contract(targetContractId);
      const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
          contract: contract.address().toScAddress(),
          key: nativeToScVal(key),
          durability: xdr.ContractDataDurability.persistent()
        })
      );

      const result = await this.rpcServer.getLedgerEntries(ledgerKey);
      
      if (result.entries.length > 0) {
        return scValToNative(result.entries[0].val);
      }
      
      return null;
    } catch (error) {
      throw new Error(`Failed to get contract data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Connect to Stellar testnet
   */
  static connectToTestnet(): OrbitClient {
    return new OrbitClient({
      networkUrl: 'https://horizon-testnet.stellar.org',
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: StellarNetworks.TESTNET
    });
  }

  /**
   * Connect to Stellar futurenet
   */
  static connectToFuturenet(): OrbitClient {
    return new OrbitClient({
      networkUrl: 'https://horizon-futurenet.stellar.org',
      rpcUrl: 'https://rpc-futurenet.stellar.org',
      networkPassphrase: StellarNetworks.FUTURENET
    });
  }

  /**
   * Connect to Stellar mainnet
   */
  static connectToMainnet(): OrbitClient {
    return new OrbitClient({
      networkUrl: 'https://horizon.stellar.org',
      rpcUrl: 'https://soroban.stellar.org',
      networkPassphrase: StellarNetworks.PUBLIC
    });
  }

  private async getDefaultAccount(): Promise<string> {
    // In a real implementation, this would get the default account from wallet
    throw new Error('No signer provided and no default account available');
  }

  /**
   * Set the active contract ID
   */
  setContractId(contractId: string): void {
    this.contractId = contractId;
  }

  /**
   * Get the current contract ID
   */
  getContractId(): string | undefined {
    return this.contractId;
  }
}

// Factory function to create a client
export function createOrbitClient(config: OrbitClientConfig): OrbitClient {
  return new OrbitClient(config);
}

// Network presets
export const NETWORKS = {
  FUTURENET: {
    networkUrl: 'https://horizon-futurenet.stellar.org',
    networkPassphrase: StellarNetworks.FUTURENET,
    rpcUrl: 'https://rpc-futurenet.stellar.org'
  },
  TESTNET: {
    networkUrl: 'https://horizon-testnet.stellar.org',
    networkPassphrase: StellarNetworks.TESTNET,
    rpcUrl: 'https://soroban-testnet.stellar.org'
  },
  MAINNET: {
    networkUrl: 'https://horizon.stellar.org',
    networkPassphrase: StellarNetworks.PUBLIC,
    rpcUrl: 'https://soroban.stellar.org'
  }
} as const;

// Export logger and errors for advanced usage
export { logger, log, LogLevel } from './logger';
export { 
  OrbitError, 
  ErrorCode, 
  NetworkError, 
  AccountError, 
  ContractError, 
  TransactionError, 
  ValidationError, 
  FileError,
  createNetworkError,
  createAccountError,
  createContractError,
  createTransactionError,
  createValidationError,
  createFileError,
  isOrbitError,
  getErrorCode,
  getErrorContext,
  formatErrorForUser,
  getErrorSuggestion
} from './errors';
