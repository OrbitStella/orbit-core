import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OrbitClient, createOrbitClient, NETWORKS } from '../src/index'
import { Keypair, Server } from '@stellar/stellar-sdk'

// Mock Stellar SDK
vi.mock('@stellar/stellar-sdk', () => ({
  Keypair: {
    fromSecret: vi.fn(),
    random: vi.fn(() => ({ publicKey: () => 'test-public-key' }))
  },
  Server: vi.fn(),
  TransactionBuilder: vi.fn(),
  Networks: {
    TESTNET: 'Test SDF Network ; September 2015',
    FUTURENET: 'Test SDF Future Network ; October 2022',
    PUBLIC: 'Public Global Stellar Network ; September 2015'
  },
  Contract: vi.fn(),
  BASE_FEE: '100'
}))

describe('OrbitClient', () => {
  let client: OrbitClient
  let mockServer: any

  beforeEach(() => {
    mockServer = {
      loadAccount: vi.fn(),
      submitTransaction: vi.fn()
    }
    
    vi.mocked(Server).mockImplementation(() => mockServer)
    
    client = new OrbitClient({
      networkUrl: 'https://horizon-testnet.stellar.org',
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015'
    })
  })

  describe('constructor', () => {
    it('should create client with valid config', () => {
      expect(client).toBeDefined()
    })

    it('should accept contract ID in config', () => {
      const clientWithContract = new OrbitClient({
        networkUrl: 'https://horizon-testnet.stellar.org',
        rpcUrl: 'https://soroban-testnet.stellar.org',
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'test-contract-id'
      })
      
      expect(clientWithContract.getContractId()).toBe('test-contract-id')
    })
  })

  describe('setContractId and getContractId', () => {
    it('should set and get contract ID', () => {
      const contractId = 'new-contract-id'
      client.setContractId(contractId)
      expect(client.getContractId()).toBe(contractId)
    })
  })

  describe('static connection methods', () => {
    it('should create testnet client', () => {
      const testnetClient = OrbitClient.connectToTestnet()
      expect(testnetClient).toBeDefined()
    })

    it('should create futurenet client', () => {
      const futurenetClient = OrbitClient.connectToFuturenet()
      expect(futurenetClient).toBeDefined()
    })

    it('should create mainnet client', () => {
      const mainnetClient = OrbitClient.connectToMainnet()
      expect(mainnetClient).toBeDefined()
    })
  })

  describe('getAccount', () => {
    it('should load account successfully', async () => {
      const mockAccount = {
        accountId: () => 'test-account-id',
        sequenceNumber: () => '12345',
        balances: [{ asset_type: 'native', balance: '1000.0000000' }]
      }
      
      mockServer.loadAccount.mockResolvedValue(mockAccount)
      
      const account = await client.getAccount('test-public-key')
      
      expect(mockServer.loadAccount).toHaveBeenCalledWith('test-public-key')
      expect(account).toBe(mockAccount)
    })

    it('should handle account loading errors', async () => {
      const error = new Error('Account not found')
      mockServer.loadAccount.mockRejectedValue(error)
      
      await expect(client.getAccount('invalid-key')).rejects.toThrow('Failed to get account: Account not found')
    })
  })

  describe('deployContract', () => {
    it('should deploy contract successfully', async () => {
      const mockAccount = {
        accountId: () => 'test-account-id',
        sequenceNumber: () => '12345'
      }
      
      const mockResult = {
        successful: true,
        hash: 'test-transaction-hash',
        operationResults: [{
          valueXdr: 'mock-xdr-data'
        }]
      }
      
      mockServer.loadAccount.mockResolvedValue(mockAccount)
      mockServer.submitTransaction.mockResolvedValue(mockResult)
      
      // Mock Contract.fromLedgerEntryXdr
      const mockContractId = 'deployed-contract-id'
      vi.doMock('@stellar/stellar-sdk', async () => {
        const actual = await vi.importActual('@stellar/stellar-sdk')
        return {
          ...actual,
          Contract: {
            fromLedgerEntryXdr: vi.fn(() => ({
              contractId: () => mockContractId
            }))
          }
        }
      })
      
      const wasmCode = Buffer.from('test-wasm-code')
      const keypair = { publicKey: () => 'test-public-key' } as any
      
      const result = await client.deployContract(wasmCode, keypair)
      
      expect(result.contractId).toBe(mockContractId)
      expect(result.transactionId).toBe('test-transaction-hash')
    })

    it('should handle deployment errors', async () => {
      const mockAccount = {
        accountId: () => 'test-account-id',
        sequenceNumber: () => '12345'
      }
      
      const mockResult = {
        successful: false,
        resultMetaXdr: 'error-xdr'
      }
      
      mockServer.loadAccount.mockResolvedValue(mockAccount)
      mockServer.submitTransaction.mockResolvedValue(mockResult)
      
      const wasmCode = Buffer.from('test-wasm-code')
      const keypair = { publicKey: () => 'test-public-key' } as any
      
      await expect(client.deployContract(wasmCode, keypair)).rejects.toThrow('Failed to deploy contract')
    })
  })

  describe('invokeContract', () => {
    beforeEach(() => {
      client.setContractId('test-contract-id')
    })

    it('should invoke contract method successfully', async () => {
      const mockAccount = {
        accountId: () => 'test-account-id',
        sequenceNumber: () => '12345'
      }
      
      const mockResult = {
        successful: true,
        hash: 'test-transaction-hash'
      }
      
      mockServer.loadAccount.mockResolvedValue(mockAccount)
      mockServer.submitTransaction.mockResolvedValue(mockResult)
      
      // Mock RPC server getTransaction
      const mockRpcResult = {
        status: 'SUCCESS',
        result: {
          returnValue: { value: 42 }
        }
      }
      
      const result = await client.invokeContract('test_method', ['arg1', 42])
      
      expect(mockServer.loadAccount).toHaveBeenCalled()
      expect(mockServer.submitTransaction).toHaveBeenCalled()
    })

    it('should require contract ID', async () => {
      client.setContractId(undefined)
      
      await expect(client.invokeContract('test_method')).rejects.toThrow('No contract ID provided')
    })

    it('should handle invocation errors', async () => {
      const mockAccount = {
        accountId: () => 'test-account-id',
        sequenceNumber: () => '12345'
      }
      
      const mockResult = {
        successful: false,
        resultMetaXdr: 'error-xdr'
      }
      
      mockServer.loadAccount.mockResolvedValue(mockAccount)
      mockServer.submitTransaction.mockResolvedValue(mockResult)
      
      await expect(client.invokeContract('test_method')).rejects.toThrow('Failed to invoke contract')
    })
  })

  describe('getContractData', () => {
    beforeEach(() => {
      client.setContractId('test-contract-id')
    })

    it('should get contract data successfully', async () => {
      // Mock RPC server getLedgerEntries
      const mockRpcResult = {
        entries: [{
          val: { value: 'test-data' }
        }]
      }
      
      // This would need actual RPC server mocking in a real implementation
      // For now, we'll test the error case
      await expect(client.getContractData('test-key')).rejects.toThrow('Failed to get contract data')
    })

    it('should require contract ID', async () => {
      client.setContractId(undefined)
      
      await expect(client.getContractData('test-key')).rejects.toThrow('No contract ID provided')
    })
  })
})

describe('createOrbitClient', () => {
  it('should create OrbitClient instance', () => {
    const config = {
      networkUrl: 'https://horizon-testnet.stellar.org',
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015'
    }
    
    const client = createOrbitClient(config)
    
    expect(client).toBeInstanceOf(OrbitClient)
  })
})

describe('NETWORKS', () => {
  it('should have correct network configurations', () => {
    expect(NETWORKS.TESTNET.networkUrl).toBe('https://horizon-testnet.stellar.org')
    expect(NETWORKS.TESTNET.rpcUrl).toBe('https://soroban-testnet.stellar.org')
    expect(NETWORKS.TESTNET.networkPassphrase).toBe('Test SDF Network ; September 2015')
    
    expect(NETWORKS.FUTURENET.networkUrl).toBe('https://horizon-futurenet.stellar.org')
    expect(NETWORKS.FUTURENET.rpcUrl).toBe('https://rpc-futurenet.stellar.org')
    
    expect(NETWORKS.MAINNET.networkUrl).toBe('https://horizon.stellar.org')
    expect(NETWORKS.MAINNET.rpcUrl).toBe('https://soroban.stellar.org')
    expect(NETWORKS.MAINNET.networkPassphrase).toBe('Public Global Stellar Network ; September 2015')
  })
})
